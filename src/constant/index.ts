import { ClientConfig } from 'agora-rtc-sdk-ng'
import { RtmClient } from 'agora-rtm-sdk'

export const appId: string = process.env.REACT_APP_AGORA_APP_ID!
export const appCertificate: string =
  process.env.REACT_APP_AGORA_APP_CERTIFICATE!

export const videoConfig: ClientConfig = {
  mode: 'live',
  codec: 'vp8',
}

export const API_ENDPOINT: string =
  // 'https://stric-api.netlify.app/.netlify/functions/api'
  // 'http://localhost:9000/.netlify/functions/api'
  // 'http://localhost:3002'
  'https://strix-api.herokuapp.com'
export const AGORA_ENDPOINT: string = 'https://api.agora.io/dev/v1/'
export const RTM_TOKEN_BUILDER_URL: string = `${API_ENDPOINT}/new-rtm-token`
export const RTC_TOKEN_BUILDER_URL: string = `${API_ENDPOINT}/new-rtc-token`

export const avatarPlaceholder: string = `https://news.artnet.com/app/news-upload/2022/01/TK-Bored-Ape.jpg`

export const scrollOption: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'end',
  inline: 'nearest',
}

export type RtmClientCustom = RtmClient & { avatar: string }

export interface IAvatar {
  id: number
  src: string
}

export interface IThumbnail extends IAvatar {}

const Color = {
  red: '#F94801',
  blue: '#1C91FF',
  pink: '#FF68B3',
  green: '#00b900',
  yellow: '#eded00',
  orange: '#ffa500',
}

export const colorList: string[] = [
  Color.red,
  Color.blue,
  Color.pink,
  Color.green,
  Color.yellow,
  Color.orange,
]

export const avatarList: IAvatar[] = [
  {
    id: 1,
    src: 'penguin',
  },
  {
    id: 2,
    src: 'elephant',
  },
  {
    id: 3,
    src: 'koala',
  },
  {
    id: 4,
    src: 'girl',
  },
  {
    id: 5,
    src: 'cat',
  },
  {
    id: 6,
    src: 'monk',
  },
  {
    id: 7,
    src: 'deer',
  },
  {
    id: 8,
    src: 'monkey',
  },
  {
    id: 9,
    src: 'doddle',
  },
  {
    id: 10,
    src: 'punk',
  },
]

export const thumbnailList: IThumbnail[] = [
  {
    id: 1,
    src: 'fifa',
  },
  {
    id: 2,
    src: 'forza',
  },
  {
    id: 3,
    src: 'gta',
  },
  {
    id: 4,
    src: 'lol',
  },
  {
    id: 5,
    src: 'minecraft',
  },
  {
    id: 6,
    src: 'pubg',
  },
  {
    id: 7,
    src: 'valorant',
  },
]

export const buttonStyle: string = `w-full bg-purple-custom text-white font-medium py-2 cursor-pointer text-base
rounded-md transition-[background] duration-150 ease-in hover:bg-purple-600 focus:outline-none`
export const mainHeight: string = 'calc(100%-72px)'
