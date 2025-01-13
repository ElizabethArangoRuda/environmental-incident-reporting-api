// Import dotenv to process environment variables from `.env` file.
import "dotenv/config";

console.log(process.env.DB_HOST);  
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

export default {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: "utf8",
  },
};