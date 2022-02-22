import { EClientRole } from 'enum'
import React from 'react'
import { FaUserFriends } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useRoomStore } from 'store'
import { getAvatarPath } from 'utils'
import './style.scss'

interface IRoomCardProps {
  userCount: number
  roomName: string
  hostAvatar: string
  hostName: string
  thumbnail: string
}

const RoomCard = (props: IRoomCardProps) => {
  const { userCount, roomName, hostName, hostAvatar, thumbnail } = props
  const { setRoomName, addRole } = useRoomStore()
  const navigate = useNavigate()

  function onRoomClick(roomName: string): void {
    setRoomName(roomName)
    // setRoom({ roomName })
    addRole({ role: EClientRole.AUDIENCE, roomName })
    navigate('/stream')
  }

  return (
    <div
      key={roomName + userCount}
      className=' flex gap-3 mb-2 cursor-pointer w-[370px] bg-black-box flex-col rounded-md'
      onClick={() => onRoomClick(roomName)}
    >
      <img
        // src={`/assets/thumbnail/${thumbnailList[0].src}.jpg`}
        src={`/assets/thumbnail/${thumbnail}.jpg`}
        className='w-full h-3/5 rounded-tl-lg rounded-tr-md'
        alt='asd'
      />

      <div className='py-1 px-4'>
        <div className='flex items-center text-gray-400 text-[14px] mb-2'>
          <FaUserFriends className='text-lg mr-2' />
          <span>{userCount} Watching</span>
        </div>

        <span className='font-medium text-2xl'>{roomName}</span>

        <div className='flex items-center mt-5 mb-2'>
          <img
            src={getAvatarPath(hostAvatar)}
            className='w-9 h-9 rounded-full mr-3'
            alt=''
          />
          <span>{hostName}</span>
        </div>
      </div>
    </div>
  )
}

export default RoomCard
