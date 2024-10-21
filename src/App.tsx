import './App.css'
import Auth from './pages/auth'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Profile from './pages/profile'
import { AuthContextProvider, useAuth } from './context/auth.context'

const PrivateRoutes = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />
}

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/profile" element={
            <PrivateRoutes><Profile /></PrivateRoutes>
          } />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
