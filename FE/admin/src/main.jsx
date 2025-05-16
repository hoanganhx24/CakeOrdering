import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'

const clientId = import.meta.env.VITE_GG_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
)
