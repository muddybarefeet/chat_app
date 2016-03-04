//Schema from the users table
//-------------------------------------
module.exports = function (knex) { //table with name email and password
    return knex.schema.createTableIfNotExists('users', function (table) {
        table.increments('u_id')
            .primary();
        table.string('username')
            .unique();
        table.string('email')
            .unique();
        table.string('password')
            .unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};