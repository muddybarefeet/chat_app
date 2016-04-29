//Schema from the matches table
//-------------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('messages', function (table) {
        table.increments('messages_id')
            .primary();
        table.integer('sender_id')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.integer('reciever_id')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.text('message')
            .notNullable();
        table.boolean('has_been_read')
            .notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
