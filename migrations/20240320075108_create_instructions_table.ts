import type {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE instructions
    (
      id     text NOT NULL PRIMARY KEY,
      status text NOT NULL
    );
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TABLE instructions');
}

