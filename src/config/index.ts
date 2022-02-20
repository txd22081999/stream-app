import {
  createClient,
  createMicrophoneAndCameraTracks,
  createScreenVideoTrack,
} from 'agora-rtc-react'
import { ILocalVideoTrack } from 'agora-rtc-sdk-ng'
import { videoConfig } from 'constant'

export interface ICreateScreenVideoTrack {
  ready: boolean
  //   tracks: [ILocalVideoTrack, ILocalAudioTrack]
  tracks: ILocalVideoTrack
}

export const useClient = createClient(videoConfig)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()
export const useScreenTracks = createScreenVideoTrack(
  { encoderConfig: '720p' },
  'disable'
)

// const a = createStream({
//   streamID: 123,
//   screen: false,
//   audio: true,
//   video: true,
// })
