export function randomInList(list: any[]): any {
  const index: number = Math.floor(Math.random() * list.length)
  return list[index]
}
