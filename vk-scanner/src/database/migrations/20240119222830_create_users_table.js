export async function up(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('local_id');
      table.string('client_id');
      table.string('key');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('avatar_id');
      table.string('phone_number');
      table.string('source_key');
      table.timestamp('created_at');

      table.index('id');
      table.index('local_id');
      table.index('client_id');
      table.index('key');
      table.index('first_name');
      table.index('last_name');
      table.index('email');
      table.index('avatar_id');
      table.index('phone_number');
      table.index('source_key');
      table.index('created_at');

      table.unique(['client_id', 'source_key']);
    });
  };
  
export async function down(knex) {
  return knex.schema.dropTable('users');
};
  