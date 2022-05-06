var sqlite3 = require('sqlite3');
var db;
new sqlite3.Database('mcu.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
    Runqueries(db);
});

function createDatabase() {
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec('create table transactions ( transaction_id INTEGER PRIMARY KEY AUTOINCREMENT, chain_id text not null,from_token text not null, to_token text not null, to_toke text not null, from_db text not null ,blockhash text not null, status text not null, transactionHash text not null);');
}

function Runqueries(newdb) {
    newdb.exec("insert into transactions (transaction_id, chain_id, from_token, to_token, to_toke, from_db, blockhash, status, transactionHash )values ('', 'Spiderman', 'Spiderman', 'Spiderman', 'Spiderman', 'Spiderman', 'Spiderman' , 'Spiderman', 'Spiderman');");
}