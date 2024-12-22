import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Calendar, Eye, Loader, Mail, Phone, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import {
  generateOTP,
  handleSubmit,
  recordAppointment,
} from "@/lib/store/AsyncThunks";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { getDoctorID } from "@/lib/store/UserSlice";
import { set } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DoctorAppointment = () => {
  const axios = AxiosPrivate();
  const [open, setOpen] = React.useState(false);
  const [fetch, setFetch] = React.useState(true);
  const [records, setRecords] = React.useState(null);
  const [currentAppointment, setCurrentAppointment] = React.useState(null);
  const [patient, setPatient] = React.useState("");
  const [appointments, setAppointments] = React.useState(null);
  const [verify, setVerify] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({
    name: "",
    dose: "",
    frequency: "",
    duration: "",
  });
  const [errors, setErrors] = useState({ symptoms: "", diagnosis: "" });

  const handleChange = (id, field, value) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const addRow = () => {
    if (newMed.name && newMed.dose && newMed.frequency && newMed.duration) {
      setMedications([
        ...medications,
        { id: medications.length + 1, ...newMed },
      ]);
      setNewMed({ name: "", dose: "", frequency: "", duration: "" });
    }
  };

  const deleteRow = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMed({ ...newMed, [name]: value });
  };

  const urlParams = new useParams();
  const myParam = urlParams.appointmentID;
  const patientID = currentAppointment?.appointment?.patientID;
  // console.log(patient)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctorId = useSelector(getDoctorID);

  useEffect(() => {
    const getAppointmentDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/getAppointmentdetails",
          {
            appointmentID: myParam,
          }
        );
        setCurrentAppointment(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAppointmentDetails();
  }, []);

  useEffect(() => {
    const getPatient = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/getuser", {
          patientID,
        });
        setPatient(response.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getPatient();
  }, [patientID]);

  const submit = async (e) => {
    e.preventDefault();
    const { symptoms, notes, diagnosis } = e.target;
    let formErrors = {};
    if (symptoms.value === "") {
      formErrors.symptoms = "Symptoms are required";
    }
    if (diagnosis.value === "") {
      formErrors.diagnosis = "Diagnosis is required";
    }
    setLoading(true);
    setErrors(formErrors);

    console.log(errors);
    try {
      await dispatch(
        recordAppointment({
          appointmentID: myParam,
          symptoms: symptoms.value,
          prescription: medications,
          notes: notes.value,
          patientName: patient.name,
          diagnosis: diagnosis.value,
          email: patient.email,
        })
      ).unwrap();
      toast({
        title: "Success",
      });
      navigate(`/doctor/${doctorId}`);
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verify) {
      const getRecords = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/getRecords",
            {
              patientID,
            }
          );
          setRecords(response.data.filteredFiles);
        } catch (error) {
          console.log(error);
        }
      };

      getRecords();

      const getAppointments = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/getappointmentbydoctor",
            {
              patientID,
            }
          );
          setAppointments(response.data);
        } catch (error) {
          console.log(error);
        }
      };

      getAppointments();
    }
  }, [verify]);
  const doctorID = useSelector((state) => state.user.user.doctorID);

  // Handler to update an existing medication in the table

  return (
    <div className="min-h-screen  text-white dark container remove-scrollbar ">
      {open && <OtpDoc setVerify={setVerify} setOpen={setOpen} />}
      <header className="border-b border-gray-800">
        <div className=" flex justify-between py-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            MedID
          </h1>
          <nav className="flex gap-6">
            <Link
              to="/doctor/home"
              className="text-[#2ECC71] hover:text-[#27AE60]"
            >
              Home
            </Link>
            <Link
              to="/doctor/profile"
              className="text-[#2ECC71] hover:text-[#27AE60]"
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-8 space-y-8 remove-scrollbar">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">
            Appointment #44555
          </h2>
          <p className="text-muted-foreground">
            Patient consultation details and prescription
          </p>
        </div>

        <Card className=" border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Patient Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="name"
                    placeholder="Patient Name"
                    className="pl-10 shad-input border-gray-800 text-white placeholder-gray-400"
                    disabled
                    value={patient?.name}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    placeholder="Phone Number"
                    className="pl-10 shad-input border-gray-800 text-white placeholder-gray-400"
                    disabled
                    value={patient?.phone}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!verify && (
          <Button
            className="bg-green-500 p-2 rounded-md w-fit "
            onClick={async (e) => {
              setOpen(true);
              // console.log(patient)
              await dispatch(generateOTP({ email: patient.email }));
            }}
          >
            Get Patient's History
          </Button>
        )}

        {verify && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className=" border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-400">Record</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records?.map((record) => {
                        const date = new Date(record.$createdAt);
                        const href = `https://cloud.appwrite.io/v1/storage/buckets/Image/files/${record.$id}/view?project=66a12c91000a4cded686`;
                        const href1 = `https://cloud.appwrite.io/v1/storage/buckets/Image/files/${record.$id}/download?project=66a12c91000a4cded686`;
                        return (
                          <TableRow key={record.$id}>
                            <TableCell>{record.name}</TableCell>
                            <TableCell>
                              {new Date(record.$createdAt).toDateString()}
                            </TableCell>
                            <TableCell>
                              <a href={href} target="_blank">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </a>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className=" border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Previous Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-400">Doctor</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments &&
                        appointments.map((appointment) => {
                          const date = new Date(appointment.appointment.date);
                          if (appointment.appointment.status == "completed")
                            return (
                              <Dialog
                                key={appointment.appointment._id}
                                className="rounded-lg"
                              >
                                <DialogTrigger asChild>
                                  <TableRow
                                    key={appointment.appointment._id}
                                    className="hover:cursor-pointer hover:bg-dark-400 "
                                  >
                                    <TableCell className="font-medium text-nowrap  ">
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
                                      <Label
                                        htmlFor="name"
                                        className="text-right"
                                      >
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
                                          appointment.appointment?.prescription
                                            .map((item) => item.name)
                                            .join(", ") || " No   Prescription"
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
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <Card className=" border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">
                    Diagnosis
                    {errors.diagnosis && (
                      <span className="text-destructive ml-2">Required</span>
                    )}
                  </Label>
                  <Input
                    id="diagnosis"
                    className="shad-input border-gray-800 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptoms">
                    Symptoms
                    {errors.symptoms && (
                      <span className="text-destructive ml-2">Required</span>
                    )}
                  </Label>
                  <Input
                    id="symptoms"
                    className="shad-input border-gray-800 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between ">
                  <h3 className="text-lg font-semibold">Prescription</h3>
                </div>
                <div className="rounded-lg border-gray-800 border  ">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="w-[50px] text-gray-400">
                          #
                        </TableHead>
                        <TableHead className="text-gray-400">
                          Medication
                        </TableHead>
                        <TableHead className="text-gray-400">Dose</TableHead>
                        <TableHead className="text-gray-400">
                          Frequency
                        </TableHead>
                        <TableHead className="text-gray-400">
                          Duration
                        </TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medications.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell>{med.id}</TableCell>
                          <TableCell>
                            <Input
                              value={med.name}
                              onChange={(e) =>
                                handleChange(med.id, "name", e.target.value)
                              }
                              className="shad-input border-gray-800 text-white placeholder-gray-400"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={med.dose}
                              onChange={(e) =>
                                handleChange(med.id, "dose", e.target.value)
                              }
                              className="shad-input border-gray-800 text-white placeholder-gray-400"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={med.frequency}
                              onValueChange={(value) =>
                                handleChange(med.id, "frequency", value)
                              }
                              className=""
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder="Select frequency"
                                  className=""
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0-0-1-after">
                                  0-0-1 After Meal
                                </SelectItem>
                                <SelectItem value="0-1-1-after">
                                  0-1-1 After Meal
                                </SelectItem>
                                <SelectItem value="1-0-1-after">
                                  1-0-1 After Meal
                                </SelectItem>
                                <SelectItem value="1-1-1-after">
                                  1-1-1 After Meal
                                </SelectItem>
                                <SelectItem value="0-0-1-before">
                                  0-0-1 Before Meal
                                </SelectItem>
                                <SelectItem value="0-1-1-before">
                                  0-1-1 Before Meal
                                </SelectItem>
                                <SelectItem value="1-0-1-before">
                                  1-0-1 Before Meal
                                </SelectItem>
                                <SelectItem value="1-1-1-before">
                                  1-1-1 Before Meal
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={med.duration}
                              onChange={(e) =>
                                handleChange(med.id, "duration", e.target.value)
                              }
                              className="shad-input border-gray-800 text-white placeholder-gray-400"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRow(med.id)}
                              className="text-destructive"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell>{medications.length + 1}</TableCell>
                        <TableCell>
                          <Input
                            name="name"
                            placeholder="Medication Name"
                            value={newMed.name}
                            onChange={handleInputChange}
                            className="shad-input border-gray-800 text-white placeholder-gray-400"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="dose"
                            placeholder="Dose"
                            value={newMed.dose}
                            onChange={handleInputChange}
                            className="shad-input border-gray-800 text-white placeholder-gray-400"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            name="frequency"
                            value={newMed.frequency}
                            onValueChange={(value) =>
                              handleInputChange({
                                target: { name: "frequency", value },
                              })
                            }
                          >
                            <SelectTrigger className=" shad-input">
                              <SelectValue
                                placeholder="Select frequency"
                                className="focus:outline-none  ring-0"
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131619] shad-input1 text-white  font-normal font-sans">
                              <SelectItem
                                value="0-0-1-after"
                                className="hover:bg-gray-700 hover:text-white text-md transition-colors"
                              >
                                0-0-1 After Meal
                              </SelectItem>
                              <SelectItem
                                value="0-1-1-after"
                                className="hover:bg-gray-700 hover:text-white text-md transition-colors"
                              >
                                0-1-1 After Meal
                              </SelectItem>
                              <SelectItem
                                value="1-0-1-after"
                                className="hover:bg-gray-700 font-extralight text-md hover:text-white transition-colors"
                              >
                                1-0-1 After Meal
                              </SelectItem>
                              <SelectItem
                                value="1-1-1-after"
                                className="hover:bg-gray-700 hover:text-white text-md transition-colors"
                              >
                                1-1-1 After Meal
                              </SelectItem>
                              <SelectItem
                                value="0-0-1-before"
                                className="hover:bg-gray-700 hover:text-white text-md transition-colors"
                              >
                                0-0-1 Before Meal
                              </SelectItem>
                              <SelectItem
                                value="0-1-1-before"
                                className="hover:bg-gray-700 hover:text-white text-md transition-colors"
                              >
                                0-1-1 Before Meal
                              </SelectItem>
                              <SelectItem
                                value="1-0-1-before"
                                className="hover:bg-gray-700 hover:text-white text-md transition-colors"
                              >
                                1-0-1 Before Meal
                              </SelectItem>
                              <SelectItem
                                value="1-1-1-before"
                                className="hover:bg-gray-700 hover:text-white text-md transition-colors"
                              >
                                1-1-1 Before Meal
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            name="duration"
                            placeholder="Duration"
                            value={newMed.duration}
                            onChange={handleInputChange}
                            className="shad-input border-gray-800 text-white placeholder-gray-400"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={addRow}
                            className="text-primary"
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  className="shad-input border-gray-800 text-white min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="bg-green-500 hover:bg-[#27AE60] text-white "
          >
            {loading ? <Loader className=" animate-spin  " /> : "Submit Consultation"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default DoctorAppointment;
