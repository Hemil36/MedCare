import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosPrivate from '../../hooks/AxiosPrivate';
import { store } from "./store";
import { clearLoading, setLoginSuccessfull, setPatientID } from "./UserSlice";
import axios from "axios";
import FormData from "form-data";
import { toast } from "@/components/ui/use-toast";
const axiosPrivate = AxiosPrivate();

export const handleSubmit = async (event , upload , patientID , recordName , setError,setLoad,setOpen,email) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', upload);
    formData.append('patientID', patientID);
    formData.append('name',recordName);



    try {
        const response = await axiosPrivate.post('http://localhost:3000/api/upload', formData , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            
        });
        if(response.status === 200)
          { setLoad(state => !state)
            toast({
                title: "Record Uploaded Successfully",
                description: "The record has been uploaded successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
          }
        console.log(response.data);

    } catch (error) {
        setError(error.response.data.message);
        toast({
            title: "Error",
            description: error?.response?.data?.message,
            status: "error",
            duration: 5000,
            isClosable: true,
        })
        setOpen(false)
        console.error('Error uploading the file:', error);
    }
};

export const verifyUser = createAsyncThunk('/patient/verifyUser', async ({patientID , email} , {rejectWithValue}) => {
    try {
        const response = await axios.post('http://localhost:3000/api/verifyuser', {patientID , email});
        console.log(response )
        if(response.status === 200)
        return response.data;
    
        // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data.message);
        }
}
)

export const updateDoctorDetails = createAsyncThunk('/doctor/updateDoctorDetails', async ({doctorID , data} , {rejectWithValue}) => {
    console.log(doctorID , data)
    try {
        const response = await axiosPrivate.post('http://localhost:3000/api/updatedoctordetails', {doctorID , data});
        console.log(response)
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
    }
})


