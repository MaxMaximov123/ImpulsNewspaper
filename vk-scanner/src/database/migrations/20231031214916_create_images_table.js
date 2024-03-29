export async function up(knex) {
    return knex.schema.createTable('images', function(table) {

      table.increments('id').primary();
      table.string('post_key');
      table.string('src_key');
      table.text('src');

      table.index('id');
      table.index('post_key');

      table.unique(['src']);
    });
  };
  
  export async function down(knex) {
    return knex.schema.dropTable('images');
};