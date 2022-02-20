import { AgoraVideoPlayer } from 'agora-rtc-react'
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng'
import { useMicrophoneAndCameraTracks } from 'config'
import { appId } from 'constant'
import { EClientRole } from 'enum'
import { useEffect, useState } from 'react'
import { useRoomStore, useUserStore } from 'store'
import { IClientRoleState } from 'store/room-store'
import { generateRTCToken } from 'utils/generate-token'

interface IAudienceCCamProps {
  users: IAgoraRTCRemoteUser[]
  tracksCam?: [IMicrophoneAudioTrack, ICameraVideoTrack]
  tracksScreen?: ILocalVideoTrack
  isScreen: boolean
  client: IAgoraRTCClient
  hostUser: IAgoraRTCRemoteUser | null
  isHost: boolean
  screenTrack: ILocalVideoTrack | null
}

const AudienceCam = (props: IAudienceCCamProps) => {
  const { users, isScreen, client, screenTrack } = props
  const { userName, rtcToken, uid, setRtcToken, setUid } = useUserStore()
  const { roomName, roles } = useRoomStore()
  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const [hostUser, setHostUser] = useState<IAgoraRTCRemoteUser | null>(null)
  // const isHost: boolean = roleInRoom?.role === EClientRole.HOST
  const [start, setStart] = useState(false)

  useEffect(() => {
    const initializeCam = async (roomName: string) => {
      console.log('initializeCam')

      client.on('user-published', async (user, mediaType) => {
        console.log('SUBCRIBE REMOTE')
        await client.subscribe(user, mediaType)
        setHostUser(user)
      })

      client.on('stream-type-changed', (uid, streamType) => {
        console.log(uid, streamType)
      })

      client.on('user-joined', async (user) => {
        console.log(user)
      })

      client.on('user-unpublished', async (user, mediaType) => {
        console.log('User unpublished')

        // if (mediaType === 'audio') {
        //   if (user.audioTrack) user.audioTrack.stop()
        // }
        // if (mediaType === 'video') {
        //   if (user.videoTrack) user.videoTrack.stop()
        // }
        await client.unsubscribe(user, mediaType)
      })

      client.on('user-left', (user) => {})

      try {
        let token: string = rtcToken
        if (true) {
          token = await generateRTCToken(roomName)
          setRtcToken(token)
        }
        await client.join(appId, roomName, token)
      } catch (error) {
        console.log('error')
      }
      if (!start) setStart(true)
    }

    try {
      initializeCam(roomName)
    } catch (error) {
      console.log(error)
    }
  }, [client])

  if (hostUser) {
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

  return <p>Error in loading stream</p>
}

export default AudienceCam
