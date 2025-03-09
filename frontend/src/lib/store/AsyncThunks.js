import { createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "./store";
import { clearLoading, setLoginSuccessfull, setPatientID } from "./UserSlice";
import FormData from "form-data";
import { toast } from "@/components/ui/use-toast";
import { logout as Log }  from "./UserSlice";
import  AxiosPrivate  from "../../hooks/AxiosPrivate";
const axiosPrivate = AxiosPrivate();
import { axiosurl as axios } from "../axios/axios";
export const handleSubmit = async (event , upload , patientID , recordName , setError,setLoad,setOpen,email,name) => {
    event.preventDefault();
    console.log(upload,patientID,recordName)
    const formData = new FormData();
    formData.append('file', upload);
    formData.append('patientID', patientID);
    formData.append('name',recordName);
    formData.append('email',email)
    formData.append('patientName',name)
    formData.append('type',upload.type.split('/')[1])



    try {
        const response = await axiosPrivate.post('upload', formData , {
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
        const response = await axios.post('/verifyuser', {patientID , email});
        console.log(response )
        if(response.status === 200)
        return response.data;
    
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue( error );
        }
}
)

export const updateDoctorDetails = createAsyncThunk('/doctor/updateDoctorDetails', async ({doctorID , data} , {rejectWithValue}) => {
    console.log(doctorID , data)
    try {
        const response = await axiosPrivate.put('/updatedoctordetails', {doctorID , data});
        console.log(response)
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
    }
})


export const register = createAsyncThunk('/patient/register', async ({data , type} , {rejectWithValue}) => {
 
    
    try {
        const response = await axios.post('/register', {data,type});
        store.dispatch(setPatientID(response?.data?.patientID));
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
          const response = await axiosPrivate.get('getappointmentdetails', {appointmentID});

          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  })
  
  export const getAppointment = createAsyncThunk('/patient/getAppointment', async () => {
      try {
          const response = await axiosPrivate.get(`getappointment`
          );
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return 9;
          }
  })


  export const patientExist = createAsyncThunk('/patient/patientExist', async ({email} , {rejectWithValue}) => {
    try {
        const response = await axios.get(`/patientexist?email=${email}`);
        
        if(response.status === 200)
            return false;

        return true;
        // Assuming you want to return the response data on success
        } catch (error) {
            
        return rejectWithValue(true);
  }})
  
  export const getDoctor = createAsyncThunk('/doctor/getDoctor', async (_, {rejectWithValue}) => {
      
          
      try {
          const response = await axiosPrivate.get('getdoctor');
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  
  })

  export const getDoctorDetails = createAsyncThunk('/doctor/getDoctorDetails', async ({doctorID} , {rejectWithValue}) => {

        try {
            const response = await axiosPrivate.get('getdoctordetails?doctorID='+doctorID, );
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
              const response = await axiosPrivate.post('schedule', {doctorID, patientID , date,patientName , address , doctorName,email });
              console.log(response)
              return response.data; // Assuming you want to return the response data on success
              } catch (error) {
              console.log(error, "error");
              return rejectWithValue(error);
              }
  })

  export const updatePatient = createAsyncThunk('/patient/updatePatient', async ({patientID , data} , {rejectWithValue}) => {
    try {
        const response = await axiosPrivate.put('updateuser', {patientID , data});
        console.log(response)
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
  }})

  export const getuser = createAsyncThunk('/patient/getuser', async ({patientID} , {rejectWithValue}) => {
    try {
        const response = await axiosPrivate.get(`getuser?patientID=${patientID}`,);
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
        }
  })
  
  export const approveAppointment = createAsyncThunk('/doctor/approveAppointment', async ({appointmentID , date} , {rejectWithValue}) => {
      try {
          const response = await axiosPrivate.put('approveappointment', {appointmentID , date});
          store.dispatch(clearLoading())
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  }
  )

  export const getRecordsapi = createAsyncThunk('/patient/getRecords', async ({patientID} , {rejectWithValue} , thunkAPI) => {
        try {
            const response = await axiosPrivate.get(`getrecords?patientID=${patientID}`,{
                  withCredentials: true
            },{
              Headers :{
          
              }
            });
            console.log(response.data)
            return response.data; // Assuming you want to return the response data on success
            }
            catch (error) {
            console.log(error, "error");
            return rejectWithValue(error.response.data.message);
            }
        } )
  
  export const cancelAppointment = createAsyncThunk('/doctor/cancelAppointment', async ({appointmentID} , {rejectWithValue}) => {
      try {
          const response = await axiosPrivate.delete('cancelappointment?appointmentID='+appointmentID, {appointmentID});
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  
  })
  
  export const generateOTP = createAsyncThunk('/patient/generateOTP', async ({email ,type} , {rejectWithValue}) => {
  
      try {
          const response = await axiosPrivate.post('generateotp', {email });
          return response.data; // Assuming you want to return the response data on success
          } catch (error) {
          console.log(error, "error");
          return rejectWithValue(error);
          }
  })

  export const verifyDoctor = createAsyncThunk('/doctor/verifyDoctor', async ({doctorID , email} , {rejectWithValue}) => {
    try {
        const response = await axios.post('/verifydoctor', {doctorID , email});
        return response.data.message; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data.message);
        }
}
)

export const verifyExistDoctor = createAsyncThunk('/doctor/verifyexistDoctor', async ({ email} , {rejectWithValue}) => {
    try {
        const response = await axios.post('/verifyexistdoctor', {email});
        return response.data.message; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data.message);
        }
}
)
  
  export const verifyOTP = createAsyncThunk('/patient/verifyOTP', async ({otp} , {rejectWithValue}) => {
          try {
              const response = await axiosPrivate.post('verifyotp', {otp});
              
              if(response.status === 201)
              return response.data;
          
              return rejectWithValue(response.response.data.error);
              // Assuming you want to return the response data on success
              } catch (error) {
              console.log(error, "error");
              return rejectWithValue(error);
              }
  })


  export const recordAppointment = createAsyncThunk('/doctor/recordAppointment', async ({appointmentID , symptoms , notes , prescription , patientName , diagnosis,email,doctorName} , {rejectWithValue}) => {
        try {
            const response = await axiosPrivate.put('recordappointment', {appointmentID , symptoms , notes , prescription, patientName , diagnosis,email,doctorName});
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
        const response = await axios.post('/forgotid', {email});
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
          
          const response = await axios.post('/login', {patientID , email},{
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

export const loginDoctor = createAsyncThunk('/doctor/loginDoctor', async ({doctorID , email} , {rejectWithValue}) => {
    
    try {
          
        const response = await axios.post('/login/doctor', {doctorID , email},{
          withCredentials :true
        });
        console.log(response)
        if(response.status === 200)
        {
            console.log(response.data)

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
        const response = await axiosPrivate.get(`getpatientappointment?patientID=${patientID}`);
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error.response.data);
        }
    })

    export const logout = createAsyncThunk('/patient/logout', async (_, {rejectWithValue}) => {
        try {
            const response = await axiosPrivate.post('logout');
            store.dispatch(Log())

             // Assuming you want to return the response data on success
            } catch (error) {
            console.log(error, "error");
            return rejectWithValue(error);
            }
    })



