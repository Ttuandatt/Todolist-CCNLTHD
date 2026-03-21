import { Link, Outlet, useNavigate } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '../stores/auth.store'

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            CCNLTHD
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                <User size={16} />
                {user?.displayName || user?.name || 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
