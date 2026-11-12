import { File } from 'node:buffer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { importDataFromFile, loadData, saveData } from '../../src/utils/storage'

const key = 'yt-video-selector-data'
const collection = {
  pages: [{
    id: 'page',
    title: 'My videos',
    videos: [{ id: 'video', title: 'A video', youtubeId: 'dQw4w9WgXcQ' }],
  }],
}

function backup(contents: string) {
  return new File([contents], 'collection.json')
}

describe('local storage', () => {
  let storage: Map<string, string>

  beforeEach(() => {
    storage = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (name: string) => storage.get(name) ?? null,
      setItem: (name: string, value: string) => storage.set(name, value),
    })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('round trips a collection under the existing storage key', () => {
    saveData(collection)
    expect(storage.get(key)).toBe(JSON.stringify(collection))
    expect(loadData()).toEqual(collection)
  })

  it('recovers from malformed stored data', () => {
    storage.set(key, '{"pages":[null]}')
    expect(loadData()).toBeNull()
  })
})

describe('collection import', () => {
  it('loads an older backup without settings', async () => {
    await expect(importDataFromFile(backup(JSON.stringify(collection)))).resolves.toEqual(collection)
  })

  it('keeps partial settings from older backups', async () => {
    const legacy = { ...collection, settings: { theme: 'light' } }
    await expect(importDataFromFile(backup(JSON.stringify(legacy)))).resolves.toEqual(legacy)
  })

  it.each(['null', '{"pages":{}}', '{"pages":[{"id":"page","title":"Videos","videos":[null]}]}'])(
    'rejects invalid collections such as %s',
    async (json) => {
      await expect(importDataFromFile(backup(json))).rejects.toThrow('Invalid file format')
    },
  )

  it('reports malformed JSON', async () => {
    await expect(importDataFromFile(backup('{'))).rejects.toThrow('Could not parse JSON file')
  })
})
