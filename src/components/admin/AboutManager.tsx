'use client'
import { useState } from 'react'
import { FiSave, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'
import type { PortfolioData } from '@/types'
import FileUpload from '@/components/ui/FileUpload'

interface Props { about: PortfolioData['about']; onSave: () => void }

export default function AboutManager({ about, onSave }: Props) {
  const [form,    setForm]    = useState({ ...about })
  const [loading, setLoading] = useState(false)

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/portfolio', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ section: 'about', item: form }),
      })
      if (!res.ok) throw new Error()
      toast.success('About section saved!')
      onSave()
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const cls = `w-full px-4 py-2.5 rounded-xl text-sm
    dark:bg-dark-muted bg-gray-100 border border-dark-border/40
    dark:text-white text-gray-900 placeholder-gray-400
    focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all`

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display font-bold text-2xl dark:text-white">About Settings</h2>

      <div className="card space-y-5">

        {/* ── Profile photo ─────────────────────────────── */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-3 block">
            Profile Photo
          </label>
          <div className="flex items-start gap-5">
            {/* Live preview */}
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-3 border-violet-500/40
              bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-glow-sm"
              style={{ border: '3px solid rgba(124,58,237,0.4)' }}
            >
              {form.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.profileImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-white" size={32} />
              )}
            </div>

            <div className="flex-1 space-y-2">
              {/* Upload from device */}
              <FileUpload
                folder="profile"
                accept="image/*"
                label="Upload Photo from Device"
                type="image"
                onUpload={url => set('profileImage', url)}
              />
              {/* Or paste URL */}
              <input
                value={form.profileImage || ''}
                onChange={e => set('profileImage', e.target.value)}
                placeholder="Or paste image URL here…"
                className={cls}
              />
              <p className="text-[11px] text-gray-500">
                Supported: JPG, PNG, WebP · Max 10 MB
              </p>
            </div>
          </div>
        </div>

        {/* ── Bio ───────────────────────────────────────── */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Bio</label>
          <textarea rows={5} value={form.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="Tell your story…"
            className={cls + ' resize-none'}
          />
        </div>

        {/* ── Location ──────────────────────────────────── */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Location</label>
          <input value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="City, Country" className={cls} />
        </div>

        {/* ── WhatsApp ──────────────────────────────────── */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
            WhatsApp Number&nbsp;
            <span className="text-emerald-400 font-normal">(shows a chat button on portfolio)</span>
          </label>
          <input
            value={form.whatsapp || ''}
            onChange={e => set('whatsapp', e.target.value)}
            placeholder="+919876543210  ← include country code, no spaces"
            className={cls}
          />
          {form.whatsapp && (
            <a
              href={`https://wa.me/${form.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:underline mt-1 inline-block"
            >
              ✅ Test link →
            </a>
          )}
        </div>

        {/* ── Availability ──────────────────────────────── */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-2 block">Available for Work</label>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative
                ${form.available ? 'bg-violet-600' : 'bg-gray-400 dark:bg-gray-600'}`}
              onClick={() => set('available', !form.available)}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200
                ${form.available ? 'left-7' : 'left-1'}`} />
            </div>
            <span className="text-sm dark:text-gray-300">
              {form.available ? '✅ Available for work' : '❌ Not available right now'}
            </span>
          </label>
        </div>

        <button onClick={save} disabled={loading} className="btn-primary text-sm flex items-center gap-2">
          {loading
            ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            : <><FiSave size={14} /> Save Changes</>}
        </button>
      </div>
    </div>
  )
}
