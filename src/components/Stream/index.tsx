import React, { useState } from 'react'
import Messaging from '../Messaging'
import VideoCall from '../VideoCall'

const Stream = () => {
  const [inCall, setInCall] = useState(false)

  return (
    <div className='flex gap-2'>
      <div className='video-list-area'>
        <VideoCall setInCall={setInCall} />
        {/* {inCall ? (
          <VideoCall setInCall={setInCall} />
        ) : (
          <button onClick={() => setInCall(true)} className=''>
            Join Call
          </button>
        )} */}
      </div>
      <div className='messaging-area'>
        <Messaging />
      </div>
    </div>
  )
}

export default Stream
