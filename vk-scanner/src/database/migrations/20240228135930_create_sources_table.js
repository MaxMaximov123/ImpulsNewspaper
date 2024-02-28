export async function up(knex) {
    return knex.schema.createTable('sources', function(table) {
      table.increments('id').primary();
      table.string('key');
      table.string('logo_src');

      table.index('id');
      table.index('key');
      table.index('logo_src');

      table.unique(['key']);
    });
  };
  
export async function down(knex) {
  return knex.schema.dropTable('sources');
};
  