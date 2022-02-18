import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  appCertificate,
  appId,
  RTC_TOKEN_BUILDER_URL,
  useClient,
  useMicrophoneAndCameraTracks,
} from '../../config'
import { ERole } from '../../enum'
import { useStore } from '../../store'
import { getTokenExpireTime } from '../../utils/token-expire-time'
import Controls from '../Controls/Controls'
import Video from '../Video'
import './style.scss'

const VideoCall = (props: any) => {
  const { setInCall } = props
  const { userName, roomName, rtcToken, uid, setRtcToken, setUid } = useStore()
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [start, setStart] = useState(false)
  const client = useClient()
  const { ready, tracks } = useMicrophoneAndCameraTracks()

  useEffect(() => {
    let initialize = async (roomName: string) => {
      // client.setClientRole('host')
      client.setClientRole('audience')

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
        if (mediaType === 'video') {
          setUsers((prevUsers) => {
            return [...prevUsers, user]
          })
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play()
        }
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

        if (!token) {
          token = await generateRtmToken(roomName)
        }
        await client.join(appId, roomName, token, uid)
      } catch (error) {
        console.log('error')
      }

      if (tracks) await client.publish([tracks[0], tracks[1]])
      setStart(true)
    }

    if (ready && tracks) {
      try {
        initialize(roomName)
      } catch (error) {
        console.log(error)
      }
    }
  }, [roomName, client, ready, tracks])

  async function generateRtmToken(roomName: string) {
    const uid = Math.floor(Math.random() * 999999)
    setUid(uid)

    const {
      data: { token },
    } = await axios.post(RTC_TOKEN_BUILDER_URL, {
      appId,
      appCertificate,
      channelName: roomName,
      uid: uid,
      role: ERole.PUBLISHER,
      privilegeExpiredTs: getTokenExpireTime(),
    })

    setRtcToken(token)
    return token
  }

  return (
    <div>
      <div className='video-container'>
        {start && tracks && <Video tracks={tracks} users={users} />}
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
