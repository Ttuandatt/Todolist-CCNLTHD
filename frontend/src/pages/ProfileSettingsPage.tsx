import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Camera, Save, Lock } from 'lucide-react'
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileForm,
  type ChangePasswordForm,
} from '../lib/validators'
import { useAuthStore } from '../stores/auth.store'
import api from '../lib/axios'
import type { ApiError } from '../types/api'
import { AxiosError } from 'axios'

export default function ProfileSettingsPage() {
  const { user, fetchUser } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  // --- Update Profile Form ---
  const profileForm = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user?.displayName || user?.name || '',
      bio: user?.bio || '',
    },
  })

  const onUpdateProfile = async (data: UpdateProfileForm) => {
    try {
      await api.patch('/users/me', data)
      await fetchUser()
      toast.success('Profile updated!')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Update failed')
    }
  }

  // --- Change Password Form ---
  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onChangePassword = async (data: ChangePasswordForm) => {
    try {
      await api.patch('/users/me/change-password', data)
      toast.success('Password changed successfully!')
      passwordForm.reset()
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Password change failed')
    }
  }

  // --- Avatar Upload ---
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Only JPG, PNG, and GIF files are allowed')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    setUploading(true)
    try {
      await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await fetchUser()
      toast.success('Avatar uploaded!')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const avatarUrl = user?.avatar ? `/uploads/avatars/${user.avatar}` : null

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

      {/* Avatar Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h2>
        <div className="flex items-center gap-5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 text-sm cursor-pointer"
            >
              <Camera size={16} />
              {uploading ? 'Uploading...' : 'Change avatar'}
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
          </div>
        </div>
      </section>

      {/* Update Profile Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Info</h2>
        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              {...profileForm.register('displayName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your display name"
            />
            {profileForm.formState.errors.displayName && (
              <p className="text-sm text-red-600 mt-1">
                {profileForm.formState.errors.displayName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              {...profileForm.register('bio')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Tell us about yourself (max 160 chars)"
            />
            {profileForm.formState.errors.bio && (
              <p className="text-sm text-red-600 mt-1">
                {profileForm.formState.errors.bio.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium cursor-pointer"
          >
            <Save size={16} />
            {profileForm.formState.isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>

      {/* Change Password Section */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={18} />
          Change Password
        </h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              {...passwordForm.register('currentPassword')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-sm text-red-600 mt-1">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              {...passwordForm.register('newPassword')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-sm text-red-600 mt-1">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              {...passwordForm.register('confirmPassword')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium cursor-pointer"
          >
            <Lock size={16} />
            {passwordForm.formState.isSubmitting ? 'Changing...' : 'Change password'}
          </button>
        </form>
      </section>
    </div>
  )
}
