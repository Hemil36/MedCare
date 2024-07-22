import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"



const initialState = {
    user: {
        name : null,
        email: null,
        phone: null,
        userID: "WJOJ-BN1M-O0LJ"

    },
    loggedIn: false,
    loading : false,
    error  : null
}

export const register = createAsyncThunk('/patient/register', async ({data} , {rejectWithValue}) => {
 
    
  try {
      const response = await axios.post('http://localhost:3000/api/register', data);
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
        const response = await axios.post('http://localhost:3000/api/getappointmentdetails', {appointmentID});
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
        }
})


export const getDoctor = createAsyncThunk('/doctor/getDoctor', async (_, {rejectWithValue}) => {
    
        
    try {
        const response = await axios.get('http://localhost:3000/api/getdoctor');
        return response.data; // Assuming you want to return the response data on success
        } catch (error) {
        console.log(error, "error");
        return rejectWithValue(error);
        }

})

export const getAppointment = createAsyncThunk('/patient/scheduleappointment', async ({doctorID, userID} , {rejectWithValue}) => {
        try {
            const response = await axios.post('http://localhost:3000/api/schedule', {doctorID, userID});
            console.log(response)
            return response.data; // Assuming you want to return the response data on success
            } catch (error) {
            console.log(error, "error");
            return rejectWithValue(error);
            }
})
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload
        },
        clearUser(state) {
            state.user = null
        }
        ,
        setLoading(state, action){
            state.loading = true
        },
        clearLoading(state){
            state.loading = false
        },
        setHome (state, action){
           
            state.user.email = action.payload.email
            state.user.phone = action.payload.phone
            state.user.name = action.payload.name
        }
    }
    ,extraReducers (builder) {
        builder.addCase(register.fulfilled, (state, action) => {
            console.log("Sucess")

            state.user.userID = action.payload.userId
            state.loggedIn = true
            state.loading = false
        })
        builder.addCase(register.rejected, (state, action) => {
            state.loggedIn = false
            state.error = action.payload
        })
        builder.addCase(register.pending, (state, action) => {
            state.loading = true
        })
    
    }
})

export const loading = (state) => state.user.loading
export const getUserId = (state) => state.user.user.userID
export const { setUser, clearUser , setHome , setLoading , clearLoading } = userSlice.actions

export const getUser = state => state.user.user
export const getError = state => state.error


export default userSlice.reducer