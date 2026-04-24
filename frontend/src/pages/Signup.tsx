import { type FormEvent, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, api } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      const response = await api.post('/auth/signup', { username, email, password })
      login(response.data.token, response.data.user)
      navigate('/dashboard')
    } catch (err) {
      const responseData = axios.isAxiosError(err) ? err.response?.data : null
      setError(
        responseData?.message ?? responseData?.error ?? 'Signup failed. Please verify your details and try again.',
      )
    }
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
          <h1 className="text-3xl font-semibold text-slate-800">Create your account</h1>
          <p className="mt-2 text-slate-600">Secure access for Iris AI health insights.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="yourname"
              autoComplete="off"
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-teal-500/20 transition hover:opacity-95"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already a member?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
