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
      className=' flex gap-3 p-2 mb-2 cursor-pointer w-[300px] h-[300px] bg-cover bg-black-main flex-col'
      onClick={() => onRoomClick(roomName)}
    >
      <img
        // src={`/assets/thumbnail/${thumbnailList[0].src}.jpg`}
        src={`/assets/thumbnail/${thumbnail}.jpg`}
        className='w-full h-3/5'
        alt='asd'
      />

      <div className='py-2 px-4'>
        <div className='flex items-center text-gray-400 text-[14px] mb-1'>
          <FaUserFriends className='text-lg mr-2' />
          <span>{userCount} Watching</span>
        </div>

        <span className='font-medium text-xl'>{roomName}</span>

        <div className='flex items-center mt-2'>
          <img
            src={getAvatarPath(hostAvatar)}
            className='w-9 h-9 rounded-full mr-2'
            alt=''
          />
          <span>{hostName}</span>
        </div>
      </div>
    </div>
  )
}

export default RoomCard
