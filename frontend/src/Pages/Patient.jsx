import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserAppoint from "./UserAppoint";
import UserRecord from "./UserRecord";
import UserProfile from "./UserProfile";
import { useDispatch, useSelector } from "react-redux";
import { getpatientID, setProfile, setUser } from "@/lib/store/UserSlice";
import { getuser, logout } from "@/lib/store/AsyncThunks";

const Patient = () => {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('type');
    console.log(myParam);
const dispatch = useDispatch()
    const patientID =  useSelector(getpatientID)

    useEffect(() => {
      
      const t = async ()=>{
        
        console.log(patientID)
        const user = await dispatch(getuser({patientID}))
        dispatch(setProfile(user.payload[0]))
        setUser(user.payload[0])
  
      }
  
      t();
  
    },[])

  return (
    <div className="flex h-screen max-h-screen box-border relative z-10  ">
        <p className=" absolute top-[50%] left-[50%] text-5xl text-gray-500 font-extrabold opacity-50 -z-[1] ">MedID</p>
      <h1 className="text-left text-2xl font-bold absolute top-8 left-16   ">
        MedID
      </h1>

      <div className=" flex flex-row w-full   ">
        <div className="bg-dark-400 hidden   border-r-2 h-full flex-1 border-green-500 px-4 md:flex flex-col justify-center gap-2">
          
          <Button className="text-white text-xl"
          onClick={()=>{
            navigate(`/user?type=profile`)
      }}>Profile</Button>
          <Button className="text-white text-xl"
          onClick={()=>{
            navigate(`/user?type=appointments`)
      }}>Appointments</Button>
          <Button className="text-white text-xl"
          onClick={()=>{
            navigate(`/user?type=reports`)
      }}>Reports</Button>
      <Button className="text-white text-xl"
          onClick={()=>{
            dispatch(logout());
            navigate("/")
      }}>Logout</Button>
        </div>

       <div className="w-full h-full px-[2rem] pt-[2rem]">


{
    myParam === "appointments" &&
    <>
    <UserAppoint />
    </>
}

{
    myParam ==="reports" &&
    <>
    <UserRecord />
    </>
}
{
    myParam === "profile" &&
    <>
    <UserProfile />
    </>
}
</div>

          
      </div>
    </div>
  );
};

export default Patient;
