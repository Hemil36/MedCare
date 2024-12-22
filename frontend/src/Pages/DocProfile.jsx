import React, { useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CalendarArrowDown,
  CalendarRange,
  Mail,
  Phone,
  User,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as Shad } from "@/components/ui/calendar";
import "react-day-picker/dist/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RadioGroupItem as Hip,
  RadioGroup as Hipo,
} from "@/components/ui/radio-group";

import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getpatientID,
  getProfile,
  getUser,
  setProfile,
} from "@/lib/store/UserSlice";
import { zodResolver } from '@hookform/resolvers/zod';
import { PatientFormValidation } from "@/forms/validation/patientRegister";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { getDoctorDetails, updateDoctorDetails, updatePatient } from "@/lib/store/AsyncThunks";
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { docprofileValidation, profileValidation } from "@/forms/validation/UpdateProfile";
import { onUpload } from "@/forms/fileUploader";

const DocProfile = () => {
  const dispatch = useDispatch();
  const error = {};

  const user = useSelector(getProfile);


  const [file, setFile] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [doctor, setDoctor] = React.useState(null);
  const navigate = useNavigate();
  const doctorID = useSelector((state) => state.user.user.doctorID);
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
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: doctor?.name,
      email: doctor?.email,
      phone: doctor?.phone,
      birthDate: doctor?.birthDate,
      gender: doctor?.gender,
      ClinicPhoneNumber: doctor?.ClinicPhoneNumber,
      clinicAddress: doctor?.clinicAddress,
      photo : doctor?.photo

    }
  });
 
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await dispatch(getDoctorDetails({ doctorID })).unwrap();
        setDoctor(response);
        setFile(response.photo);
      } catch (e) {
        console.log(e);
      }
    };

    if (doctorID) {
      fetchDoctorDetails();
    }
  }, [dispatch, doctorID]);

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone.toString(),
        birthDate: doctor.birthDate,
        clinicAddress: doctor.clinicAddress,
        clinicPhoneNumber: doctor.clinicPhoneNumber.toString(),
        gender:doctor?.gender,
        photo: doctor.photo

        // Add other fields as needed
      });
    }
  }, [doctor, reset]);
//   console.log(doctor);

  

  const [date, setDate] = React.useState(user?.birthDate);
 
