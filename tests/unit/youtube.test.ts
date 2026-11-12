import { describe, expect, it } from 'vitest'
import { extractYouTubeId, getEmbedUrl } from '../../src/utils/youtube'

const id = 'dQw4w9WgXcQ'

describe('extractYouTubeId', () => {
  it.each([
    `  ${id}  `,
    `https://www.youtube.com/watch?v=${id}&t=15`,
    `https://www.youtube.com/watch?feature=share&v=${id}`,
    `https://youtu.be/${id}`,
    `https://www.youtube.com/shorts/${id}`,
    `https://www.youtube.com/embed/${id}`,
  ])('extracts the ID from %s', (input) => {
    expect(extractYouTubeId(input)).toBe(id)
  })

  it.each(['', 'not a link', 'https://youtu.be/short'])('rejects %j', (input) => {
    expect(extractYouTubeId(input)).toBeNull()
  })
})

it('uses the privacy-enhanced host for embeds', () => {
  const embed = new URL(getEmbedUrl(id))
  expect(embed.hostname).toBe('www.youtube-nocookie.com')
  expect(embed.pathname).toBe(`/embed/${id}`)
})
