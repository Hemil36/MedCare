import { StatCard } from "@/components/StatCard";
// import { columns } from "@/components/table/columns";
// import { DataTable } from "@/components/table/DataTable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pending from "@/assets/pending.svg";
import cancelled from "../assets/cancelled.svg";
import scheduled from "@/assets/appointments.svg";
import { useDispatch, useSelector } from "react-redux";
import {  loading } from "@/lib/store/UserSlice";
import { getAppointment } from "@/lib/store/AsyncThunks";
import { DataTable } from "@/components/Table";
import { columns } from "@/components/Column";
import { Loader } from "lucide-react";

const AdminPage = () => {
 
  const dispatch = useDispatch();
  const [appointments, setAppointments] = React.useState([]);
  const [pendingCount, setPendingCount] = React.useState(0);
  const [scheduledCount, setScheduledCount] = React.useState(0);
  const [cancelledCount, setCancelledCount] = React.useState(0);
  const [update, setUpdate] = React.useState(false);
  const [dataChange, setDataChange] = React.useState(false);
  const [loading,setLoading] = useState(null)

  useEffect(() => {
    const handleDataChangeEvent = () => {
      setDataChange((prev) => !prev); // Toggle the state to trigger useEffect
    };

    window.addEventListener('appointmentDataChanged', handleDataChangeEvent);

    return () => {
      window.removeEventListener('appointmentDataChanged', handleDataChangeEvent);
    };
  }, []);


  useEffect(() => {

    setLoading(true)

    const getAppointments = async () => {
      try {
        const response = await dispatch(getAppointment()).unwrap();
        console.log(response);
        if (response.length > 0) {
          const pending = response.filter(
            (appointment) => appointment.appointment.status === "pending"
          );
          const scheduled = response.filter(
            (appointment) => appointment.appointment.status === "scheduled"
          );
          const cancelled = response.filter(
            (appointment) => appointment.appointment.status === "cancelled"
          );
          setPendingCount(pending.length);
          setScheduledCount(scheduled.length);
          setCancelledCount(cancelled.length);
        }
        setAppointments(response);
      } catch (e) {
        console.log(e);
      }
      finally{
        setLoading(false)
      }

    };

    getAppointments();

    
  }, [dataChange]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
     <div className="pt-4" />

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={scheduledCount}
            label="Scheduled appointments"
            icon={scheduled}
          />
          <StatCard
            type="pending"
            count={pendingCount}
            label="Pending appointments"
            icon={pending}
          />
          <StatCard
            type="cancelled"
            count={cancelledCount}
            label="Cancelled appointments"
            icon={cancelled}
          />
        </section>
{
  loading ?           <Loader className='animate-spin' />:  <DataTable columns={columns}  data={appointments}  /> 

}
      </main>
    </div>
  );
};

export default AdminPage;
