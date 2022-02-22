import cx from 'classnames'
import { avatarList, buttonStyle, IAvatar } from 'constant'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from 'store'
import { getAvatarPath } from 'utils'

const Lobby = () => {
  const { setUserName, setUserAvatar } = useUserStore()
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  function submit(e: any) {
    e.preventDefault()

    const name: string = e.target[0].value.trim()
    if (!avatar && !name) {
      setErrorMessage('Fill in your name and select an avatar')
      return
    }
    if (!avatar) {
      setErrorMessage('Select an avatar')
      return
    }
    if (!name) {
      setErrorMessage('Fill in your name')
      return
    }
    setUserName(name)
    setErrorMessage('')
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
        <form action='' onSubmit={submit}>
          <div className='mb-6 flex items-center'>
            <label htmlFor='name' className='mr-4'>
              Your name
            </label>
            <div className='bg-input rounded-lg flex-1'>
              <input
                type='text'
                name='name'
                placeholder='Enter your name'
                className='border-2 py-1 px-2 text-white w-full bg-transparent border-transparent outline-0 
                focus:outline-none focus-within:outline-none placeholder:text-gray-500'
              />
            </div>
          </div>

          <div className='mb-3'>
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

            <p
              className={cx(
                'mt-3 mb-3 select-none text-red-600 min-h-[25px]',
                errorMessage && 'visible'
              )}
            >
              {errorMessage}
            </p>
          </div>

          <input type='submit' value='Join' className={buttonStyle} />
        </form>
      </div>
    </div>
  )
}

export default Lobby
