//Schema from the matches table
//-------------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('messages', function (table) {
        table.increments('messages_id')
            .primary();
        table.integer('senderId')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.integer('recieverId')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.string('message')
            .notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
