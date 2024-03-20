import 'dotenv/config';
import type {Knex} from "knex";

// Update with your config settings.

const config: Knex.Config = {
  client: "postgresql",
  connection: {
    connectionString: process.env.CONTROL_DATABASE_URL,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations"
  }
};

module.exports = config;
