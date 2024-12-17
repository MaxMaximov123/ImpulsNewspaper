export async function up(knex) {
    return knex.schema.createTable('sources', function(table) {
      table.increments('id').primary();
      table.string('key', 500);
    table.string('logo_src', 1000);

      table.index('id');
      table.index('key');
      table.index('logo_src');

      table.unique(['key']);
    });
  };
  
export async function down(knex) {
  return knex.schema.dropTable('sources');
};
  