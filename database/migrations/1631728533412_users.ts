import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('secure_id').unique().notNullable()
      table.string('name').notNullable()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table
        .integer('access_profile_id')
        .unsigned()
        .references('id')
        .inTable('access_profiles')
        .notNullable()
      table.string('token')
      table.timestamp('create_at_token', { useTz: true }).nullable()
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
