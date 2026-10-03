import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kb_ingest_state'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('folder_path', 512).nullable().index()
      table.text('tags_json').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('folder_path')
      table.dropColumn('tags_json')
    })
  }
}
