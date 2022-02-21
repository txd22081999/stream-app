import { useState } from 'react'
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsMicFill,
  BsMicMuteFill,
} from 'react-icons/bs'
import { ImExit } from 'react-icons/im'
import { FaStop } from 'react-icons/fa'
import { MdOutlineMonitor } from 'react-icons/md'
import { BiWebcam } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import clsx from 'classnames'
import './style.scss'
import ReactTooltip from 'react-tooltip'
import {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  ILocalVideoTrack,
} from 'agora-rtc-sdk-ng'

interface IControlsProps {
  client: IAgoraRTCClient
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | ILocalVideoTrack
  isHost: boolean
  isScreen: boolean
  publish: () => void
  unpublish: () => void
  switchShareMode: () => void
}

export default function Controls(props: IControlsProps) {
  const {
    client,
    tracks,
    isHost,
    isScreen,
    publish,
    unpublish,
    switchShareMode,
  } = props
  const navigate = useNavigate()
  const [trackState, setTrackState] = useState({ video: true, audio: true })
  const [isPublised, setIsPubished] = useState<boolean>(true)

  async function mute(type: string) {
    if (type === 'audio') {
      if (Array.isArray(tracks)) {
        await tracks[0].setEnabled(!trackState.audio)
      }
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio }
      })
    } else if (type === 'video') {
      if (Array.isArray(tracks)) {
        await tracks[1].setEnabled(!trackState.video)
      } else {
        await tracks.setEnabled(!trackState.video)
      }
      setTrackState((ps) => {
        return { ...ps, video: !ps.video }
      })
    }
  }

  async function leaveChannel() {
    await client.leave()
    client.removeAllListeners()
    if (Array.isArray(tracks)) {
      tracks[0].close()
      tracks[1].close()
    } else {
      tracks.close()
    }
    navigate('/room')
  }

  async function stopStream() {
    if (isPublised) unpublish()
    else publish()
    setIsPubished((published) => !published)
  }

  const iconSize: string = 'text-xl'

  return (
    <div className='w-full mt-2 '>
      <div className='flex items-center gap-4 mx-auto w-fit px-6 py-2'>
        <button
          onClick={() => mute('audio')}
          data-tip={trackState.audio ? 'On Mic' : 'Off Mic'}
          className='px-2 py-2 bg-input rounded-md'
        >
          {trackState.audio ? (
            <BsMicFill className={clsx(iconSize, 'text-dark-white ')} />
          ) : (
            <BsMicMuteFill className={clsx(iconSize, 'text-dark-white ')} />
          )}
        </button>
        <button
          onClick={() => mute('video')}
          data-tip={trackState.video ? 'On Video' : 'Off Video'}
          className='px-2 py-2 bg-input rounded-md'
        >
          {trackState.video ? (
            <BsFillCameraVideoFill
              className={clsx(iconSize, 'text-dark-white ')}
            />
          ) : (
            <BsFillCameraVideoOffFill
              className={clsx(iconSize, 'text-dark-white ')}
            />
          )}
        </button>
        <button
          onClick={switchShareMode}
          data-tip={isScreen ? 'On Screen' : 'On Canera'}
          className='px-2 py-2 bg-input rounded-md'
        >
          {isScreen ? (
            <MdOutlineMonitor className={clsx(iconSize, 'text-dark-white ')} />
          ) : (
            <BiWebcam className={clsx(iconSize, 'text-dark-white ')} />
          )}
        </button>
        {isHost && (
          <button
            onClick={stopStream}
            className='flex items-center px-2 py-2 bg-input rounded-md'
            data-tip='Stop Stream'
          >
            <FaStop className={clsx(iconSize, 'text-red-500 block ')} />
          </button>
        )}
        <button
          onClick={leaveChannel}
          className='text-sm px-2 py-2 bg-input rounded-md'
          data-tip='Leave'
        >
          <ImExit className={clsx(iconSize)} />
        </button>
        <ReactTooltip />
      </div>
    </div>
  )
}
