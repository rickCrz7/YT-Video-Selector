import { describe, expect, it } from 'vitest'
import type { VideoItem } from '../../src/types'
import { moveVideo } from '../../src/utils/collection'

const videos: VideoItem[] = ['first', 'second', 'third'].map((id) => ({
  id,
  title: id,
  youtubeId: 'dQw4w9WgXcQ',
}))

describe('moveVideo', () => {
  it.each([
    ['first', 'third', ['second', 'third', 'first']],
    ['third', 'first', ['third', 'first', 'second']],
    ['first', 'first', ['first', 'second', 'third']],
    ['missing', 'second', ['first', 'second', 'third']],
    ['first', 'missing', ['first', 'second', 'third']],
  ] as const)('moves %s to %s', (fromId, toId, expected) => {
    const reordered = [...videos]
    moveVideo(reordered, fromId, toId)
    expect(reordered.map((video) => video.id)).toEqual(expected)
  })
})
