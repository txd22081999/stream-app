import { AgoraVideoPlayer } from 'agora-rtc-react'
import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng'
import './style.scss'

interface IVideoProps {
  users: IAgoraRTCRemoteUser[]
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack]
}

export default function Video(props: IVideoProps) {
  const { users, tracks } = props

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
              <div key={user.uid}>
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
