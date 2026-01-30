import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getUsers, setUsers } from './utils/localStorage'
import { testUsers } from './mockData/users'

// Seed users if empty (for first load)
if (!getUsers()?.length) {
  setUsers(testUsers)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
