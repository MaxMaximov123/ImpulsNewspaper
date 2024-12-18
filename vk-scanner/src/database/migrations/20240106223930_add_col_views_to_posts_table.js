export async function up(knex) {
    return knex.schema.table('posts', function(table) {
      table.integer('views');
      table.index('views');
    });
  };
  
export async function down(knex) {
  return knex.schema.table("posts", function (table) {
    table.dropIndex('views');
    table.dropColumn("views");
  });
};
  