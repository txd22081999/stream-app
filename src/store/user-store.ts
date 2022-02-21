import create, { GetState, SetState } from 'zustand'
import { persist } from 'zustand/middleware'

interface IUserState {
  userName: string
  setUserName: (name: string) => void
  rtmToken: string
  setRtmToken: (token: string) => void
  rtcToken: string
  setRtcToken: (token: string) => void
  uid: number
  setUid: (uid: number) => void
  userColor: string
  setUserColor: (color: string) => void
}

const useUserStore = create(
  persist(
    (set: SetState<IUserState>, get: GetState<IUserState>) => ({
      userName: '',
      setUserName: (name: string) => set(() => ({ userName: name })),

      rtmToken: '',
      setRtmToken: (token: string) => set(() => ({ rtcToken: token })),

      rtcToken: '',
      setRtcToken: (token: string) => set(() => ({ rtcToken: token })),

      uid: 0,
      setUid: (uid: number) => set(() => ({ uid })),

      userColor: '',
      setUserColor: (color: string) => set(() => ({ userColor: color })),
    }),
    {
      name: 'user-storage',
      getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
    }
  )
)

export default useUserStore
