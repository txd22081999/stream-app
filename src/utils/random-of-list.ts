export function randomInList<T>(list: T[]): T {
  const index: number = Math.floor(Math.random() * list.length)
  return list[index]
}
