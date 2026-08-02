import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from './App.jsx'
import { AuthProvider } from './features/auth/context/auth.context.jsx'
import { InterviewProvider } from './features/interview/context/interview.context.jsx'
import "./style.css"
import { Header } from './header/Header.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider >
      <InterviewProvider>
        <App />
      </InterviewProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
  // </StrictMode>


)
