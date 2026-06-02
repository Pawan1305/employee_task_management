import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ allowedRoles, children }) {
  const { auth, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(auth.user.role)) {
    const fallback = auth.user.role === 'admin' ? '/admin' : '/employee'
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute