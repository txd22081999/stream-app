import { avatarList, avatarPlaceholder, IAvatar } from 'constant'
import React, { useState } from 'react'
import { BsCartX } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from 'store'
import cx from 'classnames'

const Lobby = () => {
  const { setUserName } = useUserStore()
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState<number | null>(null)

  function submitName(e: any) {
    e.preventDefault()
    const userName: string = e.target[0].value
    setUserName(userName)
    navigate('/rooms')
  }

  const selectedAvatar: IAvatar | undefined = avatarList.find(
    ({ id }) => id === avatar
  )

  function onAvatarClick(id: number): void {
    setAvatar(id)
  }

  return (
    <div className='grid place-items-center h-full'>
      {/* <div> */}
      <div className='max-w-[500px] bg-black-box p-10 rounded-lg'>
        <h2 className='font-semibold text-3xl text-center mb-10'>
          Welcome to STRIC
        </h2>
        <form action='' onSubmit={submitName}>
          <div className='mb-6'>
            <label htmlFor='name' className='mr-5'>
              Enter your name
            </label>
            <input type='text' name='name' className='border-2' />
          </div>

          <div className='mb-8'>
            <p className='mb-2'>Choose your avatar</p>
            <div className='avatars-container flex gap-x-5 gap-y-3 flex-wrap'>
              {avatarList.map(({ id, src }, index) => (
                <img
                  key={id}
                  src={src}
                  alt={'avatar' + index}
                  className={cx(
                    'w-16 h-16 rounded-full cursor-pointer transition-[outline] duration-150 ease-in select-none outline outline-[3px]',
                    selectedAvatar?.id === id
                      ? ' outline-green-400'
                      : 'outline-transparent'
                  )}
                  onClick={() => onAvatarClick(id)}
                />
              ))}
            </div>
          </div>

          <input
            type='submit'
            value='Go'
            className='w-full bg-purple-custom text-white font-medium py-2 cursor-pointer text-lg 
            rounded-md transition-[background] duration-200 ease-in hover:bg-purple-600'
          />
        </form>
        {/* <button>Create new room</button> */}
      </div>
    </div>
  )
}

export default Lobby
