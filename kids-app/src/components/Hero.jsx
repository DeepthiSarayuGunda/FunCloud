import React from 'react'
import ThreeHero from './ThreeHero'
import { Player } from 'lottie-react'

export default function Hero() {
  return (
    <section className="card flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">FunCloud Kids ☁️</h1>
          <p className="text-sm text-gray-600">3D cartoons, story books, and audio adventures — playful and safe.</p>
        </div>
        <div className="w-36 h-24">
          {/* Placeholder Lottie */}
          <Player src="/assets/animations/placeholder.json" loop autoplay />
        </div>
      </div>

      <ThreeHero />

      <div className="flex gap-3 mt-2">
        <button className="large-btn">3D Cartoons</button>
        <button className="px-4 py-2 rounded-full bg-accent text-white font-bold">Story Books</button>
        <button className="px-4 py-2 rounded-full bg-green-400 text-white font-bold">Audio Stories</button>
      </div>
    </section>
  )
}
