import fitz 
import base64
import os
import redis
import json
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine  
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import datetime
import time
# Force unbuffered output
import sys
import io
sys.stdout = io.TextIOWrapper(open(sys.stdout.fileno(), 'wb', 0), write_through=True)

# Load environment variables from .env file
load_dotenv()


# Replace with your token
client = InferenceClient(
    "meta-llama/Meta-Llama-3-8B-Instruct",
    token=os.environ.get("HUGGINGFACE_TOKEN")
)
print("Worker is ready to process jobs...")

# Use environment variables for Redis connection
r = redis.Redis(
    host=os.environ.get("REDIS_HOST", "localhost"),
    port=int(os.environ.get("REDIS_PORT", 6379)),
    decode_responses=True
)
pubsub = r.pubsub()

# Test Redis connection
try:
    ping_result = r.ping()
    print(f"Redis connection test: {'SUCCESS' if ping_result else 'FAILED'}")
except Exception as e:
    print(f"Redis connection error: {str(e)}")

# Subscribe to the pdf_jobs channel
pubsub.subscribe("pdf_jobs")
print("Subscribed to pdf_jobs channel")

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()  

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()  
    return text

def deanonymize_json(json_str: str, anonymization_mapping):
    """Deanonymize JSON string using the mapping from anonymization"""
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        print("Failed to parse JSON, returning original string")
        return json_str
    
    # Recursive replace function
    def replace_placeholders(obj):
        if isinstance(obj, str):
            for placeholder, original in anonymization_mapping.items():
                obj = obj.replace(placeholder, original)
            return obj
        elif isinstance(obj, dict):
            return {k: replace_placeholders(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [replace_placeholders(v) for v in obj]
        else:
            return obj
    
    return replace_placeholders(data)

def anonymize_text(text):
    """Anonymize text and return both anonymized text and mapping for deanonymization"""
    results = analyzer.analyze(
        text=text,
        entities=["PERSON",  "PHONE_NUMBER", "EMAIL_ADDRESS", "LOCATION"],
        language="en"
    )
    
    if not results:
        print("No sensitive entities found")
        return text, {}
    
    from presidio_anonymizer.entities import OperatorConfig
    anonymizers_config = {}
    anonymization_mapping = {}  # For deanonymization
    
    entity_counters = {}
    
    for result in results:
        entity_type = result.entity_type
        if entity_type not in entity_counters:
            entity_counters[entity_type] = 0
        entity_counters[entity_type] += 1
        
        placeholder = f"<{entity_type}_{entity_counters[entity_type]}>"
        
        # Extract the original text using start and end positions
        original_text = text[result.start:result.end]
        
        # Store mapping for deanonymization
        anonymization_mapping[placeholder] = original_text
        
        # Configure anonymizer using OperatorConfig
        anonymizers_config[entity_type] = OperatorConfig(
            "replace", 
            {"new_value": placeholder}
        )
    
    
    # Anonymize the text
    anonymized_result = anonymizer.anonymize(
        text=text,
        analyzer_results=results,
        operators=anonymizers_config
    )
    
    return anonymized_result.text, anonymization_mapping

def process_pdf(pdf_base64: str):
    try:
        # Decode PDF
        pdf_bytes = base64.b64decode(pdf_base64)
        text = extract_text_from_pdf_bytes(pdf_bytes)
        
        if not text.strip():
            return json.dumps({"error": "No text found in PDF"})
        
        # Anonymize text
        anonymized_text, mapping = anonymize_text(text)
        
        # Prepare messages for LLM
        messages = [
            {
                "role": "system",
                "content": "You are a medical document parser. Always extract structured information into JSON. Respond ONLY with valid JSON that follows the schema strictly. Do not add explanations or extra text."
            },
            {
                "role": "user",
                "content": f"""
Extract the following fields from the document text. If information is missing, return null.

Schema:
{{
"patient_name": string | null,
"doctor_name": string | null,
"hospital_name": string | null,
"date": string (DD/MM/YYYY) | null,
"medicine": [
    {{
    "name": string,
    "dosage": string | null,
    "frequency": string | null,
    "duration": string | null
    }}
]
}}

Document text:
{anonymized_text}
"""
            }
        ]
        
        # Send to LLM
        response = client.chat_completion(
            messages=messages,
            temperature=0.1,
            max_tokens=1000
        )
        
        llm_response = response.choices[0].message.content
        
        # Deanonymize the response
        deanonymized_response = deanonymize_json(llm_response, mapping)
        
        return json.dumps(deanonymized_response) if isinstance(deanonymized_response, dict) else deanonymized_response
        
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        return json.dumps({"error": f"Processing failed: {str(e)}"})

def handle_job(message):
    try:
        if message["type"] != "message":
            return
            
        data = json.loads(message["data"])
        jobId = data["jobId"]
        pdfBase64 = data["pdfBase64"]
        
        print(f"Processing job {jobId}...")
        result = process_pdf(pdfBase64)
        
        # Save result in Redis
        r.set(f"pdf_result:{jobId}", result)
        
        # Publish completion event
        completion_data = {
            "jobId": jobId,
            "status": "completed",
            "completedAt": datetime.datetime.now().isoformat()
        }
        r.publish("job_completions", json.dumps(completion_data))
        
        print(f"Job {jobId} completed and saved to Redis")
        
    except Exception as e:
        print(f"Error handling job: {str(e)}")
        if 'jobId' in locals():
            r.set(f"pdf_result:{jobId}", json.dumps({"error": str(e)}))
            # Publish error event
            error_data = {
                "jobId": jobId,
                "status": "error",
                "error": str(e),
                "completedAt": datetime.datetime.now().isoformat()
            }
            r.publish("job_completions", json.dumps(error_data))

# Main loop to process messages
print("Starting message processing loop...")
try:
    # Heartbeat to show the worker is alive
    counter = 0
    while True:
        # Get messages with a timeout so we can also do the heartbeat
        message = pubsub.get_message(timeout=1)
        if message:
            handle_job(message)
            
        counter += 1
        if counter % 60 == 0:  # Log every minute
            print(f"Worker is alive - uptime: {counter} seconds")
            
except KeyboardInterrupt:
    print("Worker stopped by user")
except Exception as e:
    print(f"Worker error: {str(e)}")
finally:
    pubsub.close()