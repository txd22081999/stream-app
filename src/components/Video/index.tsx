import { AgoraVideoPlayer } from 'agora-rtc-react'
import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from 'agora-rtc-sdk-ng'
import './style.scss'

interface IVideoProps {
  users: IAgoraRTCRemoteUser[]
  tracksCam?: [IMicrophoneAudioTrack, ICameraVideoTrack]
  // | [ILocalAudioTrack, ILocalVideoTrack]
  tracksScreen?: ILocalVideoTrack
  isScreen: boolean
}

export default function Video(props: IVideoProps) {
  const { users, tracksCam, tracksScreen, isScreen } = props

  return (
    <div className='video-list h-full grid'>
      <div>
        {isScreen && tracksScreen && (
          <AgoraVideoPlayer
            videoTrack={tracksScreen}
            style={{ height: '100%', width: '100%' }}
          />
        )}
        {!isScreen && tracksCam && (
          <AgoraVideoPlayer
            videoTrack={tracksCam[1]}
            style={{ height: '100%', width: '100%' }}
          />
        )}
        {/* <AgoraVideoPlayer
          videoTrack={isScreen ? tracksScreen : tracksCam[1]}
          style={{ height: '100%', width: '100%' }}
        /> */}
      </div>
      {/* {isScreen && (
        <div
          id='stream-box-1'
          className='w-[500px] h-[500px] bg-slate-400'
        ></div>
      )} */}
      {/* {users.length > 0 &&
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
        })} */}
    </div>
  )
}
