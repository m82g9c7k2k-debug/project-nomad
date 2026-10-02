import vine from '@vinejs/vine'

export const getJobStatusSchema = vine.compile(
  vine.object({
    filePath: vine.string(),
  })
)

export const deleteFileSchema = vine.compile(
  vine.object({
    source: vine.string(),
  })
)

export const embedFileSchema = vine.compile(
  vine.object({
    source: vine.string().minLength(1),
    force: vine.boolean().optional(),
  })
)

export const fileSourceSchema = vine.compile(
  vine.object({
    source: vine.string().minLength(1),
  })
)

export const estimateBatchSchema = vine.compile(
  vine.object({
    files: vine
      .array(
        vine.object({
          filename: vine.string().minLength(1).maxLength(255),
          sizeBytes: vine.number().min(0),
        })
      )
      .minLength(1)
      .maxLength(500),
  })
)


export const searchDocumentsSchema = vine.compile(
  vine.object({
    query: vine.string().trim().minLength(1).maxLength(4000),
    limit: vine.number().min(1).max(20).optional(),
    scoreThreshold: vine.number().min(0).max(1).optional(),
    collection: vine.string().trim().maxLength(100).optional(),
    minFinalScore: vine.number().min(0).max(1).optional(),
  })
)
