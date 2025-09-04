import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios  from 'axios';
import { store } from './store/store.js';
import { Provider } from 'react-redux';

// Setting BaseURl for api Fetching
axios.defaults.baseURL = 'http://localhost:8000';
// axios.defaults.headers.common["Authorization"] = `Bearer ${import.meta.env.VITE_ACCESS_TOKEN} `

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
     <App />
    </Provider>
  </StrictMode>,
)
