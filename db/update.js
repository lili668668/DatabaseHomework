var config = require('./dbConfig.js');
var con = require('./dbConst.js');
var mssql = require('mssql');
var db_select = require('./select.js');
var db_insert = require('./insert.js');
var db_delete = require('./delete.js');

function update_member(account, name, ssid, email, callback) {

    var sql = `update ${con.sMember} set ${con.sName}='${name}', ${con.sSsid}='${ssid}', ${con.sEmail}='${email}' where ${con.sAccount}='${account}';`;

    set(sql, callback);

}

function update_professor(account, name, ssid, email, proid, office, grade) {

    var sql = `update ${con.sProfessor} set ${con.sProid}='${proid}', ${con.sOffice}='${office}', ${con.sGrade}='${grade}' where ${con.sAccount}='${account}';`;

    update_member(account, name, ssid, email, function(){set(sql);});
}

function update_ta(account, name, ssid, email, taid, room) {

    var sql = `update ${con.sTa} set ${con.sTaid}='${taid}', ${con.sRoom}='${room}' where ${con.sAccount}='${account}';`;

    update_member(account, name, ssid, email, function(){set(sql);});

}

function update_student(account, name, ssid, email, sid, class_) {

    var sql = `update  ${con.sStudent} set ${con.sSID}='${ssid}', ${con.sClass}='${class_}' where ${con.sAccount}='${account}';`;

    update_member(account, name, ssid, email, function(){set(sql);});
}

function update_orderMan(account, name, ssid, email, ordermanid) {

    var sql = `update ${con.sOrderMan} set ${con.sOrderManid}='${ordermanid}' where ${con.sAccount}='${account}'`;
    update_member(account, name, ssid, email, function(){set(sql);});
}

function update_password(account, password) {

    var sql = `update ${con.sMember} set ${con.sPassword} = '${password}' where ${con.sAccount} = '${account}';`;
    set(sql);
}

function update_order(orderno, account, bsids, bookids, counts, allprice) {

    var sql = `update [${con.sRoot}].[${con.sDbo}].[${con.sOrder}] set ${con.sOrderTime} = SYSDATETIME(), ${con.sTotalPrice} = '${allprice}' where ${con.sOrderNo} = '${orderno}' and ${con.sAccount} = '${account}';`;

    set(sql, function() {
        update_order_book(orderno, bsids, bookids, counts);
    });

}

function update_order_book(orderno, bsids, bookids, counts) {
    db_delete.empty_books_from_order(orderno, function(){
        db_insert.add_order_book(orderno, bsids, bookids, counts);
    });
}

function update_book(bsid, bookid, bookname, price, author, publisher, callback) {

    var sql = `update ${con.sBook} set ${con.sBookName} = '${bookname}', ${con.sPublisher} = '${publisher}' where ${con.sBookId} = '${bookid}';`;

    set(sql, function(){
        update_price(bsid, bookid, price);
        db_delete.empty_authorbooks_from_book(bookid, function(){
            db_insert.add_author(author, bookid, function(){
                if (callback) {
                    callback();
                }
            });
        });
    });

}

function update_bookstore(bsid, bsname, city, bsphone){
    var sql = `update ${con.sBookStore} set ${con.sBSName} = '${bsname}', ${con.sCity} = '${city}', ${con.sBSPhone} = '${bsphone}' where ${con.sBSID} = '${bsid}';`;

    set(sql);

}

function update_qcount(account, qcount, callback) {

    var sql = `update ${con.sMember} set ${con.sQcount} = '${qcount}' where ${con.sAccount} = '${account}';`;
    set(sql, function(){
        if (callback) {
            callback();
        }
    });
}

function update_price(bsid, bookid, price, callback) {

    var sql = `update ${con.sBookStoreBook} set ${con.sPrice} = '${price}' where ${con.sBSID} = '${bsid}' and ${con.sBookId} = '${bookid}';`;
    set(sql, function() {
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

module.exports.update_professor = update_professor;
module.exports.update_ta = update_ta;
module.exports.update_student = update_student;
module.exports.update_orderMan = update_orderMan;
module.exports.update_password = update_password;
module.exports.update_order = update_order;
module.exports.update_book = update_book;
module.exports.update_price = update_price;
module.exports.update_bookstore = update_bookstore;
module.exports.update_qcount = update_qcount;
