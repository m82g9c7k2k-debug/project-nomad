const MAX_FOLDER_LENGTH = 512
const MAX_FOLDER_SEGMENTS = 16
const MAX_TAGS = 20
const MAX_TAG_LENGTH = 40

export function normalizeFolderPath(input: unknown): string | null {
  if (input === null || input === undefined || input === '') return null
  if (typeof input !== 'string') throw new Error('folderPath must be a string')

  const normalized = input.replace(/\\/g, '/').trim()
  if (!normalized) return null
  if (normalized.length > MAX_FOLDER_LENGTH) throw new Error('folderPath is too long')

  const segments = normalized
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (segments.length === 0) return null
  if (segments.length > MAX_FOLDER_SEGMENTS) throw new Error('folderPath has too many levels')
  if (segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error('folderPath cannot contain dot segments')
  }
  if (segments.some((segment) => /[\x00-\x1F\x7F]/.test(segment))) {
    throw new Error('folderPath contains invalid characters')
  }

  return segments.join('/')
}

export function normalizeTagsInput(input: unknown): string[] {
  if (input === null || input === undefined || input === '') return []

  let values: unknown[]
  if (Array.isArray(input)) {
    values = input
  } else if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed) return []
    if (trimmed.startsWith('[')) {
      const parsed = JSON.parse(trimmed)
      if (!Array.isArray(parsed)) throw new Error('tags JSON must be an array')
      values = parsed
    } else {
      values = trimmed.split(',')
    }
  } else {
    throw new Error('tags must be an array or string')
  }

  if (values.length > MAX_TAGS) throw new Error('too many tags')

  const seen = new Set<string>()
  const tags: string[] = []
  for (const value of values) {
    if (typeof value !== 'string') throw new Error('every tag must be a string')
    const tag = value.trim()
    if (!tag) continue
    if (tag.length > MAX_TAG_LENGTH) throw new Error('tag is too long')
    if (/[\x00-\x1F\x7F]/.test(tag)) throw new Error('tag contains invalid characters')
    const key = tag.toLocaleLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      tags.push(tag)
    }
  }
  return tags
}

export function parseStoredTags(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    return normalizeTagsInput(JSON.parse(value))
  } catch {
    return []
  }
}
