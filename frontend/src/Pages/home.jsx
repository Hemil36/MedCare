// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
import React from "react";
import { Link } from "react-router-dom";
import PatientForm from "./PatientForm";
import Heroimg from "../assets/Heroimg.svg"
import { Otp } from "./Otp";


// import { PasskeyModal } from '@/components/PasskeyModal';

const Home = () => {
//   const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
//   const isAdmin = searchParams.get('admin') === 'true';
const [open, setOpen] = React.useState(false);
const [loading, setLoading] = React.useState(false);
const [type, setType] = React.useState("new");

  return (
    <div className="flex h-screen max-h-screen  ">
      {open && <Otp setLoading={setLoading} setOpen={setOpen} open={open} type={type} />}

<h1 className=" text-left text-2xl font-bold absolute top-4 left-4">MedID</h1>
      <section className="remove-scrollbar container my-auto md:flex md:flex-row md:gap-20 ">
         <img src={Heroimg} alt="hero" height={1000} width={1000} className=" hidden md:block md:w-1/2 xl:h-auto" />
        <div className="sub-container max-w-[496px]">
         
          <PatientForm setOpen={setOpen} setLoading={setLoading} loading={loading} type={type} setType={setType} />


          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left ">
              © 2024 MedID
            </p>
            {/* <Link to="/?admin=true" className="text-green-500">
              Admin
            </Link> */}
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Home;
