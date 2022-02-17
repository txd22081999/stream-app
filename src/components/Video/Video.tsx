import { GridSize } from '@material-ui/core'
import { AgoraVideoPlayer } from 'agora-rtc-react'
import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng'
import { useEffect, useState } from 'react'
import './style.scss'

interface IVideoProps {
  users: IAgoraRTCRemoteUser[]
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack]
}

export default function Video(props: IVideoProps) {
  const { users, tracks } = props
  const [gridSpacing, setGridSpacing] = useState<GridSize>(12)

  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4) as GridSize)
  }, [users, tracks])

  return (
    <div className='video-list'>
      <div>
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <div>
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  key={user.uid}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            )
          } else return null
        })}
    </div>
  )
}
