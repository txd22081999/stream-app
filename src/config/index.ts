import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react'
import { ClientConfig } from 'agora-rtc-sdk-ng'

export const appId: string = '15dabfd2f2b146bc989a16a0e19610db'
export const appCertificate: string = '6abdd68fa8ec4fb1a4158a7f2f59f079'
export const token: string =
  '00615dabfd2f2b146bc989a16a0e19610dbIAAct4BrE4ha6GiupP4F5W2HlCnQFscMfBGcOCtgJL4GEuLcsooAAAAAEADzxwcS1eYOYgEAAQDV5g5i'
export const channelName: string = 'test1'
const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
}

// const screenConfig = {
//   encoderConfig: '1080p_1' as const,
//   optimizationMode: 'detail' as const,
//   // extensionId,
// }
export const useClient = createClient(config)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()

export const TOKEN_BUILDER_URL: string = 'http://localhost:3002/new-token'

// export const chatToken: string =
//   '00615dabfd2f2b146bc989a16a0e19610dbIACafIWC4th5BAiV0h2w06HHxeqLKJmsRnGn3DREGz/YPeLcsooAAAAAEACoPse3Dq4PYgEA6AMOrg9i'
