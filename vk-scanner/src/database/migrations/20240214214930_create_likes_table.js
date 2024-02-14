export async function up(knex) {
    return knex.schema.createTable('likes', function(table) {
      table.increments('id').primary();
      table.string('user_id');
      table.string('post_id');
      table.timestamp('created_at');

      table.index('id');
      table.index('user_id');
      table.index('post_id');
      table.index('created_at');
    });
  };
  
export async function down(knex) {
  return knex.schema.dropTable('likes');
};
  