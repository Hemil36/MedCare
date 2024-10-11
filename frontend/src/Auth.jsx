import React, { useEffect, useState } from 'react';
import { Outlet, redirect, useNavigate } from 'react-router-dom'; // Corrected import
import { useSelector } from 'react-redux';
import { loggedIn as isLoggedIn } from './lib/store/UserSlice'; // Renamed import to avoid conflict
import axios from 'axios';

const Auth = ({}) => {
    const[auth , setAuth] = useState(false)

    useEffect(() => {
        const Auth = async ()=>{
            try{
    
             const res =  await axios.get('http://localhost:3000/api/isauth',{
                withCredentials: true
              })
    
              if(res.status == 403){
                setAuth(false)
                navigate("/")
              }
              if(res.status === 200){
                setAuth(true)
              }
    
            }
            catch(e){
              setAuth(false)
              navigate("/")

            }
        }
    
        Auth()
      },[])

    const navigate = useNavigate(); // Correctly use useNavigate hook

   // Add dependencies to useEffect

    return auth ? <Outlet /> : null;
};

export default Auth;