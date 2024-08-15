const config = require('./config/config.json')
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2', 
    connection: {
      host: config.database.host, 
      user: config.database.user, 
      password: config.database.password, 
      database: config.database.databaseName
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
