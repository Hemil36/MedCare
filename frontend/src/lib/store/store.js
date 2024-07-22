import { configureStore } from '@reduxjs/toolkit';
import UserSlice from "./UserSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";



const persistConfig = {
    key: 'root',
    storage,
    blacklist: [], // Persist the entire user slice
  };
  
  const persistedReducer = persistReducer(persistConfig, UserSlice);
  
  // Create the store with the persisted reducer
  export const store = configureStore({
    reducer: {
      user: persistedReducer, // Make sure to include 'user'
    },
  });
  
  export const persistor = persistStore(store);