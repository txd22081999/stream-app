import { useState } from 'react'
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsMicFill,
  BsMicMuteFill,
} from 'react-icons/bs'
import { ImExit } from 'react-icons/im'
import { FaStop } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useClient } from '../../config'
import clsx from 'classnames'
import './style.scss'

export default function Controls(props: any) {
  const navigate = useNavigate()
  const client = useClient()
  const { tracks, setStart, setInCall, stopStream } = props
  const [trackState, setTrackState] = useState({ video: true, audio: true })

  const mute = async (type: string) => {
    if (type === 'audio') {
      await tracks[0].setEnabled(!trackState.audio)
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio }
      })
    } else if (type === 'video') {
      await tracks[1].setEnabled(!trackState.video)
      setTrackState((ps) => {
        return { ...ps, video: !ps.video }
      })
    }
  }

  const leaveChannel = async () => {
    await client.leave()
    client.removeAllListeners()
    tracks[0].close()
    tracks[1].close()
    setStart(false)
    setInCall(false)
    navigate('/room')
  }

  const iconSize: string = 'text-2xl'

  return (
    <div className='w-full'>
      <div className='flex items-center gap-4 mx-auto w-fit'>
        <button onClick={() => mute('audio')}>
          {trackState.audio ? (
            <BsMicFill className={iconSize} />
          ) : (
            <BsMicMuteFill className={iconSize} />
          )}
        </button>
        <button onClick={() => mute('video')}>
          {trackState.video ? (
            <BsFillCameraVideoFill className={iconSize} />
          ) : (
            <BsFillCameraVideoOffFill className={iconSize} />
          )}
        </button>
        <button onClick={leaveChannel}>
          <ImExit className={iconSize} />
        </button>
        <button onClick={stopStream} className='flex items-center'>
          <FaStop className={clsx(iconSize, 'mr-1')} />
          Stop Stream
        </button>
      </div>
    </div>
  )
}
