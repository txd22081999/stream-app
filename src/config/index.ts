import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react'
import { ClientConfig } from 'agora-rtc-sdk-ng'

export const appId: string = process.env.REACT_APP_AGORA_APP_ID!
export const appCertificate: string =
  process.env.REACT_APP_AGORA_APP_CERTIFICATE!

// export const CLIENT_SECRET_ID: string = '38ca44f448c3463f84e22a0883eb5281'
// export const CLIENT_SECRET_PASSWORD: string = '31bcf7a8dc5b43ecbae715113db17c47'

const config: ClientConfig = {
  // mode: 'rtc',
  mode: 'live',
  codec: 'vp8',
}

export const useClient = createClient(config)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()

export const TOKEN_ENDPOINT: string = 'http://localhost:3002'
export const AGORA_ENDPOINT: string = 'https://api.agora.io/dev/v1/'
export const CHANNEL_URL: string = `${AGORA_ENDPOINT}/channel/15dabfd2f2b146bc989a16a0e19610db?page_no=0&page_size=5`
export const RTM_TOKEN_BUILDER_URL: string = `${TOKEN_ENDPOINT}/new-rtm-token`
export const RTC_TOKEN_BUILDER_URL: string = `${TOKEN_ENDPOINT}/new-rtc-token`
