import {Toaster} from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginLanding from './pages/LoginLandnig'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import Payslips from './pages/Payslips'
import Settings from './pages/Settings'
import PrintPayslip from './pages/PrintPayslip'
import LoginForm from './components/LoginForm'
import ManageUsers from './pages/ManageUsers'
import { useAuth } from './context/AuthContext'
import Loading from './components/Loading'

const RootRedirect = () => {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  return <Navigate to='/login' replace />
}

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) {
    localStorage.removeItem("token")
    return <Navigate to="/login" replace />
  }
  return children
}

const App = () => {
  return (
    <>
      <Toaster />
      <Routes> 
        <Route path='/' element={<RootRedirect />} />
        <Route path='/login' element={<LoginLanding />} />
        <Route
          path='/login/admin'
          element={
            <LoginForm
              role="ADMIN"
              title="Admin Sign In"
              subtitle="Manage employees, payroll, and system settings."
            />
          }
        />
        <Route
          path='/login/employee'
          element={
            <LoginForm
              role="EMPLOYEE"
              title="Employee Sign In"
              subtitle="Access your attendance, leave requests, and payslips."
            />
          }
        />

        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path='/dashboard' element={<Dashboard/>} /> 
          <Route path='/employee' element={<Employees/>} />
          <Route path='/attendance' element={<Attendance/>} />
          <Route path='/leave' element={<Leave/>} />  
          <Route path='/payslips' element={<Payslips/>} />  
          <Route path='/settings' element={<Settings/>} />  
          <Route path='/admin/manage-users' element={<ManageUsers/>} />
        </Route>

        <Route path='/print/payslip/:id' element={<PrintPayslip/>} />
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </>
  )
}

export default App