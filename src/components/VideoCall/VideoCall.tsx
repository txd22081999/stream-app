import { Grid } from '@material-ui/core'
import { useEffect, useState } from 'react'
import {
  appId,
  channelName,
  token,
  useClient,
  useMicrophoneAndCameraTracks,
} from '../../config'
import Controls from '../Controls/Controls'
import Video from '../Video/Video'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import './style.scss'

export default function VideoCall(props: any) {
  const { setInCall } = props
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [start, setStart] = useState(false)
  const client = useClient()
  const { ready, tracks } = useMicrophoneAndCameraTracks()

  useEffect(() => {
    let init = async (name: string) => {
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
        await client.join(appId, name, token, null)
      } catch (error) {
        console.log('error')
      }

      if (tracks) await client.publish([tracks[0], tracks[1]])
      setStart(true)
    }

    if (ready && tracks) {
      try {
        init(channelName)
      } catch (error) {
        console.log(error)
      }
    }
  }, [channelName, client, ready, tracks])

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
