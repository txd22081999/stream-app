import AgoraRTM, { RtmClient } from 'agora-rtm-sdk'
import Loading from 'components/Loading'
import RoomCard from 'components/RoomCard'
import { AgoraAxios, ApiAxios, RTMTokenAxios } from 'config/axios-config'
import {
  appCertificate,
  appId,
  buttonStyle,
  colorList,
  mainHeight,
} from 'constant'
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
import { CgScreenMirror } from 'react-icons/cg'
import cx from 'classnames'

const dumbRooms: IRoom[] = [
  {
    hostAvatar: 'cat',
    roomName: 'test',
    hostName: 'Dr Disrespect',
    roomId: '1',
    thumbnail: 'valorant',
    userCount: 20,
    roles: [],
  },
  {
    hostAvatar: 'cat',
    roomName: 'test',
    hostName: 'Dr Disrespect',
    roomId: '1',
    thumbnail: 'valorant',
    userCount: 20,
    roles: [],
  },
  {
    hostAvatar: 'cat',
    roomName: 'test',
    hostName: 'Dr Disrespect',
    roomId: '1',
    thumbnail: 'valorant',
    userCount: 20,
    roles: [],
  },
  {
    hostAvatar: 'cat',
    roomName: 'test',
    hostName: 'Dr Disrespect',
    roomId: '1',
    thumbnail: 'valorant',
    userCount: 20,
    roles: [],
  },
  {
    hostAvatar: 'cat',
    roomName: 'test',
    hostName: 'Dr Disrespect',
    roomId: '1',
    thumbnail: 'valorant',
    userCount: 20,
    roles: [],
  },
]

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
            return client?.getChannelAttributes(channel_name)
          }
        )
        let attrs = await Promise.all(getChannelsAtributesPromises)
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
        await setRooms(roomsWithAttributes)
      }
      setTotalRoom(total_size)
    } catch (error) {
      console.error(error)
    }
  }
  function createRoom(e: any): void {
    e.preventDefault()
    const roomName = e.target[0].value.trim()
    if (!roomName) return
    addRole({ role: EClientRole.HOST, roomName })
    navigate('/stream')
    setRoomName(roomName)
    e.target[0].value = ''
  }

  return (
    <div className={cx('mx-[10%] my-[4vh]', `overflow-x-hidden`)}>
      <div className='flex mb-8 items-center'>
        {!showCreateRoom && (
          <button
            className={cx(buttonStyle, 'w-fit px-3 mr-10')}
            onClick={() => setShowCreateRoom((prevShow) => !prevShow)}
          >
            New Room
          </button>
        )}

        {showCreateRoom && (
          <form onSubmit={createRoom} className='flex items-center'>
            <label htmlFor='roomName' className='w-fit block mr-3'>
              Room name
            </label>

            <div className='bg-input rounded-lg py-1 px-2'>
              <input
                type='text'
                name='roomName'
                placeholder='Enter room name'
                className='border-none text-white bg-transparent placeholder:text-gray-500
                outline-none focus:outline-none focus-within:outline-none w-[200px]'
              />
            </div>

            <input
              type='submit'
              className={cx(buttonStyle, 'w-fit px-3 ml-6')}
              value='Create'
            />
          </form>
        )}
      </div>

      <div className='flex items-center mb-4'>
        <CgScreenMirror className='text-[32px]' />
        <h2 className='text-[24px] ml-1 font-medium'>Live rooms</h2>
      </div>

      {loading ? (
        <Loading loading={loading} />
      ) : rooms.length === 0 ? (
        <p className='text-sm'>
          There are currently no rooms available. Create new one!
        </p>
      ) : (
        <div className='hello flex flex-wrap gap-x-6 gap-y-4 w-full overflow-x-hidden'>
          {/* {dumbRooms.map( */}
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
