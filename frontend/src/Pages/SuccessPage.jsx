import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logofull from "@/assets/logo-full.svg";
import success from "@/assets/success.gif";
import { useDispatch, useSelector } from "react-redux";
import { getAppointmentDetails } from "@/lib/store/AsyncThunks";
import calender from "@/assets/calendar.svg";
import { getDoctorName } from "@/lib/store/UserSlice";
const RequestSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const appointmentID = query.get("appointmentID");
  let date = query.get("date") || "";
  const dateObject = new Date(date);

  // Extract only the date in YYYY-MM-DD format
  date = dateObject.toISOString().split("T")[0];

  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState({});

  // const[doctor, setDoctor] = useState({});
  const docname = useSelector(getDoctorName);

  return (
    <div className=" flex flex-col h-screen max-h-screen px-[5%]">
      <div className=" flex justify-between mt-5  items-center">
        <Link href="/">
          <div className="flex gap-1">
            <h1 className=" text-left text-2xl font-bold ">MedCare</h1>
          <div className="relative">
            <div className="h-2 w-2  rounded-full bottom-1 absolute   bg-green-400" />
          </div>
          </div>
        </Link>
        <Link to={"/user?type=profile"} className="">
          Home
        </Link>
      </div>
      <div className="success-img">
        <section className="flex flex-col items-center">
          <img src={success} height={300} width={280} alt="success" />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <p className="whitespace-nowrap"> Dr. {docname}</p>
          </div>
          <div className="flex gap-2">
            <img src={calender} height={24} width={24} alt="calendar" />
            <p> {date}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          {/* <Link href={`/patients/${patientID}/new-appointment`}>
            New Appointment
          </Link> */}
        </Button>
        <p className="copyright">© 2024 MedCare</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
