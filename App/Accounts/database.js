const mysql = require('mysql2');
const snowflakeGenerator = require('./snowflakeGenerator');
const logger = require("../logger");
const ErrorMessage = require("../../ExpressJS-Models/Messages/errorMessage");
const Message = require("../../ExpressJS-Models/Messages/systemMessage");
const User = require("../../../ApiModels/Account/user");

//TODO: Move sesitive data elsewhere.
const dbhost = "127.0.0.1";
const dbuser = "root";
const dbpassword = "password";

var connection = mysql.createConnection({
  host: dbhost,
  port: 3306,
  user: dbuser,
  password: dbpassword,
  database: "accounts"
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

//create an ID system
module.exports.createUser = (username, passwordHash) => {
  let id = snowflakeGenerator.generate();

  return new Promise((resolve, reject) => {
    connection.execute('insert into users(id, username, `password`) values (?, ?, ?);', [id, username, passwordHash],
      function (err, results) {
        if (err) {
          if (err.errno == 1062) {
            return reject(new ErrorMessage("Username taken!", ErrorMessage.ErrorCodes.DUPLICATE_USERNAME, 403));
          }

          logger.logError(err);
          return reject(new ErrorMessage("Unknown Database Error!", ErrorMessage.ErrorCodes.DATABASE_ERROR, 500));
        }

        return resolve(new Message("User created successfully!"));
      });
  })
}

module.exports.getUser = (username) => {
  return new Promise((resolve, reject) => {
    connection.execute('SELECT `id`, `password` FROM users where username = ?;', [username],
      function (err, results) {
        let a = new User(results[0].id, username, results[0].password);
        resolve(a);
      })
  });
}