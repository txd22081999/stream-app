import { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import { appId } from 'constant'
import { useEffect, useState } from 'react'
import { useRoomStore, useUserStore } from 'store'
import { generateRTCToken } from 'utils/generate-token'

interface IAudienceCCamProps {
  client: IAgoraRTCClient
}

const AudienceCam = (props: IAudienceCCamProps) => {
  const { client } = props
  const { rtcToken, setRtcToken } = useUserStore()
  const { roomName } = useRoomStore()
  const [hostUser, setHostUser] = useState<IAgoraRTCRemoteUser | null>(null)
  const [start, setStart] = useState(false)

  useEffect(() => {
    const initializeCam = async (roomName: string) => {
      console.log('initializeCam')

      client.on('user-published', async (user, mediaType) => {
        console.log('SUBCRIBE REMOTE')
        await client.subscribe(user, mediaType)
        user.audioTrack?.play()
        user.videoTrack?.play('stream-box')
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

    try {
      initializeCam(roomName)
    } catch (error) {
      console.log(error)
    }
  }, [client])

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
      <div className='video-list h-full grid'>
        {hostUser.videoTrack && (
          // <AgoraVideoPlayer
          //   videoTrack={hostUser.videoTrack}
          //   className='h-full w-full'
          // />
          <div id='stream-box' className='h-full w-full bg-slate-400'></div>
        )}
      </div>
    )
  }

  return <p>Error in loading stream</p>
}

export default AudienceCam
