import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'

const Rooms = () => {
  const [showCreateRoom, setShowCreateRoom] = useState<boolean>(false)
  const { setRoomName } = useStore()
  const navigate = useNavigate()

  function createRoom(e: any) {
    e.preventDefault()
    const roomName = e.target[0].value
    if (!roomName) return
    navigate('/stream')
    setRoomName(roomName)
    e.target[0].value = ''
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
    </div>
  )
}

export default Rooms
