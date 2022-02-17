import React, { useState } from 'react'
import './App.scss'
import VideoCall from './components/VideoCall/VideoCall'

function App() {
  // return <VideoCall />

  const [inCall, setInCall] = useState(false)

  return (
    <div className='App' style={{ height: '100%' }}>
      <div className='video-list-area'>
        {inCall ? (
          <VideoCall setInCall={setInCall} />
        ) : (
          <button onClick={() => setInCall(true)}>Join Call</button>
        )}
      </div>
    </div>
  )
}

export default App
