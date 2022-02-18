import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react'
import { ClientConfig } from 'agora-rtc-sdk-ng'

export const appId: string = '15dabfd2f2b146bc989a16a0e19610db'
export const appCertificate: string = '6abdd68fa8ec4fb1a4158a7f2f59f079'
// export const token: string =
//   // '00615dabfd2f2b146bc989a16a0e19610dbIAB6CvF4mivzEaWh9Tv4uz4uEQTBH2eHSdnPtotjrknedOLcsooAAAAAEADzxwcSOO0QYgEAAQA47RBi'
//   `00615dabfd2f2b146bc989a16a0e19610dbIADP8xKbkSdG3F5uyAAiImC2LTtv4DBr5NaZz3Uz4bIH2eLcsorSY0iIIgDr96S+ygQRYgQAAQCmvA9iAgCmvA9iAwCmvA9iBACmvA9i`
const config: ClientConfig = {
  mode: 'rtc',
  // mode: 'live',
  codec: 'vp8',
}

// const screenConfig = {
//   encoderConfig: '1080p_1' as const,
//   optimizationMode: 'detail' as const,
//   // extensionId,
// }
export const useClient = createClient(config)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()

export const TOKEN_ENDPOINT: string = 'http://localhost:3002'
export const RTM_TOKEN_BUILDER_URL: string = `${TOKEN_ENDPOINT}/new-rtm-token`
export const RTC_TOKEN_BUILDER_URL: string = `${TOKEN_ENDPOINT}/new-rtc-token`
