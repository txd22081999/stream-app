import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import { useEffect, useState } from 'react'
import { useClient, useMicrophoneAndCameraTracks } from 'config'
import { RTCTokenAxios } from 'config/axios-config'
import { EClientRole, EUserRole } from 'enum'
import { useRoomStore, useUserStore } from 'store'
import { appId, appCertificate, videoConfig } from 'constant'
import { getTokenExpireTime } from 'utils/token-expire-time'
import Controls from 'components/Controls'
import Video from 'components/Video'
import './style.scss'

const VideoCall = (props: any) => {
  const { setInCall } = props
  const { userName, rtcToken, uid, setRtcToken, setUid } = useUserStore()
  const { roomName, roles } = useRoomStore()
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [start, setStart] = useState(false)
  const client = useClient()
  const { ready, tracks } = useMicrophoneAndCameraTracks()

  useEffect(() => {
    const initialize = async (roomName: string) => {
      const roleByRoom = roles.find((item) => item.roomName === roomName)
      if (videoConfig.mode === 'live' && roleByRoom) {
        client.setClientRole(roleByRoom.role)
      }

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)

        // if (mediaType === 'video') {
        //   setUsers((prevUsers) => {
        //     return [...prevUsers, user]
        //   })
        // }
        // if (mediaType === 'audio') {
        //   user.audioTrack?.play()
        // }
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
      if (roleByRoom?.role === EClientRole.HOST && tracks) {
        if (tracks) {
          await client.publish([tracks[0], tracks[1]])
        }
      }
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
    <div>
      <div>{JSON.stringify(roles)}</div>
      <h2>Room: {roomName}</h2>
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
