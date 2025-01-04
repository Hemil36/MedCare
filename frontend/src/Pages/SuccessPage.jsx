
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logofull from "@/assets/logo-full.svg";
import success from "@/assets/success.gif";
import { useDispatch, useSelector } from "react-redux";
import { getAppointmentDetails } from "@/lib/store/AsyncThunks";
import calender from "@/assets/calendar.svg"
import { getDoctorName } from "@/lib/store/UserSlice";
const RequestSuccess =  () => {

    const query = new URLSearchParams(useLocation().search);
    const appointmentID = query.get("appointmentID");
  const dispatch = useDispatch();
  const[appointment, setAppointment] = useState({});

  // const[doctor, setDoctor] = useState({});
  const docname = useSelector(getDoctorName);
    useEffect(() => {
      const f= async () => {
        try {
          
          const response = await dispatch(getAppointmentDetails({appointmentID})).unwrap();
          setAppointment(response?.appointment);
          console.log(response, "response");
          setDoctor(response?.doctorDetails);
        } catch (error) {
          console.log(error, "error");
        }
      }
      f();

    }, []);


    const date = new Date(appointment?.date);
    
//   const appointmentId = (searchParams?.appointmentId ) || "";
//   const appointment = await getAppointment(appointmentId);

//   const doctor = Doctors.find(
//     (doctor) => doctor.name === appointment.primaryPhysician
//   );

  return (
    <div className=" flex flex-col h-screen max-h-screen px-[5%]">
      <div className=" flex justify-between mt-5  items-center">

        <Link href="/">
          <h1 className=" text-3xl font-bold"> MedID</h1>
        </Link>
        <Link to={'/user'} className="" >Home</Link>
      </div>
      <div className="success-img">


        <section className="flex flex-col items-center">
          <img
            src={success}
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            
            <p className="whitespace-nowrap">  {docname}</p>
          </div>
          <div className="flex gap-2">
            <img
              src={calender}
              height={24}
              width={24}
              alt="calendar"
            />
             <p> {` ${date.toDateString()}` || appointment?.date}</p> 
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          {/* <Link href={`/patients/${patientID}/new-appointment`}>
            New Appointment
          </Link> */}
        </Button>
        <p className="copyright">© 2024 CarePluse</p>
      </div>
    </div>
  );
};

export default RequestSuccess;