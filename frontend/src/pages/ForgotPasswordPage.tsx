import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { KeyRound } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordForm } from '../lib/validators'
import api from '../lib/axios'
import type { ApiError } from '../types/api'
import { AxiosError } from 'axios'

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await api.post('/auth/forgot-password', data)
      toast.success('If the email exists, a reset token has been created. Check backend console/logs.')
    } catch (err) {
      const error = err as AxiosError<ApiError>
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message[0] : message || 'Request failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <div className="text-center mb-8">
        <KeyRound className="mx-auto mb-3 text-indigo-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset token</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium cursor-pointer"
        >
          {isSubmitting ? 'Sending...' : 'Send reset token'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link to="/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
        {' · '}
        <Link to="/reset-password" className="text-indigo-600 hover:underline">
          I have a token
        </Link>
      </p>
    </div>
  )
}
