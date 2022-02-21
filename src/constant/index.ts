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
  'https://stric-api.netlify.app/.netlify/functions/api'
// 'http://localhost:9000/.netlify/functions/api'
// 'http://localhost:3002'
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
    src: 'dog',
  },
  {
    id: 9,
    src: 'monkey',
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

// export const avatarList: IAvatar[] = [
//   {
//     id: 1,
//     src: 'https://external-preview.redd.it/QsbFEXU3kYHClCZpaX54zZu6DEvwA4VHpTHThT8P12A.jpg?width=640&crop=smart&auto=webp&s=c9f5cfd173849c57b48990863070a1e8ede4eef8',
//   },
//   {
//     id: 2,
//     src: 'https://arweave.net/aw4Audy2J_uuo3WIPQt-MopywNXrv4kIBiEVnd2wpyU',
//   },
//   {
//     id: 3,
//     src: 'https://miro.medium.com/max/980/1*3iesg_sr8kC6NYN2iiFHRQ.png',
//   },
//   {
//     id: 4,
//     src: 'http://www.playtoearn.online/wp-content/uploads/2021/10/Clone-X-NFT-avatar.png',
//   },
//   {
//     id: 5,
//     src: 'https://www.ultcube88.com/wp-content/uploads/2021/08/cat.jpg',
//   },
//   {
//     id: 6,
//     src: 'https://i.pinimg.com/474x/f5/e2/f0/f5e2f0ef7382530a23c194694d54a437.jpg',
//   },
//   {
//     id: 7,
//     src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzwfx03ZI7-yUieuEdBJ6VOlE5Y4f0-uobVvyHRS05yxdPJLiwsj_Mg17EoMzxhu3C2pE&usqp=CAU',
//   },
//   {
//     id: 8,
//     src: 'https://lh3.googleusercontent.com/Zm1-41EJs0evQCDm8QFpOGkweOZKrkBuE8B7sjrWCRqCmvAf8E69p5y2N3owqaiaRVyWWNe_MqCZ7HfZ04cgLjufVcnVaRRCIa0evw=w60',
//   },
//   {
//     id: 9,
//     src: 'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/43YAWLITTZJLZIQTCP2JSS4KSM.jpg',
//   },
//   {
//     id: 10,
//     src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu-l0MxzVVrzoYNu2O9WYlUCKjklSxFyFC1tiIOhwlKBjWBrDRdfSS8GqNxBBBJoxz0Vw&usqp=CAU',
//   },
// ]
