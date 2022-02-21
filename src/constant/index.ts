import { ClientConfig } from 'agora-rtc-sdk-ng'
import { RtmClient } from 'agora-rtm-sdk'

export const appId: string = process.env.REACT_APP_AGORA_APP_ID!
export const appCertificate: string =
  process.env.REACT_APP_AGORA_APP_CERTIFICATE!

export const videoConfig: ClientConfig = {
  // mode: 'rtc',
  mode: 'live',
  codec: 'vp8',
}

export const API_ENDPOINT: string = 'http://localhost:3002'
export const AGORA_ENDPOINT: string = 'https://api.agora.io/dev/v1/'
export const CHANNEL_URL: string = `${AGORA_ENDPOINT}/channel/15dabfd2f2b146bc989a16a0e19610db?page_no=0&page_size=5`
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

const Color = {
  red: '#F94801',
  blue: '#1C91FF',
  pink: '#FF68B3',
  green: '#027F02',
}

export const colorList: string[] = [
  Color.red,
  Color.blue,
  Color.pink,
  Color.green,
]

export const avatarList: IAvatar[] = [
  {
    id: 1,
    src: avatarPlaceholder,
  },
  {
    id: 2,
    src: 'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/43YAWLITTZJLZIQTCP2JSS4KSM.jpg',
  },
  {
    id: 3,
    src: 'https://miro.medium.com/max/980/1*3iesg_sr8kC6NYN2iiFHRQ.png',
  },
  {
    id: 4,
    src: 'http://www.playtoearn.online/wp-content/uploads/2021/10/Clone-X-NFT-avatar.png',
  },
  {
    id: 5,
    src: 'https://www.ultcube88.com/wp-content/uploads/2021/08/cat.jpg',
  },
  {
    id: 6,
    src: 'https://i.pinimg.com/474x/f5/e2/f0/f5e2f0ef7382530a23c194694d54a437.jpg',
  },
  {
    id: 7,
    src: 'https://www.fivesquid.com/pics/t2/1640983305-189522-3-1.png',
  },
  {
    id: 8,
    src: 'https://lh3.googleusercontent.com/Zm1-41EJs0evQCDm8QFpOGkweOZKrkBuE8B7sjrWCRqCmvAf8E69p5y2N3owqaiaRVyWWNe_MqCZ7HfZ04cgLjufVcnVaRRCIa0evw=w600',
  },
]
