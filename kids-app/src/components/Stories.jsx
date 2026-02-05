import React from 'react'
import Modal from './Modal'
import { STORIES } from '../data/dummy'

export default function Stories() {
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState(null)
  const [page, setPage] = React.useState(0)
  const audioRef = React.useRef(null)

  function openStory(s) {
    setActive(s)
    setPage(0)
    setOpen(true)
  }

  function next() {
    if (!active) return
    setPage(p => Math.min(p + 1, active.pages.length - 1))
  }

  function prev() { if (!active) return; setPage(p => Math.max(p - 1, 0)) }

  React.useEffect(() => {
    if (!active) return
    const a = audioRef.current
    if (!a) return
    a.pause(); a.currentTime = 0; a.src = active.pages[page].audio || ''
    if (a.src) a.play().catch(()=>{})
  }, [active, page])

  return (
    <section className="card mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Story Books</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {STORIES.map(s => (
          <div key={s.id} className="bg-white rounded-xl p-3 shadow-md">
            <div className="h-36 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">📘</div>
            <div className="mt-2 flex justify-between items-center">
              <div className="font-bold">{s.title}</div>
              <button className="px-3 py-1 rounded-full bg-accent text-white" onClick={() => openStory(s)}>Read</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        {active && (
          <div>
            <h3 className="text-xl font-bold">{active.title}</h3>
            <div className="mt-2 bg-gray-50 rounded-lg p-4 min-h-[300px]">
              <div className="text-2xl">{active.pages[page].text}</div>
              <div className="mt-4">
                <img src={active.pages[page].img} alt="page" className="w-full h-48 object-contain rounded" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button onClick={prev} className="px-3 py-1 bg-gray-100 rounded">Prev</button>
                <button onClick={next} className="px-3 py-1 bg-gray-100 rounded">Next</button>
              </div>
              <audio ref={audioRef} controls className="w-48" />
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
