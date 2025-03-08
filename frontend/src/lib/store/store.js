import { configureStore, createStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './UserSlice.js';


const persistConfig = {
  key: 'root',
  storage,
  blacklist: [], // Persist the entire user slice
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer, // Make sure to include 'user'
  },
});

// export const store = createStore(persistedReducer);


export const persistor = persistStore(store);

// persistor.purge(); // Clears the stored state

