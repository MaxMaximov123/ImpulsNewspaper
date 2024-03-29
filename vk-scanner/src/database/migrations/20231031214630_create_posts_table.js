export async function up(knex) {
    return knex.schema.createTable('posts', function(table) {
      table.increments('id').primary();
      table.string('key');
      table.string('source_key');


      table.text('text');
      table.timestamp('created_at');

      table.index('id');
      table.index('key');
      table.index('created_at');
      table.index('source_key');
      // table.index('text');

      table.unique(['key', 'source_key']);
    });
  };
  
export async function down(knex) {
  return knex.schema.dropTable('posts');
};
  