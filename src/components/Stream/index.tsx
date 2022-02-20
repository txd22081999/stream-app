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
    <div className='stream-container grid grid-cols-[minmax(150px,200px)_minmax(600px,_1fr)_minmax(200px,300px)] gap-1 h-[calc(100%-72px)]'>
      <div className='flex flex-col'>
        <h3 className='capitalize text-center py-3 font-medium bg-black-box mb-1'>
          participants ({audiences.length})
        </h3>

        <div
          className='bg-black-main flex-1 overflow-y-scroll
          scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin 
          scrollbar-thumb-rounded-md py-2'
        >
          {audiences.map((member) => (
            <div key={member} className='flex items-center px-2 mb-3 '>
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
      <div className='messaging-area h-full'>
        <Messaging />
      </div>
    </div>
  )
}

export default Stream
