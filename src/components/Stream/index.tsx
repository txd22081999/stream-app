import React, { useState } from 'react'
import Messaging from '../Messaging'
import VideoCall from '../VideoCall'

const Stream = () => {
  const [inCall, setInCall] = useState(false)

  return (
    <>
      <div className='video-list-area'>
        {inCall ? (
          <VideoCall setInCall={setInCall} />
        ) : (
          <button onClick={() => setInCall(true)} className=''>
            Join Call
          </button>
        )}
      </div>
      <div className='messaging-area'>{/* <Messaging /> */}</div>
    </>
  )
}

export default Stream
