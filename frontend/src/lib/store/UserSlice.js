import { createSlice , createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";

const initialState = {
    user: {
        name : null,
        email: null,
        phone: null,
        patientID: null,
        accessToken: null   
    },
    loggedIn: false,
    loading : false,
    error  : null,
    search : "",
    profile :null
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
            state.loading = true
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
            state.user.patientID = action.payload.patientID
            state.user.email = action.payload.email
        },
        setAccessToken(state, action){
            state.user.accessToken = action.payload
        }
        ,
        setLoginSuccessfull(state, action){
            state.user.patientID = action.payload.patientID
            state.user.accessToken = action.payload.accesstoken
            state.user.name = action.payload.name
            state.loggedIn = true
        },
        setProfile(state, action){
            state.profile = action.payload
        }
        ,
        logout(state , action){
            state.user=null
            state.profile=null
        }
        
    }
   
})
// const axio = AxiosPrivate()

export const loading = (state) => state.user.loading
export const getpatientID = (state) => state.user.user.patientID
export const { setUser, clearUser ,setSearch, setHome , setLoading , clearLoading , setPatientID ,logout, setLogin , setAccessToken , setLoginSuccessfull , setProfile } = userSlice.actions
export const getUser = state => state.user.user
export const getError = state => state.error
export const getAccessToken = state => state.user.user.accessToken  
export const getEmail = state => state.user.user.email
export const loggedIn = state => state.user.loggedIn
export const getSearch = state => state.user.search
export const getName = state => state.user.user.name
export const getProfile = state => state.user.profile



export default userSlice.reducer;




