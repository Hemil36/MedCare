import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const DocAuth = ({}) => {


    const navigate = useNavigate();
    const { doctorID } = useParams();
    const [auth, setAuth] = useState(true);
    const user = useSelector(state => state.user.user);
    // Assume you have the authenticated doctor's ID in state or context
    useEffect(() => {
      if(user == null){
        navigate('/')
      }
    } , [user])

    const authenticatedDoctorID = useSelector(state => state.user?.user?.doctorID); // You'd normally get this from authentication logic or API
    useEffect(() => {
      if ( doctorID !== authenticatedDoctorID) {
        // Redirect to login or error page if user is not authenticated or ID doesn't match
        console.log("Not authenticated" , doctorID , authenticatedDoctorID);
        navigate('/');
        setAuth(false);
      }
    }, []);



    
  return auth ? <Outlet /> : null;
}

export default DocAuth