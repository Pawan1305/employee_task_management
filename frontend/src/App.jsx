import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import EmployeeDashboard from './pages/EmployeeDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
