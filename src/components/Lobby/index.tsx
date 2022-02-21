import cx from 'classnames'
import { avatarList, IAvatar } from 'constant'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from 'store'
import { getAvatarPath } from 'utils'

const Lobby = () => {
  const { setUserName, setUserAvatar } = useUserStore()
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
    const avatar = avatarList.find(({ id: avatarId }) => avatarId === id)?.src
    setUserAvatar(avatar || '')
  }

  return (
    <div className='grid place-items-center h-full -translate-y-[2%]'>
      <div className='max-w-[500px] bg-black-box p-10 rounded-lg'>
        <h2 className='font-semibold text-3xl text-center mb-10'>
          Welcome to STRIX
        </h2>
        <form action='' onSubmit={submitName}>
          <div className='mb-6 flex items-center'>
            <label htmlFor='name' className='mr-4'>
              Enter your name
            </label>
            <div className='bg-input rounded-lg flex-1'>
              <input
                type='text'
                name='name'
                className='border-2 ml-2 py-1 px-2 text-white w-full bg-transparent border-transparent outline-0'
              />
            </div>
          </div>

          <div className='mb-10'>
            <p className='mb-3'>Choose your avatar</p>
            <div className='avatars-container flex gap-x-5 gap-y-3 flex-wrap'>
              {avatarList.map(({ id, src }, index) => (
                <img
                  key={id}
                  src={getAvatarPath(src)}
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
      </div>
    </div>
  )
}

export default Lobby
