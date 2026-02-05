import React from 'react'

export default function ParentPanel(){
  const [show, setShow] = React.useState(false)
  return (
    <section className="card mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Parents</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" onChange={(e)=>setShow(e.target.checked)} />
          <span className="text-sm">Show</span>
        </label>
      </div>

      {show && (
        <div className="mt-3 text-sm text-gray-700">
          <p>This app is a demo playground for kids content. Monetization features (subscriptions, ads) are placeholders for future work.</p>
        </div>
      )}
    </section>
  )
}
