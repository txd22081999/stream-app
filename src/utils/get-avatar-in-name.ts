export function getAvatarFromMember(name: string): string {
  return name.split('_avatar_')[1]
}
