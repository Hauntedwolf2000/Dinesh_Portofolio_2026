'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [step, setStep]       = useState<'email' | 'otp'>('email')
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)

  const sendOTP = async () => {
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('OTP sent! Check your inbox.')
      setStep('otp')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length < 6) return toast.error('Please enter the 6-digit OTP')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Welcome back, Admin! 🎉')
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden dark:bg-dark-bg bg-[#f8f7ff]">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(124,58,237,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,58,237,0.8) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-glow-lg">
            <FiShield size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold gradient-text">Admin Portal</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Portfolio CMS</p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-card-dark">
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display font-bold text-xl dark:text-white mb-1">Sign In</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your admin email to receive a one-time password.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 mb-2 block">Admin Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendOTP()}
                      placeholder="admin@yourdomain.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                        dark:bg-dark-muted bg-gray-100 border border-dark-border/40
                        dark:text-white text-gray-900 placeholder-gray-400
                        focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                        transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>Send OTP <FiArrowRight /></>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display font-bold text-xl dark:text-white mb-1">Enter OTP</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We sent a 6-digit code to <strong className="text-violet-400">{email}</strong>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-400 mb-2 block">One-Time Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      onKeyDown={e => e.key === 'Enter' && verifyOTP()}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono tracking-[0.3em]
                        dark:bg-dark-muted bg-gray-100 border border-dark-border/40
                        dark:text-white text-gray-900 placeholder-gray-400
                        focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                        transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  onClick={verifyOTP}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>Verify & Login <FiShield /></>
                  )}
                </button>

                <button
                  onClick={() => { setStep('email'); setOtp('') }}
                  className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors text-center py-1"
                >
                  ← Back to email
                </button>

                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full text-xs text-violet-400 hover:text-violet-300 transition-colors text-center"
                >
                  Resend OTP
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-600 mt-6">
          <a href="/" className="hover:text-violet-400 transition-colors">← Back to Portfolio</a>
        </p>
      </motion.div>
    </div>
  )
}
