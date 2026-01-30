import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getUsers, setUsers } from './utils/localStorage'
import { testUsers } from './mockData/users'

// Seed or sync demo users so login credentials always match the login page
let users = getUsers() || []
if (!users.length) {
  setUsers(testUsers)
} else {
  // Sync demo user passwords (and key fields) so stored data matches current testUsers
  users = users.map((u) => {
    const match = testUsers.find((t) => t.email.toLowerCase() === u.email?.toLowerCase())
    if (match) {
      return { ...u, password: match.password, firstName: match.firstName, lastName: match.lastName }
    }
    return u
  })
  setUsers(users)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
