import AgoraRTM, { RtmClient } from 'agora-rtm-sdk'
import Loading from 'components/Loading'
import RoomCard from 'components/RoomCard'
import { AgoraAxios, ApiAxios, RTMTokenAxios } from 'config/axios-config'
import { appCertificate, appId, colorList } from 'constant'
import { EClientRole } from 'enum'
import keyBy from 'lodash/keyBy'
import merge from 'lodash/merge'
import values from 'lodash/values'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoomStore, useUserStore } from 'store'
import { IRoom } from 'store/room-store'
import { randomInList } from 'utils/random-of-list'
import { getTokenExpireTime } from 'utils/token-expire-time'

const Rooms = () => {
  const [showCreateRoom, setShowCreateRoom] = useState<boolean>(false)
  const { rooms, setRoomName, setRooms, setTotalRoom, addRole } = useRoomStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { userName, userAvatar, setUserColor } = useUserStore()
  const navigate = useNavigate()
  // const [rtmClient, setRtmClient] = useState<RtmClient | null>(null)

  useEffect(() => {
    initiate()
    updateUserAvatar()
    setUserColor(randomInList(colorList))
  }, [userAvatar])

  async function initiate() {
    setLoading(true)
    const client = await AgoraRTM.createInstance(appId)
    try {
      const {
        data: { token: clientToken },
      } = await RTMTokenAxios.request({
        data: {
          appId,
          appCertificate,
          uid: userName,
          role: 2,
          privilegeExpiredTs: getTokenExpireTime(),
        },
      })
      await client.login({ uid: userName, token: clientToken })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    fetchRoomList(client)
    // setRtmClient(client)
  }

  async function updateUserAvatar(): Promise<void> {
    const avatarSrc: string = userAvatar
    await ApiAxios.post('/user/avatar', {
      userId: userName,
      avatar: avatarSrc,
    })
  }

  async function fetchRoomList(client: RtmClient): Promise<void> {
    try {
      const { data } = await AgoraAxios.get('/channels', {
        params: { page_no: 0, page_size: 100 },
      })
      const { channels = [], total_size } = data
      if (channels.length > 0) {
        const getChannelsAtributesPromises = channels.map(
          ({ channel_name }: { channel_name: string }) => {
            console.log(channel_name)
            return client?.getChannelAttributes(channel_name)
          }
        )
        let attrs = await Promise.all(getChannelsAtributesPromises)
        console.log(attrs[0])
        const attrsKeys = Object.keys(attrs[0])
        attrs = attrs.map((item) => {
          let result: { [key: string]: string } = {}
          attrsKeys.forEach((key) => {
            result[key] = item[key].value
          })
          return result
        })
        // const channelsWithAttributes=
        const roomList: IRoom[] = channels.map(
          ({
            channel_name,
            user_count,
          }: {
            channel_name: string
            user_count: number
          }) => ({
            roomName: channel_name,
            userCount: user_count,
          })
        )
        const merged = merge(
          keyBy(roomList, 'roomName'),
          keyBy(attrs, 'roomId')
        )
        const roomsWithAttributes = values(merged)
        console.log(roomsWithAttributes)
        await setRooms(roomsWithAttributes)
      }
      setTotalRoom(total_size)
    } catch (error) {
      console.error(error)
    }
  }
  function createRoom(e: any): void {
    e.preventDefault()
    const roomName = e.target[0].value
    if (!roomName) return
    addRole({ role: EClientRole.HOST, roomName })
    navigate('/stream')
    setRoomName(roomName)
    e.target[0].value = ''
  }

  return (
    <div>
      <h2>Room list</h2>
      <button
        className='bg-blue-400 rounded-md p-2'
        onClick={() => setShowCreateRoom((prevShow) => !prevShow)}
      >
        Create room
      </button>

      {showCreateRoom && (
        <form onSubmit={createRoom}>
          <label htmlFor='roomName'>Enter room name</label>
          <div className='bg-input rounded-lg py-2 px-4'>
            <input
              type='text'
              name='roomName'
              className='border-2 ml-2 py-1 px-3 text-black bg-transparent'
            />
          </div>
        </form>
      )}

      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className='px-[10%] flex flex-wrap'>
          {rooms.map(
            ({ roomName, userCount, hostAvatar, hostName, thumbnail }) => (
              <div key={roomName}>
                <RoomCard
                  key={roomName + hostName + '1'}
                  roomName={roomName}
                  userCount={userCount}
                  hostAvatar={hostAvatar}
                  hostName={hostName}
                  thumbnail={thumbnail}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default Rooms
