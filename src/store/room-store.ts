import { EClientRole } from 'enum'
import { isEqual, unionWith } from 'lodash'
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

interface IRoomState {
  roomName: string
  setRoomName: (name: string) => void

  rooms: IRoom[]
  setRooms: (rooms: IRoom[]) => void

  totalRooms: number
  setTotalRoom: (totalRooms: number) => void

  roles: IClientRoleState[]
  addRole: (newRole: IClientRoleState) => void
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
        // set(() => ({ roles: [...get().roles, newRole] })),
        set(() => {
          // const roleList = { roles: [...get().roles, newRole] }
          // const roleList = union(get().roles, newRole) as any
          let roleList = [...get().roles, newRole]
          roleList = unionWith(roleList, isEqual)
          console.log('here', roleList)

          return { roles: roleList }
        }),
    }),
    {
      name: 'room-storage',
      getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
    }
  )
)

export default useRoomStore
