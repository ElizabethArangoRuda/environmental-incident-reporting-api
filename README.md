To run the server:
npm install
npm i knex mysql2 axios express dotenv cors multer
once all modules are installed, and the database is setup
run :
node --watch server.js

To run the database:
run the following command in either the command line of the db or in the workbench:

    CREATE DATABASE reports
    DEFAULT CHARACTER SET = 'utf8mb4';

    Once the db is setup run the following code inside the node terminal in the project
    npx knex migrate:latest
    npx knex seed:run
