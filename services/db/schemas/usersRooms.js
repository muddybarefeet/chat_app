//Schema from the matches table
//-------------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('usersRooms', function (table) {
        table.increments('usersRooms_id')
            .primary();
        table.integer('roomId')
            .unique();
        table.integer('userId')
            .unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
