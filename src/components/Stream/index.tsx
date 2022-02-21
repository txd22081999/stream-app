import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import AudienceCam from 'components/AudienceCam'
import HostCam from 'components/HostCam'
import ScreenVideo from 'components/ScreenVideo'
import { useClient } from 'config'
import { videoConfig } from 'constant'
import { EClientRole } from 'enum'
import { useEffect, useState } from 'react'
import { useRoomStore } from 'store'
import { IClientRoleState } from 'store/room-store'
import './style.scss'

const Stream = (props: any) => {
  const { roomName, roles } = useRoomStore()
  const client = useClient()

  const [hostUser, setHostUser] = useState<IAgoraRTCRemoteUser | null>(null)
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
    setIsScreen((prev) => !prev)
  }

  return (
    <div className='bg-black-main'>
      <h2>Room: {roomName}</h2>
      {/* <div className='flex gap-5'>
        <button onClick={switchShareMode}>Switch screen</button>
      </div> */}
      <div className='video-container h-[85vh]'>
        {isHost && !isScreen && (
          <HostCam
            client={client}
            hostUser={hostUser}
            isScreen={isScreen}
            switchShareMode={switchShareMode}
          />
        )}
        {isHost && isScreen && (
          <ScreenVideo
            client={client}
            isScreen={isScreen}
            setHostUser={setHostUser}
            switchShareMode={switchShareMode}
          />
        )}
        {!isHost && <AudienceCam client={client} />}
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
