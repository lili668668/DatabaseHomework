var config = require('./dbConfig.js');
var con = require('./dbConst.js');
var mssql = require('mssql');
var db_select = require('./select.js');

function empty_books_from_order(orderno, callback) {

    var sql = `delete from [${con.sRoot}].[${con.sDbo}].[${con.sOrderBook}] where ${con.sOrderNo} = '${orderno}';`;

    set(sql, function(){
        console.log(sql);
        if (callback) {
            callback();
        }
    });
}

function remove_a_order(orderno, callback) {
    var sql = `delete from [${con.sRoot}].[${con.sDbo}].[${con.sOrder}] where ${con.sOrderNo} = '${orderno}';`;

    empty_books_from_order(orderno, function(){
        set(sql, function() {
            if (callback) {
                callback();
            }
        });
    });
}

function remove_a_member(account, callback) {

    var sql = `delete from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`;

    set(sql, function() {
        if (callback) {
            callback();
        }
    });
}

function remove_a_student(account, callback) {

    var sql = `delete from [${con.sRoot}].[${con.sDbo}].[${con.sStudent}] where ${con.sAccount} = '${account}';`;

    empty_orders_from_account(account, function(){
        set(sql, function(){
            remove_a_member(account, function(){
                if (callback) {
                    callback();
                }
            });
        });
    });
}

function remove_a_ta(account, callback) {

    var sql = `delete from [${con.sRoot}].[${con.sDbo}].[${con.sTa}] where ${con.sAccount} = '${account}';`;

    empty_orders_from_account(account, function(){
        set(sql, function(){
            remove_a_member(account, function(){
                if (callback) {
                    callback();
                }
            });
        });
    });
}

function remove_a_orderman(account, callback) {

    var sql = `delete from [${con.sRoot}].[${con.sDb_acc}].[${con.sOrderMan}] where ${con.sAccount} = '${account}';`;

    empty_orders_from_account(account, function(){
        remove_bookstore_from_account(account, function(){
            set(sql, function(){
                remove_a_member(account, function(){
                    if (callback) {
                        callback();
                    }
                });
            });

        });
    });
}

function remove_a_professor(account, callback) {

    var sql = `delete from [${con.sRoot}].[${con.sDbo}].[${con.sProfessor}] where ${con.sAccount} = '${account}';`;

    empty_orders_from_account(account, function(){
        set(sql, function(){
            remove_a_member(account, function(){
                if (callback) {
                    callback();
                }
            });
        });
    });
}

function empty_orderbooks_from_order(ordernos, callback) {

    var sql = `delete from [${con.sRoot}].[${con.sDbo}].[${con.sOrderBook}] where `;

    ordernos.forEach(function(element, index, array){
        if (index != 0) {
            sql += " or ";
        }

        var tmp = `${con.sOrderBook}.${con.sOrderNo} = '${element}' `;

        sql += tmp;
    });
    var foot = ";";
    sql += foot;

    set(sql, function(){
        if (callback) {
            callback();
        }
    });
}

function empty_orders_from_account(account, callback) {

    var sql =  `delete from [${con.sRoot}].[${con.sDbo}].[${con.sOrder}] where ${con.sAccount} = '${account}';`;

    db_select.memeber_get_order(account, function(rows){
        var ordernos = [];
        rows.forEach(function(element, index, array){
            ordernos.push(element[con.sOrderNo]);
        });

        empty_orderbooks_from_order(ordernos, function(){
            set(sql, function(){
                if (callback) {
                    callback();
                }
            });
            
        });
    });
}

function remove_bookstore_from_account(account, callback) {

    var sql =  `delete from [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] where ${con.sAccount} = '${account}';`;

    db_select.orderMan_get_bookstore(account, function(rows){
        var bsid = rows["BSID"];
        empty_books_from_bookstore(bsid, function(){
            set(sql, function(){
                if (callback) {
                    callback();
                }
            });
        });
    });
}

function empty_orders_from_bookstore(bsid, callback) {

    var sql =  `delete from [${con.sRoot}].[${con.sDbo}].[${con.sOrderBook}] where ${con.sBSID} = '${bsid}';`;
    set(sql, function(){
        if (callback) {
            callback();
        }
    });
}

function empty_books_from_bookstore(bsid, callback) {

    var sql =  `delete from [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] where ${con.sBSID} = '${bsid}';`;

    empty_orders_from_bookstore(bsid, function(){
        set(sql, function(){
            if (callback) {
                callback();
            }
        });
    });
}

function remove_a_book(bookid, callback) {

    var sql =  `delete from [${con.sRoot}].[${con.sDbo}].[${con.sBook}] where ${con.sBookId} = '${bookid}';`;

    empty_bookstorebooks_from_book(bookid, function(){
        empty_authorbooks_from_book(bookid, function(){
            set(sql, function(){
                if (callback) {
                    callback();
                }
            });

        });
    });
}

function empty_bookstorebooks_from_book(bookid, callback) {

    var sql =  `delete from [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] where ${con.sBookId} = '${bookid}';`;

    empty_orders_from_book(bookid, function(){
        set(sql, function(){
            if (callback) {
                callback();
            }
        });
    });

}

function empty_orders_from_book(bookid, callback) {

    var sql =  `delete from [${con.sRoot}].[${con.sDbo}].[${con.sOrderBook}] where ${con.sBookId} = '${bookid}';`;

    set(sql, function(){
        if (callback) {
            callback();
        }
    });

}

function empty_authorbooks_from_book(bookid, callback){

    var sql =  `delete from [${con.sRoot}].[${con.sDbo}].[${con.sAuthorBook}] where ${con.sBookId} = '${bookid}';`;

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
module.exports.remove_a_order = remove_a_order;
module.exports.remove_a_member = remove_a_member;
module.exports.remove_a_student = remove_a_student;
module.exports.remove_a_professor = remove_a_professor;
module.exports.remove_a_ta = remove_a_ta;
module.exports.remove_a_orderman = remove_a_orderman;
module.exports.empty_orders_from_account = empty_orders_from_account;
module.exports.remove_bookstore_from_account = remove_bookstore_from_account;
module.exports.empty_books_from_bookstore = empty_books_from_bookstore;
module.exports.empty_orders_from_bookstore = empty_orders_from_bookstore;
module.exports.remove_a_book = remove_a_book;
module.exports.empty_orders_from_book = empty_orders_from_book;
module.exports.empty_authorbooks_from_book = empty_authorbooks_from_book;
module.exports.empty_bookstorebooks_from_book = empty_bookstorebooks_from_book;
