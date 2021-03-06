//Schema from the matches table
//-------------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('users_rooms', function (table) {
        table.increments('usersRooms_id')
            .primary();
        table.integer('room_id')
            .references('r_id')
            .inTable('rooms')
            .notNullable();
        table.integer('user_id')
            .references('u_id')
            .inTable('users')
            .notNullable();
        table.boolean('accepted');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
