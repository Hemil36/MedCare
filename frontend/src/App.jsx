import { useEffect, useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { useTheme } from './components/theme-provider'
import Home from './Pages/home'
import React from 'react'
import { Toaster } from './components/ui/toaster'
import { BrowserRouter, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import Register from './Pages/Register'
import Appointment from './Pages/Appointment'
import RequestSuccess from './Pages/SuccessPage'
import AdminPage from './Pages/Admin'
import Auth from './Auth'
import { Hero } from './Pages/Hero'
import Patient from './Pages/Patient'
import Test from './Pages/Test'
import axios from 'axios'
import RegisterDoctor from './Pages/RegisterDoctor'
import { useSelector } from 'react-redux'
import { getOtp } from './lib/store/UserSlice'
import DoctorAppointment from './Pages/DoctorAppointment'
import PrescriptionGenerator from './Prescription'
import DocProfile from './Pages/DocProfile'
import DocAuth from './lib/DocAuth'
import ForgotId from './Pages/ForgotId'

const Otpveri = ()=>{
  const otp = useSelector(getOtp)
  const[auth , setAuth] = useState(false)

    useEffect(() => {
        const Auth = async ()=>{
           otp ? setAuth(true) : navigate("/")
        }
    
        Auth()
      },[])

    const navigate = useNavigate(); 

    return otp ? <Outlet /> : null;

}



function App() {
  const [count, setCount] = useState(0)
  const { setTheme } = useTheme()
  const [auth, setAuth] = useState(false)

 

  return (
    <>
      <div className='min-h-screen bg-dark-300 jakarta antialiased text-white'>

      <BrowserRouter>
      <Routes>
        <Route path="/forgotId" element={<ForgotId />} /> 
        <Route path="/" element={<Home />} />
      <Route  element={<Otpveri />} >
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/register/doctor' element={<RegisterDoctor />} />

        <Route element={<Auth auth={auth}  />} >
        <Route path='/user' element={<Patient/>} />
        <Route path='/patient/:patientID/appointment' element={<Appointment type="create" />} />
        <Route path="/patient/:patientID/appointment/success" element={<RequestSuccess />} />
        
        <Route element={<DocAuth />} >
        <Route path="/doctor/:doctorID" element={<AdminPage />} />
        <Route path="/doctor/:doctorID/appointment/:appointmentID" element={<DoctorAppointment />} />
        <Route path='/doctor/:doctorID/profile' element={<DocProfile />} />
        </Route>
        </Route>
      </Routes>
      </BrowserRouter>
      <Toaster  />

      </div>

    </>
  )
}

export default App
