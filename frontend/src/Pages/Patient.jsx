import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAppoint from "./UserAppoint";
import UserRecord from "./UserRecord";
import UserProfile from "./UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { getpatientID, setProfile, setUser } from "@/lib/store/UserSlice";
import { getuser, logout } from "@/lib/store/AsyncThunks";
import { cn } from "@/lib/utils";

const Patient = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('type');
    console.log(myParam);
    const dispatch = useDispatch()
    const patientID =  useSelector(getpatientID)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    
   
   

    return (
      <div className="flex h-screen max-h-screen box-border relative z-10">
        <p
          className="absolute top-[50%] left-[50%] text-gray-500 font-extrabold opacity-50 -z-[1] transform -translate-x-1/2 -translate-y-1/2
                     text-2xl sm:text-3xl md:text-5xl lg:text-6xl min-h-fit text-center"
        >
          MedID
        </p>
    
        {/* Burger Icon */}
        {!isSidebarOpen && (
          <div className="absolute top-4 left-4 md:hidden z-20">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-white text-3xl focus:outline-none transition-transform duration-300"
            >
              &#9776;
            </button>
          </div>
        )}
    
        {/* Sidebar */}
        <div
          className={`bg-dark-400 border-r-2 h-full flex-col justify-start gap-4 px-4 md:flex  ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 fixed md:relative z-30 border-green-400`}
        >
          <h1 className="text-2xl font-bold text-center py-10 text-white sticky top-0 bg-dark-400 py-4">
            MedID
          </h1>
    
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <Button
              className={cn("text-white text-xl", myParam === "profile" && "text-green-400")}
              onClick={() => {
                navigate(`/user?type=profile`);
                setIsSidebarOpen(false);
              }}
            >
              Profile
            </Button>
            <Button
              className={cn("text-white text-xl", myParam === "appointments" && "text-green-400")}
              onClick={() => {
                navigate(`/user?type=appointments`);
                setIsSidebarOpen(false);
              }}
            >
              Appointments
            </Button>
            <Button
              className={cn("text-white text-xl", myParam === "reports" && "text-green-400")}
              onClick={() => {
                navigate(`/user?type=reports`);
                setIsSidebarOpen(false);
              }}
            >
              Reports
            </Button>
            <Button
              className="text-white text-xl"
              onClick={() => {
                dispatch(logout());
                navigate("/");
                setIsSidebarOpen(false);
              }}
            >
              Logout
            </Button>
          </div>
        </div>
    
        {/* Background Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on background click
          />
        )}
    
        {/* Main Content */}
        <div
          className={`w-full h-full px-[2rem] pt-[2rem] transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          {myParam === "appointments" && <UserAppoint />}
          {myParam === "reports" && <UserRecord />}
          {myParam === "profile" && <UserProfile />}
        </div>
      </div>
    );
    
};

export default Patient;
