export function getAvatarPath(fileName: string): string {
  return `${process.env.PUBLIC_URL}/assets/avatar/${fileName}.jpg`
}

export function getThumbnailPath(fileName: string): string {
  return `${process.env.PUBLIC_URL}/assets/thumbnail/${fileName}.jpg`
}

export function unzipRoomName(roomJSON: string): string {
  const { roomName } = JSON.parse(roomJSON)
  return roomName
}
