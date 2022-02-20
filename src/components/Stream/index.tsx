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
import HostCam from 'components/HostCam'
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
import AudienceCam from 'components/AudienceCam'

// let readyScreen: boolean = false
// let tracksScreen: ILocalVideoTrack | null = null

const Stream = (props: any) => {
  const { setInCall } = props
  const { userName, rtcToken, uid, setRtcToken, setUid } = useUserStore()
  const { roomName, roles } = useRoomStore()
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [start, setStart] = useState(false)
  const client = useClient()

  const [hostUser, setHostUser] = useState<IAgoraRTCRemoteUser | null>(null)
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null)

  const [isScreen, setIsScreen] = useState<boolean>(false)
  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const isHost: boolean = roleInRoom?.role === EClientRole.HOST

  useEffect(() => {
    ;(async () => {
      if (videoConfig.mode === 'live' && roleInRoom) {
        await client.setClientRole(roleInRoom.role)
      }
    })()
  })

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

  // if (isHost && !isScreen && start && tracks) {
  //   console.log('here 1 ')
  // }
  // if (isHost && isScreen) {
  //   console.log('here 2 ')
  // }
  // if (!isHost) {
  //   console.log('here 3')
  // }

  return (
    <div className='bg-black-main'>
      <div>{JSON.stringify(roles)}</div>
      <h2>Room: {roomName}</h2>
      <div className='flex gap-5'>
        <button onClick={switchShareMode}>Switch screen</button>
      </div>
      <div className='video-container h-[80vh]'>
        {isHost && !isScreen && (
          <HostCam
            // tracksCam={tracks}
            users={users}
            isScreen={isScreen}
            client={client}
            hostUser={hostUser}
            isHost={isHost}
            screenTrack={screenTrack}
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
          <AudienceCam
            users={users}
            isScreen={isScreen}
            client={client}
            hostUser={hostUser}
            isHost={isHost}
            screenTrack={screenTrack}
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
        {/* {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )} */}
      </div>
    </div>
  )
}

export default Stream
