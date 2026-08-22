export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const trimmed = url.trim()

  // Plain ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }

  return null
}

export function getThumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
}

export function getEmbedUrl(youtubeId: string): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    fs: '1',
    playsinline: '0',
  })
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export async function fetchVideoTitle(youtubeId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`)
    if (!res.ok) return null
    const data = await res.json()
    return data.title ?? null
  } catch {
    return null
  }
}
