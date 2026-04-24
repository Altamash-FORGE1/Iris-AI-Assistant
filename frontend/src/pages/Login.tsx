import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('')
    const credential = credentialResponse?.credential
    if (!credential) {
      setError('Google login failed. Please try again.')
      return
    }

    try {
      const response = await axios.post(
        'https://expert-chainsaw-5vq4745vq5vxfv57q-5000.app.github.dev/api/auth/google',
        { credential },
        { withCredentials: true }
      )

      const token = response.data.token
      const user = response.data.user

      if (token) {
        localStorage.setItem('iris_token', token)
      }
      if (user) {
        localStorage.setItem('iris_user', JSON.stringify(user))
      }

      login(token, user)
      navigate('/dashboard')
    } catch (err) {
      console.log('Google login error:', err)
      const responseData = axios.isAxiosError(err) ? err.response?.data : null
      if (axios.isAxiosError(err) && err.response) {
        console.log('Backend response:', err.response.status, err.response.data)
      }
      setError(
        responseData?.message ?? responseData?.error ?? 'Google login failed. Please try again.',
      )
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.18),_transparent_20%),linear-gradient(135deg,#d9f6ef_0%,#effcf6_100%)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-[32px] border border-white/40 bg-white/70 p-8 shadow-[0_30px_80px_rgba(16,185,129,0.12)] backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-800">Welcome back</h1>
          <p className="mt-2 text-slate-600">Sign in with Google to continue to Iris AI Assistant.</p>
        </div>

        <div className="space-y-5">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </motion.div>
    </div>
  )
}
