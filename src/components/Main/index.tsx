import cx from 'classnames'
import { avatarPlaceholder } from 'constant'
import React, { useState } from 'react'
import { useRoomStore, useUserStore } from 'store'
import Messaging from '../Messaging'
import Stream from '../Stream'

const Main = () => {
  const { audiences } = useRoomStore()
  const { userName } = useUserStore()

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
          {audiences.map((member) => {
            const isMe: boolean = member === userName
            return (
              <div key={member} className='flex items-center px-2 mb-3 '>
                <img
                  src={avatarPlaceholder}
                  alt='avatar'
                  className={cx(
                    'w-7 h-7 rounded-full mr-1 ',
                    isMe && ' outline-green-400 outline-2 outline'
                  )}
                />
                <p className='whitespace-nowrap text-sm overflow-hidden text-ellipsis'>
                  {member}
                </p>
              </div>
            )
          })}
        </div>
      </div>
      <div className='video-list-area'>
        <Stream />
      </div>
      <div className='messaging-area h-full'>
        <Messaging />
      </div>
    </div>
  )
}

export default Main
