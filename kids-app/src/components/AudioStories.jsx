import React from 'react'
import { AUDIO_STORIES } from '../data/dummy'

export default function AudioStories(){
  const [playing, setPlaying] = React.useState(null)
  const audioRef = React.useRef(null)

  function play(item){
    if (playing === item.id){
      audioRef.current.pause();
      setPlaying(null); return
    }
    audioRef.current.src = item.src; audioRef.current.play().catch(()=>{}); setPlaying(item.id)
  }

  return (
    <section className="card mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Audio Stories</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {AUDIO_STORIES.map(a => (
          <div key={a.id} className="bg-white rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔊</div>
              <div className="font-bold">{a.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-primary text-white rounded-full" onClick={()=>play(a)}>
                {playing===a.id? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} onEnded={()=>setPlaying(null)} />
    </section>
  )
}
