import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store'

const Lobby = () => {
  const { setUserName } = useUserStore()
  const navigate = useNavigate()

  function submitName(e: any) {
    e.preventDefault()
    const userName: string = e.target[0].value
    setUserName(userName)
    navigate('/rooms')
  }

  return (
    <div>
      <div>Welcome to StreamApp</div>
      <form action='' onSubmit={submitName}>
        <label htmlFor='name' className='mr-5'>
          Enter your name
        </label>
        <input type='text' name='name' className='border-2' />
        {/* <input type='submit' value='OK' /> */}
      </form>
      {/* <button>Create new room</button> */}
    </div>
  )
}

export default Lobby
