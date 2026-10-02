import assert from 'node:assert/strict'
import test from 'node:test'
import { searchDocumentsSchema } from '../../app/validators/rag.js'

test('RAG search accepts bounded retrieval options', async () => {
  const result = await searchDocumentsSchema.validate({
    query: 'battery CAN communication',
    limit: 8,
    scoreThreshold: 0.35,
    collection: 'solar',
    minFinalScore: 0.6,
  })

  assert.equal(result.query, 'battery CAN communication')
  assert.equal(result.limit, 8)
  assert.equal(result.collection, 'solar')
})

test('RAG search rejects an empty query', async () => {
  await assert.rejects(() => searchDocumentsSchema.validate({ query: '' }))
})

test('RAG search rejects limits outside the public API bounds', async () => {
  await assert.rejects(() => searchDocumentsSchema.validate({ query: 'test', limit: 0 }))
  await assert.rejects(() => searchDocumentsSchema.validate({ query: 'test', limit: 21 }))
})
