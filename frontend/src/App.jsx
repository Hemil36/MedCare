import { useEffect, useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { useTheme } from './components/theme-provider'
import Home from './Pages/home'
import React from 'react'
import { Toaster } from './components/ui/toaster'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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

function App() {
  const [count, setCount] = useState(0)
  const { setTheme } = useTheme()
  const [auth, setAuth] = useState(false)

 

  return (
    <>
      <div className='min-h-screen bg-dark-300 jakarta antialiased text-white'>

      <BrowserRouter>
      <Routes>
        <Route path="/test" element={<Test />} /> 
        <Route path="/" element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register/doctor' element={<RegisterDoctor />} />


        <Route element={<Auth auth={auth}  />} >
        <Route path='/user' element={<Patient/>} />
        <Route path='/patient/:patientID/appointment' element={<Appointment type="create" />} />
        <Route path="/patient/:patientID/appointment/success" element={<RequestSuccess />} />
        <Route path="/doctor" element={<AdminPage />} />
        </Route>
      </Routes>
      </BrowserRouter>
      <Toaster  />

      </div>

    </>
  )
}

export default App
