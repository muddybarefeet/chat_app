//Schema from the matches table
//-------------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('friends', function (table) {
        table.increments('f_id')
            .primary();
        table.integer('friendor')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.integer('friendee')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
