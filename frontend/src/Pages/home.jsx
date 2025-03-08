import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PatientForm from "./PatientForm";
import Heroimg from "../assets/Heroimg.svg";
import Navimg from "../assets/med2.png";
import { Otp } from "./Otp";
import { useDispatch, useSelector } from "react-redux";
import { getLoading, setLoading } from "@/lib/store/UserSlice";

const Home = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const loading = useSelector(getLoading);
  const [type, setType] = React.useState("new");
  const [oldType, setOldType] = React.useState("patient");
  const [newType, setNewType] = React.useState("patient");

  return (
    <>
      <div className="flex gap-1 w-full pt-3 px-5">
        
        <div>
          <h1 className=" text-left text-2xl font-bold ">
            MedCare
          </h1>
        </div>
        <div className="relative">

        <div className="h-2 w-2  rounded-full bottom-1 absolute   bg-green-400" />
        </div>


       </div> 
        <div className="flex   ">
          {open && (
            <Otp
              setOpen={setOpen}
              open={open}
              type={type}
              oldType={oldType}
              newType={newType}
            />
          )}
        </div>
        <section className="remove-scrollbar container my-auto md:flex md:flex-row md:gap-20 ">
          <img
            src={Heroimg}
            alt="hero"
            height={1000}
            width={1000}
            className=" hidden md:block h-auto md:w-1/2 xl:h-auto overflow-y-hidden"
          />
          <div className="sub-container max-w-[496px] ">
            <PatientForm
              setOpen={setOpen}
              newType={newType}
              type={type}
              setType={setType}
              setOldType={setOldType}
              setNewType={setNewType}
              oldType={oldType}
            />

            <div className="text-14-regular mt-20 flex justify-between">
              <p className="justify-items-end text-dark-600 xl:text-left ">
                © 2024 MedCare
              </p>
              {/* <Link to="/?admin=true" className="text-green-500">
              Admin
            </Link> */}
            </div>
          </div>
        </section>
    </>
  );
};

export default Home;
