const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "ingatlan",
    waitForConnections: true,  
    connectionLimit: 10, 
    queueLimit: 0  
});

function query(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) {
                console.error("Hiba a lekérdezés végrehajtása során: ", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function testConnection() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Hiba történt a MySQL szerverhez való csatlakozáskor: ', err.stack);
            return;
        }
        console.log('Csatlakozva a MySQL szerverhez, kapcsolat ID: ' + connection.threadId);
        connection.release();
    });
}

module.exports = {
    query,
    testConnection
};
