import React from 'react'
import Hero from './components/Hero'
import Cartoons from './components/Cartoons'
import Stories from './components/Stories'
import AudioStories from './components/AudioStories'
import ParentPanel from './components/ParentPanel'

export default function App(){
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <Hero />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Cartoons />
          <Stories />
        </div>

        <AudioStories />
        <ParentPanel />
      </div>
    </div>
  )
}
