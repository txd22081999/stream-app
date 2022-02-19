import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react'
import { videoConfig } from 'constant'

export const useClient = createClient(videoConfig)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()
