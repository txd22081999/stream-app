import { AgoraVideoPlayer } from 'agora-rtc-react'
import {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCClient,
} from 'agora-rtc-sdk-ng'
import { ICreateScreenVideoTrack, useScreenTracks } from 'config'
import { videoConfig } from 'constant'
import { EClientRole } from 'enum'
import { useEffect } from 'react'
import { useRoomStore } from 'store'
import { appCertificate, appId } from 'constant'
import './style.scss'
import { generateRTCToken } from 'utils/generate-token'

interface IVideoProps {
  users: IAgoraRTCRemoteUser[]
  tracksCam?: [IMicrophoneAudioTrack, ICameraVideoTrack]
  // | [ILocalAudioTrack, ILocalVideoTrack]
  tracksScreen?: ILocalVideoTrack
  isScreen: boolean
  client: IAgoraRTCClient
  hostUser: IAgoraRTCRemoteUser | null
  isHost: boolean
}

const CamVideo = (props: IVideoProps) => {
  const { users, tracksCam, isScreen, client, isHost, hostUser } = props
  console.log('use remote tracks', !isHost && hostUser)
  console.log('HOST')
  console.log(hostUser)

  console.log('TRACKS')
  console.log(hostUser?.videoTrack)

  if (isHost) {
    return (
      <div className='video-list h-full grid'>
        {tracksCam && (
          <AgoraVideoPlayer
            videoTrack={tracksCam[1]}
            className='h-full w-full'
          />
        )}

        {/* <AgoraVideoPlayer
            videoTrack={
              !isHost && hostUser ? hostUser.videoTrack! : tracksCam[1]
            }
            className='h-full w-full'
          /> */}
      </div>
    )
  }

  if (!isHost && hostUser) {
    return (
      <div className='video-list h-full grid'>
        {hostUser.videoTrack && (
          <AgoraVideoPlayer
            videoTrack={hostUser.videoTrack}
            className='h-full w-full'
          />
        )}
      </div>
    )
  }

  return null
}

export default CamVideo
