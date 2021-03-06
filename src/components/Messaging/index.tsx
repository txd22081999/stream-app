import AgoraRTM, { RtmChannel, RtmClient, RtmTextMessage } from 'agora-rtm-sdk'
import cx from 'classnames'
import { ApiAxios, RTMTokenAxios } from 'config/axios-config'
import { appCertificate, appId, scrollOption, thumbnailList } from 'constant'
import { EClientRole } from 'enum'
import React, {
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useRoomStore, useUserStore } from 'store'
import { IClientRoleState, IMember } from 'store/room-store'
import { randomInList } from 'utils/random-of-list'
import { getTokenExpireTime } from 'utils/token-expire-time'
import TextareaAutosize from 'react-textarea-autosize'

let client: RtmClient | null = null
let channel: RtmChannel | null = null

interface IMessage {
  id: number
  sender: string
  content: string
  color: string
  avatar: string
}

const Messaging = () => {
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const [inputMessage, setInputMessage] = useState<string>('')
  const [messages, setMessages] = useState<IMessage[]>([])
  // const [members, setMembers] = useState<string[]>([])
  const { roomName, setAudiences, roles } = useRoomStore()
  const { userName } = useUserStore()
  const inputRef = useRef(null)
  const newMessageRef = useRef<null | HTMLParagraphElement>(null)
  const { userColor, userAvatar } = useUserStore()

  const roleInRoom: IClientRoleState | undefined = roles.find(
    (item) => item.roomName === roomName
  )
  const isHost: boolean = roleInRoom?.role === EClientRole.HOST

  useEffect(() => {
    initiate()

    window.addEventListener('beforeunload', () => {
      cleanup()
    })

    return () => {
      cleanup()
    }
  }, [])

  async function initiate() {
    client = await AgoraRTM.createInstance(appId)

    if (!client) {
      console.log('Empty client')
      return
    }

    client.on('ConnectionStateChanged', (newState) => {
      console.log(newState)
    })

    await loginChat()

    const channelId = roomName

    if (isHost) {
      const thumbnail: string = randomInList(thumbnailList).src
      await client.setChannelAttributes(channelId, {
        thumbnail,
        hostName: userName,
        roomId: channelId,
        hostAvatar: userAvatar,
      })
    }
    channel = await client.createChannel(channelId)

    channel.on('MemberJoined', async (memberId) => {
      console.log('Member join:', memberId)
      await getChannelMembers()
    })

    channel.on('MemberLeft', async (memberId) => {
      console.log('Member left:', memberId)
      await getChannelMembers()
    })

    channel.on('MemberCountUpdated', (memberCount) => {
      console.log('Member count:', memberCount)
    })

    channel.on(
      'ChannelMessage',
      // @ts-ignore
      // ({ content, avatar, color }, memberId, messagePros) => {
      (message, memberId, messagePros) => {
        console.log(message)

        const { content, avatar, color }: any = JSON.parse(
          (message as RtmTextMessage).text
        )

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: messagePros.serverReceivedTs,
            sender: memberId,
            // content: (message as RtmTextMessage).text,
            content,
            color,
            avatar,
          },
        ])
      }
    )

    await channel.join()
    await getChannelMembers()
  }

  async function getChannelMembers() {
    const channelMembers = await channel?.getMembers()

    if (!channelMembers) {
      return
    }
    const {
      data: channelMembersWithAvatar,
    }: { data: { userId: string; avatar: string }[] } = await ApiAxios.get(
      '/user/avatar',
      {
        params: {
          userIds: JSON.stringify(channelMembers),
        },
      }
    )

    const audiences: IMember[] = channelMembersWithAvatar.map(
      ({ userId, avatar }) => ({ id: userId, avatar })
    )
    if (channelMembers) {
      // setMembers(channelMembers)
      setAudiences(audiences)
    }
  }

  async function loginChat() {
    if (!client) {
      console.log('client is not available')
      return
    }

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

      // setRtmClient(client)
      setIsJoined(true)
    } catch (error) {
      console.log(error)
    }
    // await leaveChannel()
    // setIsJoined(false)
  }

  async function logoutChat() {
    if (!client) {
      console.log('client is not available')
      return
    }
    // await leaveChannel()
    await client.logout()
    setIsJoined(false)
  }

  async function leaveChannel() {
    if (!channel) {
      console.log('Channel is not available')
      return
    }
    await channel.leave()
  }

  async function sendMessage(msg: string) {
    if (!channel) {
      console.log('Channel is not available')
      return
    }
    await channel.sendMessage({
      text: JSON.stringify({
        content: msg,
        avatar: userAvatar,
        color: userColor,
      }),
      messageType: 'TEXT',
    })
  }

  useEffect(() => {
    newMessageRef.current?.scrollIntoView(scrollOption)
  }, [messages])

  function onInputChange(e: any) {
    setInputMessage(e.target.value)
  }

  async function onInputPress(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      const newMessage: string = e.target.value.trim()

      if (!newMessage) return
      await sendMessage(newMessage)
      setInputMessage('')
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          sender: userName,
          content: newMessage,
          color: userColor,
          avatar: userAvatar,
        },
      ])
    }
  }

  async function cleanup() {
    // await leaveChannel()
    await logoutChat()
  }

  function textAreaAdjust() {
    if (!inputRef.current) return
    const element = inputRef.current as any
    // console.log(element.scrollHeight)
    // console.log(element.style.height)
    // ;(inputRef.current as any).style.height = '20px'
    // if(scrollHeight >)
    // element.style.height = `${25 + element.scrollHeight}px`
    // element.style.height = "1px";
    // element.style.height = (25+element.scrollHeight)+"px";
  }

  return (
    <div className='overflow-hidden flex flex-col w-full py-2 h-full bg-black-main pb-5'>
      {isJoined ? (
        <>
          <div
            className='message-list mt-1 mx-2 flex-1 overflow-x-hidden overflow-y-scroll mb-2
            scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin 
            scrollbar-thumb-rounded-md h-[42px]'
          >
            {messages.map(({ id, sender, content, color, avatar }, index) => (
              <p
                key={id}
                className='mb-[6px] text-sm'
                ref={index === messages.length - 1 ? newMessageRef : null}
                // ref={newMessageRef}
              >
                <span className={cx('font-semibold')} style={{ color }}>
                  {sender}
                </span>
                <span className='mr-[6px] ml-[1px]'>:</span>
                <span className='break-words'>{content}</span>
              </p>
            ))}
          </div>

          <div className='bg-input rounded-lg mx-2'>
            {/* <textarea
              ref={inputRef}
              placeholder='Send a message'
              onChange={onInputChange}
              onKeyDown={onInputPress}
              onKeyUp={textAreaAdjust}
              value={inputMessage}
              className='text-sm w-full bg-transparent min-h-[10px] outline-none py-3 px-4 placeholder:text-gray-300  
              resize-none leading-[1.3] scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin 
              scrollbar-thumb-rounded-md'
            /> */}
            <input
              ref={inputRef}
              placeholder='Send a message'
              onChange={onInputChange}
              onKeyDown={onInputPress}
              value={inputMessage}
              className='text-sm w-full bg-transparent min-h-[10px] outline-none py-3 px-4 placeholder:text-gray-300  
              resize-none leading-[1.3] scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin 
              scrollbar-thumb-rounded-md'
            />
            {/* <TextareaAutosize
              ref={inputRef}
              autoFocus
              placeholder='Send a message'
              className='text-sm w-full bg-transparent min-h-[10px] outline-none py-3 px-4 placeholder:text-gray-300  
              resize-none leading-[1.3] scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin 
              scrollbar-thumb-rounded-md'
              onKeyDown={onInputPress}
              onChange={onInputChange}
              onKeyUp={textAreaAdjust}
              value={inputMessage}
              minRows={1}
              maxRows={4}
            /> */}
          </div>

          {/* <button onClick={cleanup}>Leave Chat</button> */}
        </>
      ) : (
        //  {/* <button
        //    onClick={loginChat}
        //    className='bg-green-300 px-4 py-1 rounded-lg'
        //  >
        //    Join Chat
        //  </button> */}
        <div className='h-full w-full'>
          <p className='text-sm'>Joining chat...</p>
        </div>
      )}
    </div>
  )
}

export default Messaging
