import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'
import { resetPasswordSchema, type ResetPasswordForm } from '../lib/validators'
import api from '../lib/axios'
import type { ApiError } from '../types/api'
import { AxiosError } from 'axios'

export default function ResetPasswordPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await api.post('/auth/reset-password', data)
      toast.success('Password reset successful! Please log in.')
      navigate('/login')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Reset failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <ShieldCheck className="mx-auto mb-3 text-indigo-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your reset token and new password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
          <input
            type="text"
            {...register('token')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            placeholder="Paste your reset token here"
          />
          {errors.token && (
            <p className="text-sm text-red-600 mt-1">{errors.token.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            {...register('newPassword')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="********"
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium cursor-pointer"
        >
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link to="/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}
