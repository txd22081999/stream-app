import { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import Controls from 'components/Controls'
import { appId } from 'constant'
import { EClientRole } from 'enum'
import { useEffect, useState } from 'react'
import { useRoomStore, useUserStore } from 'store'
import { IClientRoleState } from 'store/room-store'
import { generateRTCToken } from 'utils/generate-token'

interface IAudienceCCamProps {
  client: IAgoraRTCClient
}

const AudienceCam = (props: IAudienceCCamProps) => {
  const { client } = props
  const { rtcToken, setRtcToken } = useUserStore()
  const { roomName, roles } = useRoomStore()
  const [hostUser, setHostUser] = useState<IAgoraRTCRemoteUser | null>(null)
  const [start, setStart] = useState(false)
  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const isHost: boolean = roleInRoom?.role === EClientRole.HOST

  useEffect(() => {
    try {
      initializeCam(roomName)
    } catch (error) {
      console.log(error)
    }

    window.addEventListener('beforeunload', () => {
      cleanup()
    })

    return () => {
      cleanup()
    }
  }, [client])

  function cleanup() {
    client.leave()
  }

  async function initializeCam(roomName: string) {
    console.log('initialize Audience Cam')

    client.on('user-published', async (user, mediaType) => {
      console.log('SUBCRIBE REMOTE')
      await client.subscribe(user, mediaType)
      user.audioTrack?.play()
      user.videoTrack?.play('stream-box', { fit: 'cover', mirror: true })
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
      // await client.unsubscribe(user, mediaType)
    })

    client.on('user-left', (user) => {})

    await getNewToken(roomName)
    if (!start) setStart(true)
  }

  async function getNewToken(roomName: string) {
    try {
      let token: string = rtcToken
      token = await generateRTCToken(roomName)
      setRtcToken(token)
      await client.join(appId, roomName, token)
    } catch (error) {
      console.log('error')
    }
  }

  if (hostUser) {
    return (
      <div className='h-full flex flex-col'>
        {hostUser.videoTrack && (
          <>
            <div className='video-list flex-1 grid h-full'>
              <div id='stream-box' className='h-full w-full bg-slate-800'></div>
            </div>
            <Controls
              client={client}
              tracks={hostUser.videoTrack}
              isHost={isHost}
              isScreen={false}
            />
          </>
        )}
      </div>
    )
  }

  return <p className='text-sm'>Loading stream...</p>
}

export default AudienceCam
