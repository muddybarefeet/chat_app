//Schema from the matches table
//-------------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('friends', function (table) {
        table.increments('f_id')
            .primary();
        table.integer('userSentId')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.integer('userToConfirmId')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.boolean('requestAccepted'); //have an accepted and reject to only be filled when the person asked answers
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
