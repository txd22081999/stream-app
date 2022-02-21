import AgoraRTM, { RtmChannel, RtmClient, RtmTextMessage } from 'agora-rtm-sdk'
import React, { useEffect, useState } from 'react'
import { GoPrimitiveDot } from 'react-icons/go'
import {
  appCertificate,
  appId,
  avatarList,
  avatarPlaceholder,
  RtmClientCustom,
  scrollOption,
} from 'constant'
import { ApiAxios, RTMTokenAxios } from 'config/axios-config'
import { useRoomStore, useUserStore } from 'store'
import { getTokenExpireTime } from 'utils/token-expire-time'
import { useRef } from 'react'
import cx from 'classnames'
import { randomInList } from 'utils/random-of-list'
import { MethodSignature } from 'typescript'
import { log } from 'console'
import { IMember } from 'store/room-store'
import qs from 'querystring'

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
  const [members, setMembers] = useState<string[]>([])
  const { roomName, setAudiences, setRtmClient } = useRoomStore()
  const { userName } = useUserStore()
  const inputRef = useRef(null)
  const newMessageRef = useRef<null | HTMLParagraphElement>(null)
  const { userColor, userAvatar } = useUserStore()

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
          // userIds: channelMembers,
          // hello: 'asd',
        },
      }
    )
    console.log(channelMembersWithAvatar)

    const audiences: IMember[] = channelMembersWithAvatar.map(
      ({ userId, avatar }) => ({ id: userId, avatar })
    )
    if (channelMembers) {
      setMembers(channelMembers)
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

      // await client.setLocalUserAttributes({ avatar: avatarPlaceholder })
      // await client.setLocalUserAttributes({
      //   avatar: randomInList(avatarList).src!,
      // })

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
      // text: msg,
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
      const message: string = inputMessage.trim()

      if (!message) return
      await sendMessage(inputMessage)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          sender: userName,
          content: inputMessage,
          color: userColor,
          avatar: userAvatar,
        },
      ])
      setInputMessage('')
    }
  }

  async function cleanup() {
    await leaveChannel()
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
  // ;(async () => {
  //   console.log(userName)
  //   const a = await client?.getChannelAttributes(roomName)
  //   console.log(a)
  // })()
  // client?.getUserAttributes('d2').then((res) => console.log(res))

  console.log(client)

  return (
    <div className='overflow-hidden flex flex-col w-full py-2 h-full bg-black-main'>
      {isJoined ? (
        <>
          <div
            className='message-list mt-1 mx-2 flex-1 overflow-x-hidden overflow-y-scroll mb-2
            scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin 
            scrollbar-thumb-rounded-md'
          >
            {messages.map(({ id, sender, content, color, avatar }, index) => (
              <p
                key={id}
                className='mb-[6px] text-sm'
                ref={index === messages.length - 1 ? newMessageRef : null}
                // ref={newMessageRef}
              >
                {/* <span className={cx('font-semibold', `text-name-${userColor}`)}> */}
                {/* <span className={cx('font-semibold', `text-user-${color}`)}> */}
                <span className={cx('font-semibold')} style={{ color }}>
                  {/* <span className={cx('font-semibold', `text-name-${'blue'}`)}> */}
                  {sender}
                </span>
                <span className='mr-[6px] ml-[1px]'>:</span>
                <span>{content}</span>
              </p>
            ))}
          </div>

          <div className='bg-input rounded-lg mx-2 py-3 px-4'>
            <textarea
              ref={inputRef}
              placeholder='Send a message'
              onChange={onInputChange}
              onKeyDown={onInputPress}
              onKeyUp={textAreaAdjust}
              value={inputMessage}
              className='text-sm w-full bg-transparent min-h-[10px] outline-none placeholder:text-gray-300 
              resize-none scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin 
              scrollbar-thumb-rounded-md'
            />
          </div>

          <button onClick={cleanup}>Leave Chat</button>
        </>
      ) : (
        <button
          onClick={loginChat}
          className='bg-green-300 px-4 py-1 rounded-lg'
        >
          Join Chat
        </button>
      )}
    </div>
  )
}

export default Messaging
