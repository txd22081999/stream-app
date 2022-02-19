import { avatarPlaceholder } from 'constant'
import React, { useState } from 'react'
import { GoPrimitiveDot } from 'react-icons/go'
import { useRoomStore } from 'store'
import Messaging from '../Messaging'
import VideoCall from '../VideoCall'

const Stream = () => {
  const [inCall, setInCall] = useState(false)
  const { audiences } = useRoomStore()

  return (
    // <div className='stream-container grid grid-cols-[200px_minmax(900px,_1fr)_100px] gap-2'>
    <div className='stream-container grid grid-cols-[minmax(150px,200px)_minmax(600px,_1fr)_minmax(200px,300px)] gap-2'>
      <div className=''>
        <h3 className='capitalize text-center py-3 font-medium bg-gray-custom'>
          participants ({audiences.length})
        </h3>

        <div className=''>
          {audiences.map((member) => (
            <div key={member} className='flex items-center px-2 mb-3 '>
              {/* <GoPrimitiveDot className='text-green-400' /> */}
              <img
                src={avatarPlaceholder}
                alt='avatar'
                className='w-7 h-7 rounded-lg mr-1 border-green-400 border-[1px]'
              />
              <p className='whitespace-nowrap text-sm overflow-hidden text-ellipsis'>
                {member}
              </p>
            </div>
          ))}
        </div>
      </div>
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
      <div className='messaging-area h-[calc(100vh-75px)]'>
        <Messaging />
      </div>
    </div>
  )
}

export default Stream
