const mysql = require('mysql');
const myConnection = require('express-myconnection');
require('dotenv').config();

const env = process.env.ENV || "test";
console.log("environment: "+env);
let connection;
//in this example we only have dest and development env
if(env === 'dev'){
    //dev

    connection = myConnection(mysql, {
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD,
        //port: 3306,
        database: process.env.DEV_DB_DATABASE
    }, 'single');

} else {
    //testing
    connection = myConnection(mysql, {
        host: process.env.TEST_DB_HOST || 'localhost',
        user: process.env.TEST_DB_USERNAME || 'root',
        password: process.env.TEST_DB_PASSWORD || '',
        //port: 3306,
        database: process.env.TEST_DB_DATABASE || 'shippify2'
    }, 'single');

} 


module.exports = connection;