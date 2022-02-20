import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import { useEffect, useState } from 'react'
import {
  ICreateScreenVideoTrack,
  useClient,
  useMicrophoneAndCameraTracks,
  useScreenTracks,
} from 'config'
import { RTCTokenAxios } from 'config/axios-config'
import { EClientRole, EUserRole } from 'enum'
import { useRoomStore, useUserStore } from 'store'
import { appId, appCertificate, videoConfig } from 'constant'
import { getTokenExpireTime } from 'utils/token-expire-time'
import Controls from 'components/Controls'
import CamVideo from 'components/CamVideo'
import './style.scss'
import {
  AgoraVideoPlayer,
  createMicrophoneAndCameraTracks,
  createScreenVideoTrack,
} from 'agora-rtc-react'
import { ILocalVideoTrack, ILocalTrack } from 'agora-rtc-sdk-ng'
import { createClient, createStream } from 'agora-rtc-sdk'
import { generateRTCToken } from 'utils/generate-token'
import ScreenVideo from 'components/ScreenVideo'
import { IClientRoleState } from 'store/room-store'

// let readyScreen: boolean = false
// let tracksScreen: ILocalVideoTrack | null = null

const VideoCall = (props: any) => {
  const { setInCall } = props
  const { userName, rtcToken, uid, setRtcToken, setUid } = useUserStore()
  const { roomName, roles } = useRoomStore()
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [start, setStart] = useState(false)
  const client = useClient()
  const { ready, tracks } = useMicrophoneAndCameraTracks()
  const [hostUser, setHostUser] = useState<IAgoraRTCRemoteUser | null>(null)

  const [isScreen, setIsScreen] = useState<boolean>(false)
  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const isHost: boolean = roleInRoom?.role === EClientRole.HOST

  useEffect(() => {
    const initializeCam = async (roomName: string) => {
      if (videoConfig.mode === 'live' && roleInRoom) {
        client.setClientRole(roleInRoom.role)
      }

      client.on('user-published', async (user, mediaType) => {
        console.log('user publish')
        console.log(user)
        await client.subscribe(user, mediaType)
        setHostUser(user)
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
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid)
          })
        }
      })

      client.on('user-left', (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid)
        })
      })

      // INFO: Only publish stream if client (user) is host
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
      if (isHost && tracks) {
        await client.publish(tracks)
        setIsScreen(false)
      }
      if (!start) setStart(true)
    }

    if (ready && tracks) {
      try {
        initializeCam(roomName)
      } catch (error) {
        console.log(error)
      }
    }
  }, [roomName, client, ready, tracks])

  function switchShareMode() {
    console.log('SWITCH')

    if (!isScreen) {
      console.log('UNPUBLISH')
      client.unpublish(tracks as ILocalTrack[])
    } else {
      client.publish(tracks as ILocalTrack[])
    }
    setIsScreen((prev) => !prev)
  }

  return (
    <div className='bg-black-main'>
      <div>{JSON.stringify(roles)}</div>
      <h2>Room: {roomName}</h2>
      <div className='flex gap-5'>
        <button onClick={switchShareMode}>Switch screen</button>
        <button onClick={() => client.unpublish(tracks as ILocalTrack[])}>
          unpublish
        </button>
        <button onClick={() => client.publish(tracks as ILocalTrack[])}>
          publish
        </button>
      </div>
      <div className='video-container h-[80vh]'>
        {!isScreen && start && tracks && (
          <CamVideo
            tracksCam={tracks}
            users={users}
            isScreen={isScreen}
            client={client}
            hostUser={hostUser}
            isHost={isHost}
          />
        )}
        {/* {isScreen && isHost && (
          <ScreenVideo users={users} isScreen={isScreen} client={client} />
        )} */}
        {/* {isScreen && start && tracksScreen && (
          <Video
            users={users}
            tracksScreen={tracksScreen}
            isScreen={isScreen}
          />
        )} */}
      </div>
      <div className='controls-container'>
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </div>
    </div>
  )
}

export default VideoCall
