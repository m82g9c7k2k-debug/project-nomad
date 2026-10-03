import assert from 'node:assert/strict'
import test from 'node:test'
import {
  normalizeFolderPath,
  normalizeTagsInput,
  parseStoredTags,
} from '../../app/utils/kb_metadata.js'

test('folder paths normalize separators and whitespace', () => {
  assert.equal(
    normalizeFolderPath(' /Vivienda\\ Solar / GoodWe/ '),
    'Vivienda/Solar/GoodWe'
  )
})

test('folder paths reject traversal segments', () => {
  assert.throws(() => normalizeFolderPath('Vivienda/../secret'), /dot segments/)
})

test('tags trim and deduplicate case-insensitively', () => {
  assert.deepEqual(
    normalizeTagsInput([' manual ', 'GoodWe', 'MANUAL', 'inversor']),
    ['manual', 'GoodWe', 'inversor']
  )
})

test('tags accept JSON strings from multipart form fields', () => {
  assert.deepEqual(
    normalizeTagsInput('["manual","solar"]'),
    ['manual', 'solar']
  )
})

test('stored malformed tag JSON degrades to an empty list', () => {
  assert.deepEqual(parseStoredTags('{broken'), [])
})
