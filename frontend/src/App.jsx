import { useState } from 'react'
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

function App() {
  const [count, setCount] = useState(0)
  const { setTheme } = useTheme()

  return (
    <>
      <div className='min-h-screen bg-dark-300 jakarta antialiased text-white'>

      <Toaster  />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/patient/:userId/appointment' element={<Appointment type="create" />} />
        <Route path="/patient/:userId/appointment/success" element={<RequestSuccess />} />
      </Routes>
      </BrowserRouter>
      </div>

    </>
  )
}

export default App
