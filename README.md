# Hemil36 MedCare

A comprehensive medical care application for managing appointments, prescriptions, and patient-doctor interactions. Built with a modern tech stack for both web and desktop environments.

## Features

### Backend
- **Appointment Management**: Schedule and track medical appointments with ease.
- **Prescription Handling**: Generate and manage digital prescriptions for patients.
- **Authentication**: Secure JWT-based authentication for users and doctors.
- **File Uploads**: Supports image and file uploads via Multer.
- **Notifications & Reminders**: Email notifications and cron-based reminders for appointments.
- **PDF Generation**: Create and manage PDF prescriptions using jspdf and pdfkit.
- **AI Integration**: Leverage Google Gemini for AI-powered features.

### Frontend
- **User Roles**: Separate interfaces for patients, doctors, and admins.
- **Appointment Booking**: Interactive calendar and form for scheduling appointments.
- **Profile Management**: Edit personal and medical details.
- **Prescription Viewer**: Render and view PDF prescriptions directly in the browser.
- **Responsive UI**: Built with Tailwind CSS for a modern and responsive design.
- **Desktop Support**: Tauri-based desktop application build for cross-platform compatibility.

## Feature Details

### Backend Features

#### Appointment Management
- **Scheduling**: Patients can book appointments with doctors based on real-time availability, while doctors and admins can manually schedule or reschedule appointments.
- **Tracking**: A robust API allows retrieval of appointment histories, upcoming schedules, and status updates (e.g., confirmed, canceled).
- **Automation**: Cron jobs (cron.js) ensure reminders are sent at predefined intervals, enhancing reliability.

#### Prescription Handling
- **Creation**: Doctors can create digital prescriptions post-consultation, specifying medications, dosages, and instructions, stored securely in MongoDB.
- **Management**: Patients and doctors can retrieve, update, or delete prescriptions via dedicated API endpoints, ensuring flexibility and data accuracy.
- **PDF Export**: Prescriptions are convertible to PDF format using jspdf and pdfkit, facilitating sharing or printing.

#### Authentication
- **JWT Security**: JSON Web Tokens (JWT) secure user sessions, with middleware (verifyJWT.js) validating tokens for protected routes.
- **Role-Based Access**: Separate logic for patients, doctors, and admins ensures users access only their authorized features.
- **Token Refresh**: A refresh mechanism (verifyRefresh.js) extends session longevity without requiring repeated logins.

#### File Uploads
- **Multer Integration**: Supports uploading medical files (e.g., images, PDFs) via Multer, with storage options configurable to local disk or Appwrite.
- **Accessibility**: Uploaded files are linked to patient records, retrievable via unique identifiers for doctor or patient review.

#### Notifications & Reminders
- **Email System**: Nodemailer powers email notifications for appointment confirmations, reminders, and account actions (e.g., password resets).
- **Cron-Based Scheduling**: The cron.js controller schedules reminders, ensuring timely alerts for upcoming appointments or follow-ups.
- **Extensibility**: Potential for SMS or in-app notifications with additional integrations.

#### PDF Generation
- **Dynamic PDFs**: Tools like jspdf and pdfkit generate structured PDFs for prescriptions, including QR codes (via qrcode) for verification.
- **Customization**: Templates can be adjusted to include clinic branding or additional patient data.

#### AI Integration
- **Google Gemini**: Integrates Google's Gemini API (gemini.js) for AI-driven features, such as symptom analysis, automated triage suggestions, or prescription recommendations.
- **Scalability**: The AI component can evolve to include chatbot support or predictive analytics with further development.

### Frontend Features

#### User Roles
- **Patients**: Access appointment booking, prescription viewing, and profile updates.
- **Doctors**: Manage appointments, create prescriptions, and review patient records.
- **Admins**: Oversee user management, approve doctor registrations, and monitor system health via a dashboard.

#### Appointment Booking
- **Interactive Calendar**: A UI component (calendar.jsx) displays doctor availability, allowing patients to pick slots intuitively.
- **Form Validation**: Appointment forms (AppointmentForm.jsx) enforce constraints like date ranges and required fields, validated via appointmentValidation.js.

