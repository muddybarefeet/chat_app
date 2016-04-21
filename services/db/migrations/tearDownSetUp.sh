cat dropTables.sql | psql -d chat_app
node migrate.js
cat populateTables.sql | psql -d chat_app
