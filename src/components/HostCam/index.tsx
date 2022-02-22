import { AgoraVideoPlayer } from 'agora-rtc-react'
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalTrack,
} from 'agora-rtc-sdk-ng'
import Controls from 'components/Controls'
import { useMicrophoneAndCameraTracks } from 'config'
import { appId } from 'constant'
import { EClientRole } from 'enum'
import { useEffect } from 'react'
import { useRoomStore, useUserStore } from 'store'
import { IClientRoleState } from 'store/room-store'
import { generateRTCToken } from 'utils/generate-token'

interface IHostCamProps {
  client: IAgoraRTCClient
  hostUser: IAgoraRTCRemoteUser | null
  isScreen: boolean
  switchShareMode: () => {}
}

const HostCam = (props: IHostCamProps) => {
  const { client, hostUser, isScreen, switchShareMode } = props
  const { ready, tracks } = useMicrophoneAndCameraTracks()
  const { rtcToken, setRtcToken } = useUserStore()
  const { roomName, roles } = useRoomStore()
  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const isHost: boolean = roleInRoom?.role === EClientRole.HOST

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      cleanup()
    })

    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    const initializeCam = async (roomName: string) => {
      client.on('user-published', async (user, mediaType) => {
        if (!isHost) {
          await client.subscribe(user, mediaType)
        }
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
      if (tracks) {
        await client.publish(tracks)
        console.log('publish cam here')
      }
    }

    if (ready && tracks) {
      try {
        initializeCam(roomName)
      } catch (error) {
        console.log(error)
      }
    }
  }, [client, ready])

  function cleanup() {
    client.leave()
  }

  function unpublish() {
    client.unpublish(tracks as ILocalTrack[])
  }

  function publish() {
    client.publish(tracks as ILocalTrack[])
  }

  if (isHost) {
    if (tracks && ready) {
      return (
        <div className='h-full flex flex-col'>
          <div className='video-list flex-1 grid'>
            <AgoraVideoPlayer
              videoTrack={tracks[1]}
              className='h-full w-full'
            />
          </div>
          <Controls
            client={client}
            tracks={tracks}
            publish={publish}
            unpublish={unpublish}
            isHost={isHost}
            isScreen={isScreen}
            switchShareMode={switchShareMode}
          />
        </div>
      )
    }
  }

  if (!isHost && hostUser) {
    return (
      <div className='h-full flex flex-col'>
        <div className='video-list flex-1 grid'>
          {hostUser.videoTrack && ready && (
            <AgoraVideoPlayer
              videoTrack={hostUser.videoTrack}
              className='h-full w-full'
            />
          )}
        </div>
      </div>
    )
  }

  return <p className='text-sm'>Error in initializing stream</p>
}

export default HostCam
