import { useState } from 'react'
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsMicFill,
  BsMicMuteFill,
} from 'react-icons/bs'
import { ImExit } from 'react-icons/im'
import { useClient } from '../../config'
import './style.scss'

export default function Controls(props: any) {
  const client = useClient()
  const { tracks, setStart, setInCall } = props
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
  }

  return (
    <div className='controls-wrapper'>
      <div>
        <button onClick={() => mute('audio')}>
          {trackState.audio ? <BsMicFill /> : <BsMicMuteFill />}
        </button>
      </div>
      <div>
        <button onClick={() => mute('video')}>
          {trackState.video ? (
            <BsFillCameraVideoFill />
          ) : (
            <BsFillCameraVideoOffFill />
          )}
        </button>
      </div>
      <div>
        <button onClick={leaveChannel}>
          {/* Leave */}
          <ImExit />
        </button>
      </div>
    </div>
  )
}
