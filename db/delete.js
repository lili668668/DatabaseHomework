var config = require('./dbConfig.js');
var con = require('./dbConst.js');
var mssql = require('mssql');

function empty_books_from_order(orderno, callback) {

    var sql = `delete from [${con.sRoot}].[${con.sDbo}].[${con.sOrderBook}] where ${con.sOrderNo} = '${orderno}';`;

    set(sql, function(){
        if (callback) {
            callback();
        }
    });
}

function set(sqlstr, callback) {
    var connection = new mssql.Connection(config);
    connection.connect(function(err) {
        var transaction = new mssql.Transaction(connection);
        transaction.begin(function(err){
            if (err) {
                console.log(err);
                return;
            }

            var mydb = new mssql.Request(transaction);

            mydb.query(sqlstr, function(err, recordset, affected){
                if (err) {
                    console.log(err);
                    console.log(sqlstr);
                    return;
                }

                transaction.commit(function(err, recordset){
                    if (err) {
                        console.log(err);
                        transaction.rollback(function(err){
                            console.log(err);
                            return;
                        });
                    } else {
                        console.log('commited');
                        if (callback) {
                            callback();
                        }
                    }
                });
            });

        });
    });

}
module.exports.empty_books_from_order = empty_books_from_order;
