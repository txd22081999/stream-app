import { RTCTokenAxios } from 'config/axios-config'
import { appCertificate, appId } from 'constant'
import { EUserRole } from 'enum'
import { getTokenExpireTime } from './token-expire-time'

export async function generateRTCToken(roomName: string): Promise<string> {
  const {
    data: { token },
  } = await RTCTokenAxios.request({
    data: {
      appId,
      appCertificate,
      channelName: roomName,
      uid: 0,
      role: EUserRole.PUBLISHER,
      privilegeExpiredTs: getTokenExpireTime(),
    },
  })

  return token
}
