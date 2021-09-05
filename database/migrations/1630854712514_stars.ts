import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stars extends BaseSchema {
  protected tableName = 'stars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('repository_id').unsigned().references('repositories.id').onDelete('CASCADE')
      table.unique(['user_id', 'repository_id'])
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
