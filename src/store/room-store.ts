import { RtmClientCustom } from 'constant'
import { EClientRole } from 'enum'
import isEqual from 'lodash/isEqual'
import unionWith from 'lodash/unionWith'
import create, { GetState, SetState } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IRoom {
  roomName: string
  userCount: number
  roles: IClientRoleState[]
}

export interface IClientRoleState {
  roomName: string
  role: EClientRole
}

export interface IMember {
  id: string
  avatar: string
}

interface IRoomState {
  roomName: string
  setRoomName: (name: string) => void

  rooms: IRoom[]
  setRooms: (rooms: IRoom[]) => void

  totalRooms: number
  setTotalRoom: (totalRooms: number) => void

  roles: IClientRoleState[]
  addRole: (newRole: IClientRoleState) => void

  audiences: IMember[]
  setAudiences: (audiences: IMember[]) => void

  rtmClient: RtmClientCustom | null
  setRtmClient: (client: RtmClientCustom | null) => void
}

const useRoomStore = create(
  persist(
    (set: SetState<IRoomState>, get: GetState<IRoomState>) => ({
      roomName: '',
      setRoomName: (name: string) => set(() => ({ roomName: name })),

      rooms: [] as IRoom[],
      setRooms: (rooms: IRoom[]) => set(() => ({ rooms })),

      totalRooms: 0,
      setTotalRoom: (totalRooms: number) => set(() => ({ totalRooms })),

      roles: [] as IClientRoleState[],
      addRole: (newRole: IClientRoleState) =>
        set(() => {
          let roleList = [...get().roles, newRole]
          roleList = unionWith(roleList, isEqual)
          return { roles: roleList }
        }),

      audiences: [] as IMember[],
      setAudiences: (audiences: IMember[]) => set(() => ({ audiences })),

      rtmClient: null as RtmClientCustom | null,
      setRtmClient: (client: RtmClientCustom | null) =>
        set(() => ({ rtmClient: client })),
    }),
    {
      name: 'room-storage',
      getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
    }
  )
)

export default useRoomStore
