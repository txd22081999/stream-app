export function getAvatarPath(fileName: string): string {
  return `${process.env.PUBLIC_URL}/assets/avatar/${fileName}`
}
