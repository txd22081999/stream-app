import cx from 'classnames'
import React from 'react'
import { useRoomStore, useUserStore } from 'store'
import { getAvatarPath } from 'utils'
import Messaging from '../Messaging'
import Stream from '../Stream'
import { mainHeight } from 'constant'

const Main = () => {
  const { audiences } = useRoomStore()
  const { userName } = useUserStore()

  return (
    <div
      className={cx(
        `stream-container grid md:grid-cols-[minmax(150px,200px)_minmax(600px,_1fr)_minmax(200px,300px)] 
        h-full gap-1 grid-cols-1 grid-rows-[200px_100vw_170px] md:grid-rows-1`
        // 'h-[calc(100%-72px)]'
      )}
    >
      <div className='flex flex-col'>
        <h3 className='capitalize text-center py-3 text-lg font-medium bg-black-box mb-1'>
          participants ({audiences.length})
        </h3>

        <div
          className='bg-black-main flex-1 overflow-y-scroll
          scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin 
          scrollbar-thumb-rounded-md py-2 px-2'
        >
          {audiences.map(({ id, avatar }) => {
            const isMe: boolean = id === userName
            return (
              <div key={id} className='flex items-center px-2 mb-3'>
                <img
                  src={getAvatarPath(avatar)}
                  alt='avatar'
                  className={cx(
                    'w-8 h-8 rounded-full mr-2',
                    isMe && ' outline-green-400 outline-2 outline'
                  )}
                />
                <p className='whitespace-nowrap text-md overflow-hidden text-ellipsis'>
                  {id}
                </p>
              </div>
            )
          })}
        </div>
      </div>
      <div className='video-list-area h-full'>
        <Stream />
      </div>
      <div className='messaging-area md:h-[93vh] h-full'>
        <Messaging />
      </div>
    </div>
  )
}

export default Main
