import { createStream } from 'agora-rtc-sdk'
import { AgoraAxios } from 'config/axios-config'
import { avatarList, colorList } from 'constant'
import { EClientRole } from 'enum'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoomStore, useUserStore } from 'store'
import { IRoom } from 'store/room-store'
import { randomInList } from 'utils/random-of-list'

const Rooms = () => {
  const [showCreateRoom, setShowCreateRoom] = useState<boolean>(false)
  const { rooms, roles, setRoomName, setRooms, setTotalRoom, addRole } =
    useRoomStore()
  const { setUserColor, setUserAvatar } = useUserStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchRoomList()
    setUserColor(randomInList(colorList))
    setUserAvatar(randomInList(avatarList).src!)
  }, [])

  async function fetchRoomList(): Promise<void> {
    try {
      const { data } = await AgoraAxios.get('/channels', {
        params: { page_no: 0, page_size: 5 },
      })
      const { channels = [], total_size } = data
      const roomList: IRoom[] = channels.map(
        ({
          channel_name,
          user_count,
        }: {
          channel_name: string
          user_count: number
        }) => ({
          roomName: channel_name,
          userCount: user_count,
        })
      )
      setRooms(roomList)
      setTotalRoom(total_size)
    } catch (error) {
      console.error(error)
    }
  }

  async function createStreamVideo() {
    const stream = await createStream({
      audio: true,
      video: true,
      screen: true,
      screenAudio: true,
    })
    await stream.init(
      () => {
        console.log('success')
      },
      (e) => {
        console.log('fail', e)
      }
    )
    stream.play('stream-box', { fit: 'cover', muted: false })
  }

  function createRoom(e: any): void {
    e.preventDefault()
    const roomName = e.target[0].value
    if (!roomName) return
    addRole({ role: EClientRole.HOST, roomName })
    navigate('/stream')
    setRoomName(roomName)
    e.target[0].value = ''
  }

  function onRoomClick(roomName: string): void {
    setRoomName(roomName)
    addRole({ role: EClientRole.AUDIENCE, roomName })
    navigate('/stream')
  }

  return (
    <div>
      <h2>Room list</h2>
      <button
        className='bg-blue-400 rounded-md p-2'
        onClick={() => setShowCreateRoom((prevShow) => !prevShow)}
      >
        Create room
      </button>

      {showCreateRoom && (
        <form onSubmit={createRoom}>
          <label htmlFor='roomName'>Enter room name</label>
          <input
            type='text'
            name='roomName'
            className='border-2 ml-2 py-1 px-3'
          />
        </form>
      )}

      <div>
        {rooms.map(({ roomName, userCount }) => (
          <div
            key={roomName + userCount}
            className='flex gap-3 p-3 border-2 w-fit mb-2 cursor-pointer'
            onClick={() => onRoomClick(roomName)}
          >
            <span className='font-semibold'>{roomName}</span>
            <span>{userCount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rooms
