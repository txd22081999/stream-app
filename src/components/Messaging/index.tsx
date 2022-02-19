import AgoraRTM, { RtmChannel, RtmClient, RtmTextMessage } from 'agora-rtm-sdk'
import React, { useEffect, useState } from 'react'
import { GoPrimitiveDot } from 'react-icons/go'
import { appCertificate, appId } from 'constant'
import { RTMTokenAxios } from 'config/axios-config'
import { useRoomStore, useUserStore } from 'store'
import { getTokenExpireTime } from 'utils/token-expire-time'
import { useRef } from 'react'

let client: RtmClient | null = null
let channel: RtmChannel | null = null

interface IMessage {
  id: number
  sender: string
  content: string
}

const Messaging = () => {
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const [inputMessage, setInputMessage] = useState<string>('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const [members, setMembers] = useState<string[]>([])
  const { setAudiences } = useRoomStore()
  const { userName } = useUserStore()
  const inputRef = useRef(null)

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
    console.log(client)

    // client.on('MessageFromPeer', (message, peerId, messageProps) => {
    //   console.log(message)
    //   console.log(peerId)
    //   console.log(messageProps)
    // })

    if (!client) {
      console.log('Empty client')
      return
    }

    client.on('ConnectionStateChanged', (newState) => {
      console.log(newState)
    })

    await loginChat()

    const channelId = 'chat1'
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

    console.log(channel)
    channel.on('ChannelMessage', (message, memberId, messagePros) => {
      console.log(message)
      console.log(memberId)
      console.log(messagePros)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messagePros.serverReceivedTs,
          sender: memberId,
          content: (message as RtmTextMessage).text,
        },
      ])
    })

    await channel.join()
    await getChannelMembers()
  }

  async function getChannelMembers() {
    const channelMembers = await channel?.getMembers()
    if (channelMembers) {
      setMembers(channelMembers)
      setAudiences(channelMembers)
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
      console.log('token', clientToken)

      await client.login({ uid: userName, token: clientToken })
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

  async function joinChannel() {
    if (!channel) {
      console.log('Channel is not available')
      return
    }
    await channel.join()
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
    await channel.sendMessage({ text: msg })
    console.log('sent', msg)
  }

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
        { id: Date.now(), sender: userName, content: inputMessage },
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
    console.log(element.scrollHeight)
    console.log(element.style.height)
    // ;(inputRef.current as any).style.height = '20px'
    // if(scrollHeight >)
    // element.style.height = `${25 + element.scrollHeight}px`
    // element.style.height = "1px";
    // element.style.height = (25+element.scrollHeight)+"px";
  }

  return (
    <div className='overflow-hidden flex flex-col mt-5 h-full w-full py-2'>
      {isJoined ? (
        <>
          <div className='message-list mt-1 flex-1'>
            {messages.map(({ id, sender, content }) => (
              <p key={id} className='mb-[6px] text-sm'>
                <span className='font-semibold text-green-300'>{sender}</span>
                <span className='mr-[6px] ml-[1px]'>:</span>
                <span>{content}</span>
              </p>
            ))}
          </div>

          <div className='bg-input rounded-lg py-3 px-4'>
            <textarea
              ref={inputRef}
              placeholder='Send a message'
              onChange={onInputChange}
              onKeyDown={onInputPress}
              onKeyUp={textAreaAdjust}
              value={inputMessage}
              className='text-sm w-full bg-transparent min-h-[10px] outline-none scrollbar placeholder:text-gray-300 resize-none scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thin scrollbar-thumb-rounded-md'
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
