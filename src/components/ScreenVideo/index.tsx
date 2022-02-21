import { AgoraVideoPlayer } from 'agora-rtc-react'
import { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import Controls from 'components/Controls'
import { ICreateScreenVideoTrack, useScreenTracks } from 'config'
import { appId } from 'constant'
import { EClientRole } from 'enum'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useRoomStore } from 'store'
import { IClientRoleState } from 'store/room-store'
import { generateRTCToken } from 'utils/generate-token'
import './style.scss'

interface IVideoProps {
  isScreen: boolean
  client: IAgoraRTCClient
  setHostUser: Dispatch<SetStateAction<IAgoraRTCRemoteUser | null>>
  switchShareMode: () => void
}

const ScreenVideo = (props: IVideoProps) => {
  const { isScreen, client, setHostUser, switchShareMode } = props
  const { ready: readyScreen, tracks } =
    useScreenTracks() as ICreateScreenVideoTrack
  const { roles, roomName } = useRoomStore()

  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const isHost: boolean = roleInRoom?.role === EClientRole.HOST

  useEffect(() => {
    const initializeScreen = async (roomName: string) => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
        if (!isHost) {
          setHostUser(user)
        }
      })

      client.on('stream-type-changed', (uid, streamType) => {
        console.log(uid, streamType)
      })

      client.on('user-joined', async (user) => {
        console.log(user)
      })

      client.on('user-unpublished', (user, mediaType) => {
        client.unsubscribe(user)
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
      if (tracks) {
        await client.publish(tracks)
      }
    }

    if (readyScreen && tracks) {
      try {
        initializeScreen(roomName)
      } catch (error) {
        console.log(error)
      }
    }
  }, [roomName, client, readyScreen, tracks])

  useEffect(() => {
    return () => {
      client.unpublish()
    }
  }, [])

  function unpublish() {
    client.unpublish(tracks)
  }

  function publish() {
    client.publish(tracks)
  }

  return (
    <div className='h-full flex flex-col'>
      {isScreen && tracks && (
        <>
          <div className='video-list flex-1 grid'>
            <AgoraVideoPlayer videoTrack={tracks} className='h-full w-full' />
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
        </>
      )}
    </div>
  )
}

export default ScreenVideo
