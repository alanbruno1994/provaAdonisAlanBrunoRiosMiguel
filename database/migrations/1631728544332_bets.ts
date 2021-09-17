import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bets extends BaseSchema {
  protected tableName = 'bets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('secure_id').unique().notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('game_id').unsigned().references('id').inTable('games').notNullable()
      table.string('number_choose').notNullable()
      table.float('price_game').notNullable()

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
