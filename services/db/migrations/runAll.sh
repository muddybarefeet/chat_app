cat dropTables.sql | psql -d chat_app
node setUpTables.js
node populateTables.js