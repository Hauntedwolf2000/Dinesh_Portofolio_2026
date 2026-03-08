'use client'
import { useState, useRef, DragEvent } from 'react'
import { FiUpload, FiCheck, FiImage, FiFile } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface Props {
  onUpload:   (url: string) => void
  accept?:    string          // e.g. "image/*" or ".pdf"
  folder?:    string          // subfolder hint for filename
  label?:     string
  preview?:   string          // current value to show preview
  type?:      'image' | 'pdf' | 'any'
}

export default function FileUpload({
  onUpload,
  accept   = 'image/*',
  folder   = 'misc',
  label    = 'Upload File',
  preview,
  type     = 'image',
}: Props) {
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    setLoading(true)
    setDone(false)
    const fd = new FormData()
    fd.append('file',   file)
    fd.append('folder', folder)
    try {
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onUpload(data.url)
      setDone(true)
      toast.success('File uploaded!')
      setTimeout(() => setDone(false), 2500)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  const Icon = type === 'pdf' ? FiFile : FiImage

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed
          cursor-pointer transition-all duration-200 min-h-[80px]
          ${dragging
            ? 'border-violet-500 bg-violet-500/15 scale-[1.01]'
            : 'border-violet-500/30 bg-violet-500/5 hover:border-violet-500/60 hover:bg-violet-500/10'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }}
        />

        {loading ? (
          <>
            <span className="animate-spin w-6 h-6 border-2 border-violet-400/30 border-t-violet-400 rounded-full" />
            <span className="text-xs text-violet-400">Uploading…</span>
          </>
        ) : done ? (
          <>
            <FiCheck size={20} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold">Uploaded!</span>
          </>
        ) : (
          <>
            <Icon size={20} className="text-violet-400" />
            <span className="text-xs text-violet-400 font-medium">{label}</span>
            <span className="text-[10px] text-gray-500">Click or drag & drop · Max 10MB</span>
          </>
        )}
      </div>

      {/* Image preview */}
      {preview && type === 'image' && (
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-violet-500/30" />
          <span className="text-xs text-gray-500 truncate max-w-[200px]">{preview}</span>
        </div>
      )}

      {preview && type === 'pdf' && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiFile size={14} className="text-violet-400 flex-shrink-0" />
          <span className="truncate max-w-[240px]">{preview}</span>
        </div>
      )}
    </div>
  )
}
