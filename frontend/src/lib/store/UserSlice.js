import { createAsyncThunk, createSlice  } from "@reduxjs/toolkit"
import axios from "axios";

export const login1 = createAsyncThunk(
    "/patient/login",
    async ({ patientID, email }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/login",
          { patientID, email },
          { withCredentials: true }
        );
  
        return response.data; // ✅ Returns user data on success
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
      }
    }
  );

  
    
  
const initialState = {
    user: {
        name : null,
        email: null,
        phone: null,
        patientID: null,
        doctorID: null,
        accessToken: null,
        records:null   
    },
    loggedIn: false,
    loading : false,
    error  : null,
    search : "",
    profile :null,
    otp:false,
    doctorname : null
}



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
            state.loading = action.payload
        },
        clearLoading(state){
            state.loading = false
        },
        setSearch(state, action){
            state.search = action.payload
        },
        setHome (state, action){
           
            state.user.email = action.payload.email
            state.user.phone = action.payload.phone
            state.user.name = action.payload.name
        },
        setPatientID(state, action){
            state.user.patientID = action.payload
        },
        setLogin(state, action){
            console.log(action.payload)
            state.user.email = action.payload.email
            state.user.patientID = action.payload.patientID
            console.log(state.user)
        },
        setAccessToken(state, action){
            state.user.accessToken = action.payload
        }
        ,
        setLoginSuccessfull(state, action){
            state.user.accessToken = action.payload.accessToken
            state.user.name = action.payload.name
            state.loggedIn = true
        },
        setProfile(state, action){
            state.profile = action.payload
        }
        ,
        logout(state , action){
            return initialState
        },
        setdoctorLogin(state, action){
            state.user.doctorID = action.payload.doctorID
            state.user.email = action.payload.email
        },
        setDoctorId(state, action){
            state.user.doctorID = action.payload
        },
        setOtp(state, action){
            state.otp = action.payload
        },
        setDoctorName(state, action){
            state.doctorname = action.payload
        },
        setRecords(state, action){
            state.user.records = action.payload
        },
        clearRecords(state){
            state.user.records = null
        }

        
        
    },
    extraReducers: async (builder) => {

        builder
        .addCase(login1.pending, (state, action) => {
            state.loading = true
        }
        )
        .addCase(login1.fulfilled, (state, action) => {
            console.log(action.payload)
            state.loading = false
            state.user.accessToken = action.payload.accessToken
            state.user.name = action.payload.name
            state.loggedIn = true
        })
        .addCase(login1.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
       
    }

   
})
// const axio = AxiosPrivate()

export const getLoading = (state) => state.user.loading
export const getpatientID = (state) => state.user.user.patientID
export const { setUser,setRecords, clearUser ,setOtp, setDoctorId ,setSearch, setDoctorName,setHome , setLoading , clearLoading ,setdoctorLogin, setPatientID ,logout, setLogin , setAccessToken , setLoginSuccessfull , setProfile } = userSlice.actions
export const getUser = state => state.user.user
export const getError = state => state.error
export const getAccessToken = state => state.user.user.accessToken  
export const getEmail = state => state.user.user.email
export const loggedIn = state => state.user.loggedIn
export const getSearch = state => state.user.search
export const getName = state => state.user.user.name
export const getProfile = state => state.user.user
export const getOtp = state => state.user.otp
export const getDoctorID = state => state.user.user.doctorID
export const getDoctorName = state => state.user.doctorname
export const getRecords = state => state.user.user.records




export default userSlice.reducer;




