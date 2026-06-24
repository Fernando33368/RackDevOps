const mysql = require("mysql2");

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "002016",
    database: "rackdevops"
});

module.exports = connection.promise();