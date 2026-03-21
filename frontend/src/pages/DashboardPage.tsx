import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Settings, Mail, Calendar, Shield } from 'lucide-react'
import { useAuthStore } from '../stores/auth.store'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, fetchUser } = useAuthStore()
  const [loading, setLoading] = useState(!user)

  useEffect(() => {
    if (!user) {
      fetchUser()
        .catch(() => toast.error('Failed to load profile'))
        .finally(() => setLoading(false))
    }
  }, [user, fetchUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!user) {
    return <p className="text-center text-gray-500 py-20">Unable to load profile.</p>
  }

  const avatarUrl = user.avatar ? `/uploads/avatars/${user.avatar}` : null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/profile"
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline"
        >
          <Settings size={16} />
          Edit Profile
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{user.displayName || user.name}</h2>
            {user.bio && <p className="text-sm text-gray-500 mt-1">{user.bio}</p>}

            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} />
                Status: <span className="font-medium">{user.status}</span>
                {user.emailVerified && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              {user.lastLoginAt && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  Last login: {new Date(user.lastLoginAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Testing note:</strong> This dashboard currently tests the <code className="bg-amber-100 px-1 rounded">GET /api/v1/users/me</code> endpoint.
        Workspace, Project, and Task modules are not yet implemented in the backend.
      </div>
    </div>
  )
}
