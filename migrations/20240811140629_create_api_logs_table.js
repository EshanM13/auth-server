/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('api_logs', (table)=>{
    table.increments('id').primary();           
    table.string('method').notNullable();           
    table.string('url').notNullable();              
    table.integer('status_code').notNullable();     
    table.timestamp('request_time').defaultTo(knex.fn.now()); 
    table.string('message'); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('api_logs');
};
