import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { AuthProvider } from './features/auth/context/auth.context.jsx'
import { InterviewProvider } from './features/interview/context/interview.context.jsx'
import "./style.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider >
      <InterviewProvider>
        <App />
      </InterviewProvider>
    </AuthProvider>
  </StrictMode>
)
