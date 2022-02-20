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
import Video from 'components/Video'
import './style.scss'
import {
  AgoraVideoPlayer,
  createMicrophoneAndCameraTracks,
  createScreenVideoTrack,
} from 'agora-rtc-react'
import { ILocalVideoTrack } from 'agora-rtc-sdk-ng'
import { createClient, createStream } from 'agora-rtc-sdk'

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
  const { ready: readyScreen, tracks: tracksScreen } =
    useScreenTracks() as ICreateScreenVideoTrack
  const [isScreen, setIsScreen] = useState<boolean>(false)
  const roleInRoom = roles.find((item) => item.roomName === roomName)

  useEffect(() => {
    const initializeCam = async (roomName: string) => {
      if (videoConfig.mode === 'live' && roleInRoom) {
        client.setClientRole(roleInRoom.role)
      }

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
      })

      client.on('stream-type-changed', (uid, streamType) => {
        console.log(uid, streamType)
      })

      client.on('user-joined', async (user) => {
        console.log('User Join')

        console.log(user)
      })

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'audio') {
          if (user.audioTrack) user.audioTrack.stop()
        }
        if (mediaType === 'video') {
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

      try {
        let token: string = rtcToken

        // if (!token) {
        if (true) {
          token = await generateRtmToken(roomName)
          setRtcToken(token)
        }
        await client.join(appId, roomName, token)
      } catch (error) {
        console.log('error')
      }

      // INFO: Only publish stream if client (user) is host
      if (roleInRoom?.role === EClientRole.HOST && tracks) {
        await client.publish([tracks[0], tracks[1]])
      }
      if (!start) setStart(true)
      setIsScreen(false)
    }

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

      try {
        let token: string = rtcToken

        // if (!token) {
        if (true) {
          token = await generateRtmToken(roomName)
          setRtcToken(token)
        }
        await client.join(appId, roomName, token)
      } catch (error) {
        console.log('error')
      }

      // INFO: Only publish stream if client (user) is host
      if (roleByRoom?.role === EClientRole.HOST && tracksScreen) {
        await client.publish(tracksScreen)
      }
      if (!start) setStart(true)
      setIsScreen(true)
    }

    if (ready && tracks && readyScreen && tracksScreen) {
      initializeCam(roomName)
      initializeScreen(roomName)
    }

    if (ready && tracks) {
      try {
        initializeCam(roomName)
      } catch (error) {
        console.log(error)
      }
    } else if (roleInRoom?.role === EClientRole.HOST) {
      try {
        initializeScreen(roomName)
      } catch (error) {
        console.log(error)
      }
    }
  }, [roomName, client, ready, tracks, readyScreen, tracksScreen])

  async function generateRtmToken(roomName: string) {
    const {
      data: { token },
    } = await RTCTokenAxios.request({
      data: {
        appId,
        appCertificate,
        channelName: roomName,
        uid: 0,
        role: EUserRole.PUBLISHER,
        privilegeExpiredTs: getTokenExpireTime(),
      },
    })

    return token
  }

  return (
    <div className='bg-black-main'>
      <div>{JSON.stringify(roles)}</div>
      <h2>Room: {roomName}</h2>
      <button onClick={() => setIsScreen((prev) => !prev)}>
        Switch screen
      </button>
      <div className='video-container'>
        {!isScreen && start && tracks && (
          <Video tracksCam={tracks} users={users} isScreen={isScreen} />
        )}
        {isScreen && start && tracksScreen && (
          <Video
            users={users}
            tracksScreen={tracksScreen}
            isScreen={isScreen}
          />
        )}
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
