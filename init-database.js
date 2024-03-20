require('dotenv').config()
const {Client} = require('pg');

(async () => {
  const connectionString = process.env.CONTROL_DATABASE_URL;
  if (!connectionString) {
    throw new Error('CONTROL_DATABASE_URL is not set');
  }

  const pgClient = new Client({
    connectionString: connectionString.replace('control', 'postgres'),
  });

  await pgClient.connect();
  await pgClient.query('DROP DATABASE IF EXISTS control');
  await pgClient.query('CREATE DATABASE control');
  await pgClient.end();

  console.log('Database created.');
})();
