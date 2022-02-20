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
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null)

  const [isScreen, setIsScreen] = useState<boolean>(false)
  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const isHost: boolean = roleInRoom?.role === EClientRole.HOST

  useEffect(() => {
    const initializeCam = async (roomName: string) => {
      console.log('initializeCam')

      if (videoConfig.mode === 'live' && roleInRoom) {
        client.setClientRole(roleInRoom.role)
      }

      client.on('user-published', async (user, mediaType) => {
        console.log('SUBCRIBE REMOTE')
        console.log(user)
        console.log(user.videoTrack?.isPlaying)
        if (!isHost) {
          await client.subscribe(user, mediaType)
        }
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
      if (isHost && tracks && !isScreen) {
        // await client.publish(tracks)
        console.log('publish cam here')

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
  }, [client, ready])

  async function switchShareMode() {
    console.log('SWITCH')
    // if (!isScreen) {
    //   console.log(screenTrack)
    //   await client.unpublish(tracks as ILocalTrack[])
    //   if (screenTrack) await client.publish(screenTrack)
    // } else {
    //   console.log(screenTrack)
    //   if (screenTrack) await client.unpublish(screenTrack)
    //   await client.publish(tracks as ILocalTrack[])
    // }
    setIsScreen((prev) => !prev)
  }

  useEffect(() => {
    ;(async () => {
      if (!isHost) return
      console.log(screenTrack)
      if (isScreen) {
        console.log('ADD SCREEN')
        await client.unpublish(tracks as ILocalTrack[])
        if (screenTrack) {
          console.log('REMOVE CAM')
          await client.publish(screenTrack)
        }
      } else {
        console.log('ADD CAM')

        if (screenTrack) {
          console.log('REMOVE SCREEN')
          await client.unpublish(screenTrack)
        }
        await client.publish(tracks as ILocalTrack[])
      }
    })()
  }, [isScreen])

  if (isHost && !isScreen && start && tracks) {
    console.log('here 1 ')
  }
  if (isHost && isScreen) {
    console.log('here 2 ')
  }
  if (!isHost) {
    console.log('here 3')
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
        {isHost && !isScreen && start && tracks && (
          <CamVideo
            tracksCam={tracks}
            users={users}
            isScreen={isScreen}
            client={client}
            hostUser={hostUser}
            isHost={isHost}
          />
        )}
        {isHost && isScreen && (
          <ScreenVideo
            users={users}
            isScreen={isScreen}
            client={client}
            setHostUser={setHostUser}
            setScreenTrack={setScreenTrack}
          />
        )}
        {!isHost && (
          <CamVideo
            users={users}
            isScreen={isScreen}
            client={client}
            hostUser={hostUser}
            isHost={isHost}
          />
        )}
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
