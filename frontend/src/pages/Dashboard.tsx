import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Message {
  id: string
  text: string
  sender: 'user' | 'iris'
}

export default function Dashboard() {
  const { user, logout, api } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${user?.username ?? 'there'}! I'm Iris, your AI health assistant. How can I help you today?`,
      sender: 'iris'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await api.post('/chat', { message: input })
      const irisMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'iris'
      }
      setMessages(prev => [...prev, irisMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'iris'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.20),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.18),_transparent_24%),linear-gradient(135deg,#eefcf1_0%,#f2fbff_100%)] flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl rounded-[36px] border border-white/45 bg-white/75 p-8 shadow-[0_40px_90px_rgba(16,185,129,0.1)] backdrop-blur-xl"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Hello, {user?.username ?? 'Iris User'}</h1>
            <p className="mt-2 text-slate-600">Chat with Iris, your AI health assistant.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              localStorage.removeItem('iris_token')
              localStorage.removeItem('iris_user')
              navigate('/login')
            }}
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Log out
          </button>
        </div>

        <div className="flex flex-col h-96 border border-white/60 rounded-3xl bg-white/80">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-2xl">
                  Iris is typing...
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-white/60">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-3xl bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-emerald-500 text-white rounded-3xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
