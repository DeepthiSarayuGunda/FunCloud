import React from 'react'
import Modal from './Modal'
import { CARTOONS } from '../data/dummy'

export default function Cartoons() {
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState(null)
  const [musicOn, setMusicOn] = React.useState(true)

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">3D Cartoons</h2>
        <div className="flex gap-2 items-center">
          <label className="text-sm">Music</label>
          <input type="checkbox" checked={musicOn} onChange={() => setMusicOn(s => !s)} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {CARTOONS.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-3 shadow-md">
            <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover rounded-lg" />
            <div className="mt-2 flex justify-between items-center">
              <div className="font-bold">{c.title}</div>
              <button className="px-3 py-1 rounded-full bg-primary text-white" onClick={() => { setActive(c); setOpen(true); }}>Play</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        {active && (
          <div>
            <h3 className="text-xl font-bold">{active.title}</h3>
            <div className="mt-2">
              <img src={active.video} alt={active.title} className="w-full h-60 object-contain" />
            </div>
            {musicOn && <audio src={active.music} autoPlay loop controls className="w-full mt-2" />}
          </div>
        )}
      </Modal>
    </section>
  )
}
