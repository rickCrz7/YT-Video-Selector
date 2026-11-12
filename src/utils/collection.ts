import type { VideoItem } from '../types'

export function moveVideo(videos: VideoItem[], fromId: string, toId: string): void {
  const fromIndex = videos.findIndex((video) => video.id === fromId)
  const toIndex = videos.findIndex((video) => video.id === toId)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

  const [video] = videos.splice(fromIndex, 1)
  videos.splice(toIndex, 0, video)
}
