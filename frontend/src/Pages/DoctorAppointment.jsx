import { Select, SelectContent, SelectTrigger } from "@/components/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Calendar, Eye, Loader, Mail, Phone, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Otp } from "./Otp";
import AxiosPrivate from "@/hooks/AxiosPrivate";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OtpDoc } from "./OTPdoc";
import { ScrollArea } from "@/components/ui/scroll-area";
import Appointment from "./Appointment";
import { Textarea } from "@/components/ui/textarea";
import { generateOTP, handleSubmit, recordAppointment } from "@/lib/store/AsyncThunks";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { getDoctorID } from "@/lib/store/UserSlice";

const DoctorAppointment = () => {
  const axios = AxiosPrivate();
  const [open, setOpen] = React.useState(false);
  const [fetch, setFetch] = React.useState(true);
  const [records, setRecords] = React.useState(null);
  const[currentAppointment, setCurrentAppointment] = React.useState(null);
  const [patient , setPatient] = React.useState("");
  const [appointments, setAppointments] = React.useState(null);
  const [verify , setVerify] = React.useState(false);
  const[prescription , setPrescription] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [symptoms, setSymptoms] = React.useState("");
  const urlParams = new useParams();
  const myParam = urlParams.appointmentID;
  const patientID = currentAppointment?.appointment?.patientID
  // console.log(patient)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctorId = useSelector(getDoctorID)

  useEffect(()=>{
    const getAppointmentDetails = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/getAppointmentdetails", {
          appointmentID: myParam,
        });
        setCurrentAppointment(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAppointmentDetails()
  },[])

  useEffect(()=>{
    const getPatient = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/getuser", {
          patientID,
        });
        // console.log(response)
        setPatient(response.data[0]);
      } catch (error) {
        console.log(error);
      }
    }
    getPatient()
  },[patientID])


  const submit = async (e) => {
    e.preventDefault();
    const { symptoms, notes , diagnosis } = e.target;
    // console.log(symptoms.value, prescription.value, notes.value);
    console.log(diagnosis.value)
    try {
      await dispatch(
        recordAppointment({
          appointmentID: myParam,
          symptoms: symptoms.value,
          prescription: medications,
          notes: notes.value,
          patientName: patient.name,
          diagnosis : diagnosis.value,
          email: patient.email,
        })
      ).unwrap();
      toast({
        title: "Success",
      })
      navigate(`/doctor/${doctorId}`)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(verify){

    const getRecords = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/getRecords", {
          patientID,
        });
        setRecords(response.data.filteredFiles);
      } catch (error) {
        console.log(error);
      }
    }

    getRecords()

    const getAppointments = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/getappointmentbydoctor",{
          patientID,
        });
        setAppointments(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getAppointments()
}

  },[verify])
  const doctorID = useSelector((state) => state.user.user.doctorID);
  const [medications, setMedications] = useState([
   
  ]);

  const [newMed, setNewMed] = useState({
    name: '',
    dose: '',
    frequency: '',
    duration: '',
  });

  // Handler to update an existing medication in the table
  const handleChange = (id, field, value) => {
    const updatedMedications = medications.map((med) => 
      med.id === id ? { ...med, [field]: value } : med
    );
    setMedications(updatedMedications);
  };

  const addRow = () => {
    if (newMed.name && newMed.dose && newMed.frequency && newMed.duration) {
      const newEntry = { id: medications.length + 1, ...newMed };
      setMedications([...medications, newEntry]);
      setNewMed({ name: '', dose: '', frequency: '', duration: '' }); // Reset input fields after adding
    }
    else toast({
      title: "Please fill all fields",
    })
  };

  const deleteRow = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMed({ ...newMed, [name]: value });
  };
  

  return (
    <div className="flex h-screen ">

    <section className=" container-1 remove-scrollbar">
      {open && <OtpDoc setVerify={setVerify} setOpen={setOpen} />}
      <div className=" flex justify-between p-5">
        <h1 className=" text-left text-2xl font-bold  ">MedID</h1>
        <div className="flex gap-4">
        <Link to={`/doctor/${doctorID}`} className="text-green-500">
            Home
          </Link>
          <Link to={`/doctor/${doctorID}/profile/`} className="text-green-500">
            Profile
          </Link>
        </div>
      </div>

      <div className=" flex-grow flex flex-col   my-3 mx-6 gap-4 ">
        <h2 className=" text-2xl font-semibold">Appointment Number : #44555</h2>
        <h3 className=" font-semibold text-xl ">Patient Details</h3>
        <div className="overflow-auto pl-2 flex  gap-2 ">
          <div className=" w-1/2  text-gray-400 my-2">
            <Label htmlFor="name">
              <span>Full Name</span>
            </Label>
            <div className="  flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
              <User className="ml-2 " color="#ffffff" />
              <Input
                id="name"
                placeholder="ex Jane Doe"
                className=" border-0 shad-input text-zinc-100 font-normal"
                autoComplete="off"
                disabled
                value={patient?.name}
              />
            </div>
          </div>
          <div className=" w-1/2   text-gray-400 my-2 flex-1">
            <Label htmlFor="phone">
              <span>Phone Number</span>
            </Label>
            <div className=" flex items-center  bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
              <Phone className="ml-2 " color="#ffffff" />
              <Input
                id="phone"
                placeholder="Enter your phone"
                className=" border-0 shad-input text-zinc-100 font-normal"
                autoComplete="off"
                value={patient?.phone}
                disabled
              />
            </div>
          </div>

          
        </div>
          <div>
           { verify ?<>
            <div className="flex gap-4 space">
           <div className=" flex flex-col items-center  max-h-[50dvh] w-1/2   ">
           <h1 className="text-xl font-semibold self-start py-2"> Records </h1>

      <ScrollArea className="  rounded-md w-full  ">

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">Record</TableHead>
            <TableHead className="">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {

            records && records.map((record) => {
              const date = new Date(record.$createdAt);
              const href=`https://cloud.appwrite.io/v1/storage/buckets/Image/files/${record.$id}/view?project=66a12c91000a4cded686`
              const href1=`https://cloud.appwrite.io/v1/storage/buckets/Image/files/${record.$id}/download?project=66a12c91000a4cded686`

              return (

                <TableRow key={record.name} className="py-2">
                  <TableCell className="text-nowrap">{record.name.slice(15)}</TableCell>
                  <TableCell className="text-nowrap">{date.toDateString()}</TableCell>
                  <TableCell><a href={href} target="_blank" ><Button ><Eye className=" hover:bg-green-400 rounded-md " /></Button></a></TableCell>

                </TableRow>
              );
            })
          }
         
        </TableBody>
      </Table>
      </ScrollArea>

    </div>
    <div className=" flex flex-col items-center max-h-[50dvh] w-1/2   ">
    <h1 className="text-xl font-semibold self-start">Appointments</h1>
    <ScrollArea className=" h-[19rem] w-full ">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">Doctor</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments && appointments.map((appointment) => {
                      const date = new Date(appointment.appointment.date);
                      if(appointment.appointment.status=="completed")
                      return (
                        <Dialog key={appointment.appointment._id}>
                          <DialogTrigger asChild>
                            <TableRow
                              key={appointment.appointment._id}
                              className="hover:cursor-pointer hover:bg-dark-400 rounded-lg"
                            >
                              <TableCell className="font-medium text-nowrap">
                                {appointment.doctorDetails.name}
                              </TableCell>
                              <TableCell>{date.toDateString()}</TableCell>
                            </TableRow>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] text-white jakarta border-0 bg-black rounded-full">
                            <DialogHeader>
                              <DialogTitle className="text-center text-2xl">
                                Appointment details
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  Doctor
                                </Label>
                                <Input
                                disabled
                                  id="name"
                                  value={appointment?.doctorDetails.name}
                                  className="shad-input col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
                                  Date
                                </Label>
                                <Input
                                disabled
                                  id="username"
                                  value={date.toDateString()}
                                  className="col-span-3 shad-input"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
                                  Type
                                </Label>
                                <Input
                                disabled
                                  id="username"
                                  value={appointment.appointment.status}
                                  className="col-span-3 shad-input"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
                                  Prescription
                                </Label>
                                <Input
                                disabled
                                  id="username"
                                  value={
                                    appointment.appointment?.prescription ||
                                    " No   Prescription"
                                  }
                                  className="col-span-3 shad-input"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="username"
                                  className="text-right"
                                >
                                  Notes
                                </Label>
                                <Input
                                disabled
                                  id="username"
                                  value={
                                    appointment.appointment?.notes ||
                                    " No  Notes"
                                  }
                                  className="col-span-3 shad-input"
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>

    </div>
    </div>
    </>:<>
    
          {/* <div className=" h-full w-full relative">
            <Loader className="animate-spin h-10 w-10 absolute top-1/3 right-1/2" />
          </div> */}
    </>

           }
          </div>
            
       { !verify &&   <Button className="bg-green-500 p-2 rounded-md w-fit " onClick={async (e)=>{setOpen(true)
          // console.log(patient)
            await dispatch(generateOTP({ email : patient.email}));
          }}>Get Patient's History</Button>}

          <form onSubmit={submit}>
        <section className="flex flex-col md:flex-row gap-2">

          <div className="w-full">
            <h3 className=" font-semibold">Diagnosis</h3>
            <div className=" flex items-center  bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">

            <Input className=" flex-growth border-0 shad-input text-zinc-100 font-normal" id="diagnosis" />
            </div>
        
          </div>
          <div className="w-full">
            <h3 className=" font-semibold">Symptoms</h3>
            <div className=" flex items-center  bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">

            <Input className=" flex-growth border-0 shad-input text-zinc-100 font-normal" id="symptoms" />
            </div>
        
          </div>
          
          
        </section>
        <div style={{ padding: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{  textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid ' }}>#</th>
            <th style={{ padding: '10px', border: '1px solid ' }}>Medication</th>
            <th style={{ padding: '10px', border: '1px solid ' }}>Dose</th>
            <th style={{ padding: '10px', border: '1px solid ' }}>Frequency</th>
            <th style={{ padding: '10px', border: '1px solid ' }}>Duration</th>
            <th style={{ padding: '10px', border: '1px solid ' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med) => (
            <tr key={med.id}>
              <td style={{ padding: '10px', border: '1px solid ' }}>{med.id}</td>
              <td style={{ padding: '10px', border: '1px solid ' }}>
                <Input
                className="flex-growth border-0 shad-input text-zinc-100 font-normal"
                type="text"
                  value={med.name}
                  onChange={(e) => handleChange(med.id, 'name', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid ' }}>
                <Input
                className="flex-growth border-0 shad-input text-zinc-100 font-normal"
                type="text"
                  value={med.dose}
                  onChange={(e) => handleChange(med.id, 'dose', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid ' }}>
                <Input
                className="flex-growth border-0 shad-input text-zinc-100 font-normal"
                type="text"
                  value={med.frequency}
                  onChange={(e) => handleChange(med.id, 'frequency', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid ' }}>
                <Input
                className="flex-growth border-0 shad-input text-zinc-100 font-normal"
                type="text"
                  value={med.duration}
                  onChange={(e) => handleChange(med.id, 'duration', e.target.value)}
                  style={{ width: '100%' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid ' }}>
                <button onClick={() => deleteRow(med.id)}>Delete</button>
              </td>
            </tr>
          ))}
           <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{medications.length + 1}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <Input
                type="text"
                name="name"
                placeholder="Medication Name"
                value={newMed.name}
                onChange={handleInputChange}
                style={{ width: '100%' }}
                className="flex-growth border-0 shad-input text-zinc-100 font-normal"

              />
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <Input
                type="text"
                name="dose"
                placeholder="Dose"
                value={newMed.dose}
                onChange={handleInputChange}
                style={{ width: '100%' }}
                className="flex-growth border-0 shad-input text-zinc-100 font-normal"

              />
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
             
          <select
            defaultValue="adhaar"
            className=" bg-dark-400 text-white w-full p-2 rounded-md"
            name="frequency"
            value={newMed.frequency}
            onChange={handleInputChange}
          >
             <option value="0-0-1-after">0-0-1 After Meal</option>
    <option value="0-1-1-after Meal">0-1-1 After Meal</option>
    <option value="1-0-1-after Meal">1-0-1 After Meal</option>
    <option value="1-1-1-after Meal">1-1-1 After Meal</option>
    <option value="0-0-1-before Meal">0-0-1 Before Meal</option>
    <option value="0-1-1-before Meal">0-1-1 Before Meal</option>
    <option value="1-0-1-before Meal">1-0-1 Before Meal</option>
    <option value="1-1-1-before Meal">1-1-1 Before Meal</option>

            </select >
            </td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <Input
                type="text"
                name="duration"
                placeholder="Duration"
                value={newMed.duration}
                onChange={handleInputChange}
                style={{ width: '100%' }}
                className="flex-growth border-0 shad-input text-zinc-100 font-normal"

              />
            </td>
            <td style={{ padding: '10px', border: '1px solid ' }} className="text-green-400">
              <button type="button" onClick={addRow}>Add Medication</button>
            </td>
          </tr>
        </tbody>
      </table>

   
    </div>
          <div className="w-full">
            <h3 className=" font-semibold">Notes</h3>
            <div className=" flex items-center  bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">

            <Textarea className="  border-0 shad-input text-zinc-100 font-normal" id="notes" />
            </div>
        
          </div>
            
        <Button className="bg-green-500  mt-4  rounded-lg w-fit " type="submit">Submit</Button>
    </form>
      </div>
    </section>

  </div>
  );
};

export default DoctorAppointment;
