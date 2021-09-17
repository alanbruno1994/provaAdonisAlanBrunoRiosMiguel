import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccessProfiles extends BaseSchema {
  protected tableName = 'access_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('secure_id').unique().notNullable()
      table.string('level', 150).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
