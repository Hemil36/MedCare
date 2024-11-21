import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './lib/store/store.js'
import { PersistGate } from 'redux-persist/lib/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <PersistGate loading={null} persistor={persistor}>
    <Provider store={store} >

    <ThemeProvider defaultTheme='dark'  storageKey='vite-ui-theme'>

    <App />
    </ThemeProvider>
    </Provider>
    </PersistGate>
  // </React.StrictMode>,
)
