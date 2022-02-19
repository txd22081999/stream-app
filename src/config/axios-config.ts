import axios from 'axios'
import {
  API_ENDPOINT,
  RTC_TOKEN_BUILDER_URL,
  RTM_TOKEN_BUILDER_URL,
} from '../constant'

const RTCTokenAxios = axios.create({
  baseURL: RTC_TOKEN_BUILDER_URL,
  method: 'POST',
})
const RTMTokenAxios = axios.create({
  baseURL: RTM_TOKEN_BUILDER_URL,
  method: 'POST',
})
const AgoraAxios = axios.create({
  // baseURL: AGORA_ENDPOINT,
  baseURL: API_ENDPOINT,
  auth: {
    username: process.env.REACT_APP_AGORA_CLIENT_ID!,
    password: process.env.REACT_APP_AGORA_CLIENT_PASSWORD!,
  },
})

export { RTCTokenAxios, RTMTokenAxios, AgoraAxios }