#### Profile Management
- **Personal Details**: Users update contact info, medical history (patients), or specialties (doctors) through dedicated pages (UserProfile.jsx, DocProfile.jsx).
- **Security**: Updates are secured with JWT authentication and validated server-side to prevent unauthorized changes.

#### Prescription Viewer
- **PDF Rendering**: React PDF (react-pdf) renders prescriptions in-browser, with options to download or print.
- **User Experience**: A clean interface (Prescription.jsx) ensures patients can easily interpret medication instructions.

#### Responsive UI
- **Tailwind CSS**: Provides a modern, mobile-friendly design with reusable components (button.jsx, card.jsx) styled consistently across the app.
- **Accessibility**: Ensures usability across devices, from desktops to tablets, with adaptive layouts.

#### Desktop Support
- **Tauri Framework**: Converts the React app into a lightweight desktop executable, supporting Windows, macOS, and Linux.
- **Native Features**: Leverages Rust (src-tauri/src/main.rs) for performance and potential system-level integrations (e.g., file system access).

## Technologies Used

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose for schema management)
- **Authentication**: JSON Web Tokens (JWT)
- **File Handling**: Multer for file uploads
- **Testing**: Jest for unit and integration testing
- **Other**: Cron for scheduling, Nodemailer for email notifications, Google Gemini for AI integration

### Frontend
- **Core**: React.js
- **Styling**: Tailwind CSS
- **PDF Rendering**: React PDF
- **State Management**: Redux Toolkit
- **Build Tool**: Vite
- **Desktop**: Tauri (Rust-based for lightweight desktop builds)

## Installation

### Clone the Repository:
```bash
git clone https://github.com/hemil36/hemil36-medcare.git
cd hemil36-medcare
```

### Backend Setup:
```bash
cd backend
npm install
# Create .env file with the following variables:
MONGODB_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend Setup:
```bash
cd ../frontend
npm install
```

### Tauri Desktop (Optional):
```bash
cd src-tauri
cargo install tauri-cli
```

## Usage

### Start Backend:
```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

### Start Frontend:
```bash
cd frontend
npm run dev
# Access at http://localhost:5173
```

### Build Desktop App:
```bash
cd src-tauri
cargo tauri build
```

## API Endpoints

### Auth
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/signup | POST | Patient/Doctor registration |
| /api/auth/login | POST | User login |
| /api/auth/refresh | POST | Refresh JWT token |

### Appointments
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/appointments | POST | Create new appointment |
| /api/appointments | GET | Fetch all appointments |
| /api/appointments/:id | GET | Fetch a specific appointment |
| /api/appointments/:id | PUT | Update an appointment |
| /api/appointments/:id | DELETE | Delete an appointment |

### Prescriptions
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/prescriptions | POST | Create a new prescription |
| /api/prescriptions | GET | Fetch all prescriptions |
| /api/prescriptions/:id | GET | Fetch a specific prescription |
| /api/prescriptions/:id | PUT | Update a prescription |
| /api/prescriptions/:id | DELETE | Delete a prescription |

### Files
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/upload | POST | Upload medical files |
| /api/files/:id | GET | Fetch a specific file |

## Testing

Run Jest tests for the backend:

```bash
cd backend
npm test
```

## Directory Structure
```
hemil36-medcare/
├── backend/
│   ├── controllers/          # Business logic for routes
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── services/             # Helper services (email, AI, etc.)
│   ├── middleware/           # Authentication and validation
│   ├── lib/                  # Utility functions
│   ├── _tests/               # Test cases
│   └── index.js              # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── Pages/            # Application pages
│   │   ├── forms/            # Form components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
│   └── vite.config.js        # Vite configuration
└── src-tauri/                # Tauri desktop app configuration
```

## Acknowledgments
- **React PDF**: For document rendering.
- **Tauri**: For lightweight desktop builds.
- **Google Gemini**: For AI-powered features.

## Note
Ensure MongoDB is running locally or update the .env configuration for cloud databases. CORS is configured for http://localhost:5173 by default.
