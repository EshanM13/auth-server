/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('api_logs', function(table){
    table.string('body'),
    table.string('query')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('api_logs', function(table){
    table.dropColumn('body'),
    table.dropColumn('query')
  })
};
