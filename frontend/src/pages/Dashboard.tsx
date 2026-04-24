import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.20),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.18),_transparent_24%),linear-gradient(135deg,#eefcf1_0%,#f2fbff_100%)] flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl rounded-[36px] border border-white/45 bg-white/75 p-8 shadow-[0_40px_90px_rgba(16,185,129,0.1)] backdrop-blur-xl"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Hello, {user?.username ?? 'Iris User'}</h1>
            <p className="mt-2 text-slate-600">Your secure health workspace is ready. Dashboard features will arrive soon.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Log out
          </button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/60 bg-emerald-50/70 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Protected health insights</h2>
            <p className="mt-3 text-slate-600">When APIs are ready, your Iris scans and profile data will display here.</p>
          </div>
          <div className="rounded-3xl border border-white/60 bg-teal-50/70 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Connected securely</h2>
            <p className="mt-3 text-slate-600">JWT authentication ensures only authorized users can reach your personal workspace.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
