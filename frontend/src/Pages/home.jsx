// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
import React from "react";
import { Link } from "react-router-dom";
import PatientForm from "./PatientForm";
import Heroimg from "../assets/Heroimg.svg"

// import { PasskeyModal } from '@/components/PasskeyModal';

const Home = () => {
//   const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
//   const isAdmin = searchParams.get('admin') === 'true';

  return (
    <div className="flex h-screen max-h-screen  ">

<h1 className=" text-left text-2xl font-bold absolute top-4 left-4">MedID</h1>
      <section className="remove-scrollbar container my-auto md:flex md:flex-row md:gap-20">
         <img src={Heroimg} alt="hero" height={1000} width={1000} className=" hidden md:block" />
        <div className="sub-container max-w-[496px]">
         
          <PatientForm />


          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left dark:text-blue-400">
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
