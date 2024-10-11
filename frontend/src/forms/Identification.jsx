import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import React, { useCallback } from "react";

import { CheckIcon, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { onUpload } from "./fileUploader";
import { Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "@/components/ui/use-toast";

const Identification = ({ errors, register, control }) => {
  const [file, setFile] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div className=" py-4 flex flex-col gap-2 ">
      <h1 className=" text-3xl font-bold mb-2"> Identification</h1>
      <div className=" flex-1 text-gray-400 my-2">
        <Label htmlFor="identificationType">
          <span className=" text-gray-400 text-md "> Identification Type</span>
        </Label>

        <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
          <select
            defaultValue="adhaar"
            className=" bg-dark-400 text-white w-full p-2 rounded-md"
            {...register("identificationType")}
          >
            <option value="adhaarCard">AdhaarCard</option>
          </select>
        </div>
      </div>
      <div className=" flex-1 text-gray-400 my-2">
        <Label htmlFor="adhaarNumber">Adhaar Number</Label>
        <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
          <Input
            id="adhaarNumber"
            placeholder="ex: Asthma diagnosis in childhood"
            className=" border-0 shad-input text-zinc-100 font-normal"
            autoComplete="off"
            {...register("adhaarNumber")}
          />
        </div>
        {errors.adhaarNumber && (
          <span className="text-red-700"> {errors.adhaarNumber.message}</span>
        )}
        <div className=" flex-1 text-gray-400 my-2">
          <Label htmlFor="verifyDoc">
            <span>Identification Document</span>
          </Label>

          <div className=" flex justify-center items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <div {...getRootProps()} className="file-upload w-full">
              <Controller
                name="identificationDocument"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  // />
                  <input
                    type="file"
                    {...getInputProps()}
                    onChange={async (data) => {
                     
                      const t = await onUpload(data);
                      setFile(t);
                      field.onChange(t);
                    }}
                  ></input>
                )}
              />
              {file && file.length > 0 ? (
                <>
                  <img
                    src={file}
                    height={500}
                    width={500}
                    className=" overflow-hidden"
                  />
                </>
              ) : (
                <>
                  <div className="file-upload_label text-center">
                    <p className="text-14-regular ">
                      <span className="text-green-500">Click to upload </span>
                      or drag and drop
                    </p>
                    <p className="text-12-regular">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                  </div>
                </>
              )}

              {errors.identificationDocument && (
                <span className="text-red-700">
                  {" "}
                  {errors.identificationDocument.message}
                </span>
              )}
            </div>
            <div className=""></div>
          </div>
        </div>
        {
          // error.verifyDoc && <span className="text-red-700"> {error.verifyDoc}</span>
        }
      </div>
    </div>
  );
};

export default Identification;

/* File upload */

/* Auto layout */
