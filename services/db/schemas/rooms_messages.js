//Schema from the matches table
//-------------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('rooms_messages', function (table) {
        table.increments('rm_id')
            .primary();
        table.integer('room_id')
            .references('r_id')
            .inTable('rooms')
            .notNullable();
        table.integer('user_id')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.boolean('creator');
        table.string('message');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