export const register = createAsyncThunk('/patient/register', async ({data , type} , {rejectWithValue}) => {
 
    
    try {
        const response = await axios.post('http://localhost:3000/api/register', {data,type});
        
        store.dispatch(setPatientID(response.data.patientID));
        return response.data; // Assuming you want to return the response data on success
      } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data.message);
      }
  
  }
  )
  
  export const getAppointmentDetails = createAsyncThunk('/patient/getAppointmentDetails', async ({appointmentID} , {rejectWithValue}) => {
      try {
          console.log(appointmentID)
          const response = await axiosPrivate.post('http://localhost:3000/api/getappointmentdetails', {appointmentID});

          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  })
  
  export const getAppointment = createAsyncThunk('/patient/getAppointment', async (_, {rejectWithValue}) => {
      try {
          const response = await axiosPrivate.get('http://localhost:3000/api/getappointment');
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  })


  export const patientExist = createAsyncThunk('/patient/patientExist', async ({email} , {rejectWithValue}) => {
    try {
        const response = await axios.post('http://localhost:3000/api/patientexist', {email});
        
        if(response.status === 200)
            return false;

        return true;
        // Assuming you want to return the response data on success
        } catch (error) {
            
        return rejectWithValue(true);
  }})
  
  export const getDoctor = createAsyncThunk('/doctor/getDoctor', async (_, {rejectWithValue}) => {
      
          
      try {
          const response = await axiosPrivate.get('http://localhost:3000/api/getdoctor');
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  
  })

  export const getDoctorDetails = createAsyncThunk('/doctor/getDoctorDetails', async ({doctorID} , {rejectWithValue}) => {

        try {
            const response = await axiosPrivate.post('http://localhost:3000/api/getdoctordetails', {doctorID});
            console.log(response)

            return response.data; // Assuming you want to return the response data on success
            } catch (error) {
            console.log(error, "error");
            return rejectWithValue("34");
            }
    })



  
  export const scheduleAppointment = createAsyncThunk('/patient/scheduleappointment', async ({doctorID, patientID , date,patientName , address,doctorName,email} , {rejectWithValue}) => {
          console.log(address)
    try {
              const response = await axiosPrivate.post('http://localhost:3000/api/schedule', {doctorID, patientID , date,patientName , address , doctorName,email });
              console.log(response)
              return response.data; // Assuming you want to return the response data on success
              } catch (error) {
              console.log(error, "error");
              return rejectWithValue(error);
              }
  })

  export const updatePatient = createAsyncThunk('/patient/updatePatient', async ({patientID , data} , {rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post('http://localhost:3000/api/updateuser', {patientID , data});
        console.log(response)
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
  }})

  export const getuser = createAsyncThunk('/patient/getuser', async ({patientID} , {rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post('http://localhost:3000/api/getuser', {patientID});
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
        }
  })
  
  export const approveAppointment = createAsyncThunk('/doctor/approveAppointment', async ({appointmentID , date} , {rejectWithValue}) => {
      try {
          const response = await axiosPrivate.post('http://localhost:3000/api/approveappointment', {appointmentID , date});
          store.dispatch(clearLoading())
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  }
  )
  
  export const cancelAppointment = createAsyncThunk('/doctor/cancelAppointment', async ({appointmentID} , {rejectWithValue}) => {
      try {
          const response = await axiosPrivate.post('http://localhost:3000/api/cancelappointment', {appointmentID});
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  
  })
  
  export const generateOTP = createAsyncThunk('/patient/generateOTP', async ({email ,type} , {rejectWithValue}) => {
  
      try {
          const response = await axiosPrivate.post('http://localhost:3000/api/generateotp', {email });
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  })

  export const verifyDoctor = createAsyncThunk('/doctor/verifyDoctor', async ({doctorID , email} , {rejectWithValue}) => {
    try {
        const response = await axios.post('http://localhost:3000/api/verifydoctor', {doctorID , email});
        return response.data.message; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data.message);
        }
}
)

export const verifyExistDoctor = createAsyncThunk('/doctor/verifyexistDoctor', async ({ email} , {rejectWithValue}) => {
    try {
        const response = await axios.post('http://localhost:3000/api/verifyexistdoctor', {email});
        return response.data.message; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data.message);
        }
}
)
  
  export const verifyOTP = createAsyncThunk('/patient/verifyOTP', async ({otp} , {rejectWithValue}) => {
          try {
              const response = await axiosPrivate.post('http://localhost:3000/api/verifyotp', {otp});
              
              if(response.status === 201)
              return response.data;
          
              return rejectWithValue(response.response.data.error);
              // Assuming you want to return the response data on success
              } catch (error) {
              console.log(error, "error");
              return rejectWithValue(error);
              }
  })


  export const recordAppointment = createAsyncThunk('/doctor/recordAppointment', async ({appointmentID , symptoms , notes , prescription , patientName , diagnosis,email} , {rejectWithValue}) => {
        try {
            const response = await axiosPrivate.post('http://localhost:3000/api/recordappointment', {appointmentID , symptoms , notes , prescription, patientName , diagnosis,email});
            console.log(response)
            if(response.status === 201)
            return response.data;
        else throw ("op") // Assuming you want to return the response data on success
            } catch (error) {
            console.log(error, "error");
            return rejectWithValue(error);
            }
        }
        )
    
export const forgotID = createAsyncThunk('/patient/forgotID', async ({email} , {rejectWithValue}) => {
    try {
        const response = await axios.post('http://localhost:3000/api/forgotid', {email});
        return response.data; // Assuming you want to return the response data on success
        }
        catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data.message);
        }
    }
    )
  
  export const login = createAsyncThunk('/patient/login', async ({patientID , email} , {rejectWithValue}) => {
  
      try {
          
          const response = await axios.post('http://localhost:3000/api/login', {patientID , email},{
            withCredentials :true
          });
          console.log(response)
          if(response.status === 200)
          {

          await store.dispatch(setLoginSuccessfull(response.data));
                return response.data;
            }
          
  
       return rejectWithValue(response.response.data.error);
  
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  
  })

export const loginDoctor = createAsyncThunk('/doctor/loginDoctor', async ({doctorId , email} , {rejectWithValue}) => {
    
    try {
          
        const response = await axios.post('http://localhost:3000/api/login/doctor', {doctorId , email},{
          withCredentials :true
        });
        console.log(response)
        if(response.status === 200)
        {

        await store.dispatch(setLoginSuccessfull(response.data));
              return response.data;
          }
        

     return rejectWithValue(response.response.data.error);

        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
        }

})
  

  export const getAppointmentbyPatient = createAsyncThunk('/patient/getAppointmentbyPatient', async ({patientID} , {rejectWithValue}) => {
    try {
        const response = await axiosPrivate.post('http://localhost:3000/api/getpatientappointment', {patientID});
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data);
        }
    })

    export const logout = createAsyncThunk('/patient/logout', async (_, {rejectWithValue}) => {
        try {
            const response = await axiosPrivate.post('http://localhost:3000/api/logout');
            store.dispatch(logout())
             // Assuming you want to return the response data on success
            } catch (error) {
            console.log(error, "error");
            return rejectWithValue(error);
            }
    })

