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
import { generateRTCToken } from 'utils/generate-token'
import './style.scss'

interface IVideoProps {
  users: IAgoraRTCRemoteUser[]
  tracksCam?: [IMicrophoneAudioTrack, ICameraVideoTrack]
  // | [ILocalAudioTrack, ILocalVideoTrack]
  tracksScreen?: ILocalVideoTrack
  isScreen: boolean
  client: IAgoraRTCClient
}

const ScreenVideo = (props: IVideoProps) => {
  const { users, tracksCam, isScreen, client } = props
  const { ready: readyScreen, tracks: tracksScreen } =
    useScreenTracks() as ICreateScreenVideoTrack
  const { roles, roomName } = useRoomStore()

  useEffect(() => {
    const initializeScreen = async (roomName: string) => {
      const roleByRoom = roles.find((item) => item.roomName === roomName)
      if (videoConfig.mode === 'live' && roleByRoom) {
        client.setClientRole(roleByRoom.role)
      }

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
      })

      client.on('stream-type-changed', (uid, streamType) => {
        console.log(uid, streamType)
      })

      client.on('user-joined', async (user) => {
        console.log(user)
      })

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'audio') {
          if (user.audioTrack) user.audioTrack.stop()
        }
        if (mediaType === 'video') {
          if (user.videoTrack) user.videoTrack.stop()
        }
      })

      client.on('user-left', (user) => {})

      try {
        const token = await generateRTCToken(roomName)
        await client.join(appId, roomName, token)
      } catch (error) {
        console.log('error')
      }

      // INFO: Only publish stream if client (user) is host
      if (roleByRoom?.role === EClientRole.HOST && tracksScreen) {
        console.log('PUBLISH SCREEN')

        await client.publish(tracksScreen)
      }
      // if (!start) setStart(true)
      // setIsScreen(true)
    }

    if (readyScreen && tracksScreen) {
      try {
        initializeScreen(roomName)
      } catch (error) {
        console.log(error)
      }
    }
  }, [roomName, client, readyScreen, tracksScreen])

  return (
    <div className='video-list h-full grid'>
      <div>
        {isScreen && tracksScreen && (
          <AgoraVideoPlayer
            videoTrack={tracksScreen}
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </div>
    </div>
  )
}

export default ScreenVideo
