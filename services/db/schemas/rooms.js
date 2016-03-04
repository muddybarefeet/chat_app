//Schema from the matches table
//-------------------------------------
module.exports = function (knex) {
    return knex.schema.createTableIfNotExists('rooms', function (table) {
        table.increments('r_id')
            .primary();
        table.string('name')
            .unique();
        table.enu('type', ['public', 'private'])
            .notNullable();
        table.boolean('creator');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
