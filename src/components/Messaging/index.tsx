import AgoraRTM, { RtmChannel, RtmClient, RtmTextMessage } from 'agora-rtm-sdk'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { appCertificate, appId, RTM_TOKEN_BUILDER_URL } from '../../config'
import { GoPrimitiveDot } from 'react-icons/go'
import { useStore } from '../../store'
import { getTokenExpireTime } from '../../utils/token-expire-time'

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
  // const uid: string = 'user' + Math.floor(Math.random() * 1000).toString()
  const [members, setMembers] = useState<string[]>([])
  const { userName } = useStore()
  //   const [channel, setChannel] = useState<

  console.log(userName)

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
      } = await axios.post(RTM_TOKEN_BUILDER_URL, {
        appId,
        appCertificate,
        uid: userName,
        role: 2,
        privilegeExpiredTs: getTokenExpireTime(),
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
    if (e.key === 'Enter') {
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

  return (
    <div>
      {isJoined ? (
        <>
          <div>
            <input
              type='text'
              placeholder='Type a message...'
              onChange={onInputChange}
              onKeyDown={onInputPress}
              value={inputMessage}
            />
            <button onClick={cleanup}>Leave Chat</button>
          </div>
          <div className='mt-5'>
            <div>Online</div>
            {members.map((member) => (
              <div key={member} className='flex items-center'>
                <GoPrimitiveDot className='text-green-400' />
                <p>{member}</p>
              </div>
            ))}
            <div className='message-list mt-5'>
              {messages.map(({ id, sender, content }) => (
                <p key={id} className='mb-2'>
                  <span className='font-semibold mr-2'>{sender}</span>{' '}
                  <span>{content}</span>
                </p>
              ))}
            </div>
          </div>
        </>
      ) : (
        <button onClick={loginChat}>Join Chat</button>
      )}
    </div>
  )
}

export default Messaging