const submit =  (data) => {

  try{
    dispatch(updateDoctorDetails({doctorID: user.doctorID, data}));
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    dispatch(setProfile(data));
  }
  catch(e){
    toast({
      title: "An Error Occoured",
    });
  }
}

 

  return (
    <div className=" h-full w-full px-[5%] pt-[1%] overflow-auto   remove-scrollbar">
      <div className=" flex justify-between pb-4 pt-2">
        <h1 className=" text-left text-2xl font-bold  ">MedID</h1>
        <div className="flex gap-4">
        <Link to={`/doctor/${doctorID}`} className=" font-sans font-semibold"  >
        
            Home
          </Link>
        </div>
      </div>
      <h1 className="text-2xl font-semibold mb-3">Profile</h1>
      <form onSubmit={handleSubmit(submit)}>
        <div className="overflow-auto pl-2">
          <div className="flex flex-col gap-2">
            <div className=" flex justify-between w-full">
<div className="  flex-1 flex-col">

            <div className=" flex-1  text-gray-400 my-2">
              <Label htmlFor="name">
                <span className={cn("", { "text-red-700": error.name })}>
                  {" "}
                  Full Name{" "}
                </span>
              </Label>
              <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                <User className="ml-2 " color="#ffffff" />
                <Input
                  id="name"
                  placeholder="ex Jane Doe"
                  className=" border-0 shad-input text-zinc-100 font-normal"
                  autoComplete="off"
                  disabled
                  value={user.name}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <span className="text-red-700"> {errors.name.message} </span>
              )}
            </div>
            <div className=" flex-1  text-gray-400 my-2">
                <Label htmlFor="email">
                  <span className={cn("", { "text-red-700": error.email })}>
                    {" "}
                    {!error.email ? "Email Address" : error.email}{" "}
                  </span>
                </Label>
                <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                  <Mail className="ml-2 " color="#ffffff" />
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    className=" border-0 shad-input text-zinc-100 font-normal"
                    autoComplete="off"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-700"> {errors.email.message} </span>
                )}
              </div>
              <div className=" flex-1  text-gray-400 my-2">
                <Label htmlFor="phone">
                  <span className={cn("", { "text-red-700": error.phone })}>
                    {" "}
                    {!error.phone ? "Phone number" : error.phone}{" "}
                  </span>
                </Label>
                <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                  <Phone className="ml-2 " color="#ffffff" />
                  <Input
                    id="phone"
                    placeholder="Enter your phone"
                    className=" border-0 shad-input text-zinc-100 font-normal"
                    autoComplete="off"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <span className="text-red-700"> {errors.phone.message} </span>
                )}
              </div>
          </div>
            
            <div className=" flex flex-col pl-4 text-gray-400 my-2">
          <Label htmlFor="verifyDoc">
            <span>Photo</span>
          </Label>

          <div className=" flex justify-center items-center bg-dark-400 rounded-md mt-1 w-fit  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
            <div {...getRootProps()}  className="file-upload w-full">
              <Controller
                name="photo"
                control={control}
                defaultValue={file}
                render={({ field }) => (
                  // />
                  <input
                    type="file"
                    {...getInputProps()}

                    onChange={async (data) => {
                     
                      const t = await onUpload(data);
                      field.onChange(t);
                      setFile(t);
                    }}
                  ></input>
                )}
              />
              {file && file.length > 0 ? (
                <>
                  <img
                    src={file}
                    height={100}
                    width={100}
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

              {errors.photo && (
                <span className="text-red-700">
                  {" "}
                  {errors.photo.message}
                </span>
              )}
            </div>
            <div className=""></div>
          </div>
        </div>
        </div>
            

            <div className="flex flex-col md:flex-row gap-2">
            <div className=" flex-1 text-gray-400 my-2">
                <Label htmlFor="clinicPhoneNumber">
                  <span
                    className={cn("", { "text-red-700": error.clinicPhoneNumber })}
                  >
                    {" "}
                    {!error.clinicPhoneNumber
                      ? "Clinic Phone Number"
                      : error.clinicPhoneNumber}{" "}
                  </span>
                </Label>
                <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                  <Phone className="ml-2 " color="#ffffff" />
                  <Input
                    id="clinicPhoneNumber"
                    placeholder="Enter Clinic Phone Number"
                    className=" border-0 shad-input text-zinc-100 font-normal"
                    autoComplete="off"
                    {...register("clinicPhoneNumber")}
                  />
                </div>
                {errors.clinicPhoneNumber && (
                  <span className="text-red-700">
                    {" "}
                    {errors.clinicPhoneNumber.message}{" "}
                  </span>
                )}
              </div>
            
              <div className=" flex-1 text-gray-400 my-2">
                <Label htmlFor="phone">
                  <span className={cn("", { "text-red-700": error.phone })}>
                    Gender
                  </span>
                </Label>
                <div className=" flex items-center flex-row rounded-md mt-1  ">
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={user.gender}
                    render={({ field }) => (
                      <Hipo
                        className="flex h-11 gap-6 justify-center xl:justify-between  j"
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled
                      >
                        <div className="radio-group">
                          <Hip id="male" value="M"></Hip>
                          <Label htmlFor="male">Male</Label>
                          <Hip id="female" value="F"></Hip>
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </Hipo>
                    )}
                  />
                </div>
                {errors.gender && (
                  <span className="text-red-500">
                    {" "}
                    {errors.gender.message}{" "}
                  </span>
                )}
              </div>
            </div>

           

            <div className=" flex gap-2 flex-col md:flex-row">
            <div className=" flex-1 text-gray-400 my-2">
                <Label htmlFor="Occupation">
                  <span
                    className={cn("", { "text-red-700": error.Occupation })}
                  >
                    {" "}
                    {!error.clinicAddress ? "Clinic address" : error.clinicAddress}{" "}
                  </span>
                </Label>
                <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                  <Textarea
                    id="clinicAddress"
                    placeholder="Enter your clinicAddress"
                    className=" border-0 shad-input text-zinc-100 font-normal"
                    autoComplete="off"
                    {...register("clinicAddress")}
                  />
                </div>
                {errors.clinicAddress && (
                  <span className="text-red-700">
                    {" "}
                    {errors.clinicAddress.message}{" "}
                  </span>
                )}
              </div>
              
            </div>

            {/* <FormField type="name" error={error} message="invalid emergencyPhone" placeholder="Enter name" /> */}
          </div>
          <Button
            className="bg-green-500 text-white w-[5rem] my-3"
            type="submit"
          >
            Update{" "}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocProfile;
