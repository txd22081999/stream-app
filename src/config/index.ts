import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react'
import { ClientConfig } from 'agora-rtc-sdk-ng'

export const appId: string = '15dabfd2f2b146bc989a16a0e19610db'
export const token: string | null =
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
