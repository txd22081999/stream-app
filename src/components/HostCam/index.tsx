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

interface IHostCamProps {
  client: IAgoraRTCClient
  hostUser: IAgoraRTCRemoteUser | null
  switchShareMode: () => {}
}

const HostCam = (props: IHostCamProps) => {
  const { client, hostUser, switchShareMode } = props
  const { ready, tracks } = useMicrophoneAndCameraTracks()
  const { rtcToken, setRtcToken } = useUserStore()
  const { roomName, roles } = useRoomStore()
  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const isHost: boolean = roleInRoom?.role === EClientRole.HOST
  const [start, setStart] = useState(false)

  useEffect(() => {
    return () => {
      client.unpublish()
    }
  }, [])

  useEffect(() => {
    const initializeCam = async (roomName: string) => {
      console.log('initializeCam')

      client.on('user-published', async (user, mediaType) => {
        console.log('SUBCRIBE REMOTE')
        console.log(user)
        console.log(user.videoTrack?.isPlaying)
        if (!isHost) {
          await client.subscribe(user, mediaType)
        }
        // setHostUser(user)
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
        // setIsScreen(false)
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

  // useEffect(() => {
  //   ;(async () => {
  //     console.log(screenTrack)
  //     if (isScreen) {
  //       console.log('ADD SCREEN')
  //       await client.unpublish(tracks as ILocalTrack[])
  //       if (screenTrack) {
  //         console.log('REMOVE CAM')
  //         await client.publish(screenTrack)
  //       }
  //     } else {
  //       console.log('ADD CAM')

  //       if (screenTrack) {
  //         console.log('REMOVE SCREEN')
  //         await client.unpublish(screenTrack)
  //       }
  //       await client.publish(tracks as ILocalTrack[])
  //     }
  //   })()
  // }, [isScreen])

  console.log('ready', ready)
  console.log(tracks && ready)

  if (isHost) {
    return (
      <>
        <div className='video-list h-full grid'>
          {tracks && ready && (
            <AgoraVideoPlayer
              videoTrack={tracks[1]}
              className='h-full w-full'
            />
          )}

          {/* <AgoraVideoPlayer
            videoTrack={
              !isHost && hostUser ? hostUser.videoTrack! : tracksCam[1]
            }
            className='h-full w-full'
          /> */}
        </div>
        <div>
          <button
            onClick={() => client.unpublish(tracks as ILocalTrack[])}
            className='mr-5'
          >
            unpublish
          </button>
          <button
            onClick={() => client.publish(tracks as ILocalTrack[])}
            className='mr-5'
          >
            publish
          </button>
          <button onClick={switchShareMode}>Switch</button>
        </div>
      </>
    )
  }

  if (!isHost && hostUser) {
    return (
      <div className='video-list h-full grid'>
        {hostUser.videoTrack && ready && (
          <AgoraVideoPlayer
            videoTrack={hostUser.videoTrack}
            className='h-full w-full'
          />
        )}
      </div>
    )
  }

  return <p>Error in initializing stream</p>
}

export default HostCam
