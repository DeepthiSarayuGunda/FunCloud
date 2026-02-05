import React from 'react'

export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 max-w-3xl w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end">
          <button className="px-3 py-1 rounded-md bg-gray-100" onClick={onClose}>Close</button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}
