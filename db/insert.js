var config = require('./dbConfig.js');
var con = require('./dbConst.js');
var mssql = require('mssql');
var db_select = require('./select.js');
var db_update = require('./update.js');
var tool = require('../tool/mytool.js');

function register_member(account, password, name, ssid, email, type, callback) {

    var sql = `INSERT INTO ${con.sMember} (${con.sAccount}, ${con.sPassword}, ${con.sName}, ${con.sSsid}, ${con.sEmail}, ${con.sType}, ${con.sQcount}) VALUES ('${account}', '${password}', '${name}', '${ssid}', '${email}', '${type}', ${con.initQcount});`;

    set(sql, callback);

}

function register_professor(account, password, name, ssid, email, type, proid, office, grade) {
    var sql = `insert into ${con.sProfessor}(${con.sAccount}, ${con.sProid}, ${con.sOffice}, ${con.sGrade}) values('${account}', '${proid}', '${office}', '${grade}');`;

    register_member(account, password, name, ssid, email, type, function(){set(sql);});
}

function register_ta(account, password, name, ssid, email, type, taid, room) {
    var sql = `insert into ${con.sTa}(${con.sAccount}, ${con.sTaid}, ${con.sRoom}) values('${account}', '${taid}', '${room}');`;

    register_member(account, password, name, ssid, email, type, function(){set(sql);});

}

function register_student(account, password, name, ssid, email, type, sid, class_) {
    var sql = `insert into ${con.sStudent}(${con.sAccount}, ${con.sSID}, ${con.sClass}) values('${account}', '${sid}', '${class_}');`;

    register_member(account, password, name, ssid, email, type, function(){set(sql);});
}

function register_orderMan(account, password, name, ssid, email, type, ordermanid) {
    var sql = `insert into ${con.sOrderMan}(${con.sAccount}, ${con.sOrderManid}) values('${account}', '${ordermanid}');`;
    register_member(account, password, name, ssid, email, type, function(){set(sql);});
}

function add_book(bookid, bookname, price, author, publisher, bsid) {

    db_select.book_exist(bookid, function(flag) {
        if (flag) {
            add_bookstore_book(bookid, bsid, price);
        } else {
            var sql = `insert into ${con.sBook}(${con.sBookId}, ${con.sBookName}, ${con.sPublisher}) values('${bookid}', '${bookname}', '${publisher}');`;

            set(sql, function(){
                add_bookstore_book(bookid, bsid, price);
                add_author(author, bookid);
            });

        }
    });

}

function add_bookstore_book(bookid, bsid, price) {

    var sql = `insert into ${con.sBookStoreBook}(${con.sBSID}, ${con.sBookId}, ${con.sPrice}) values('${bsid}', '${bookid}', '${price}');`;
    set(sql);
}

function add_author(author, bookid) {
    var authorlist = tool.split(author, ",");

    db_select.authors_info(authorlist, function(rows) {
        db_select.getAuthorId(function(authorNo) {
            var cnt = 0;
            authorlist.forEach(function(element, index, array) {
                if (element != "" && element) {
                    var flag = -1;
                    rows.forEach(function(e, i, a){
                        if (e["Name"].trim() == element.trim()) {
                            flag = i;
                        }
                    });
                    if (flag >= 0) {
                        add_author_book(rows[flag]["AuthorID"], bookid);
                    } else {
                        var no = authorNo + cnt;
                        cnt++;

                        var sql = `insert into ${con.sAuthor}(${con.sAuthorId}, ${con.sAuthorName}) values('A${no}', '${element}');`;
                        set(sql, function(){
                            add_author_book('A' + no, bookid);
                        });
                    }

                }
                
            });
        });
    });
}

function add_author_book(authorid, bookid) {

    var sql = `insert into ${con.sAuthorBook}(${con.sAuthorId}, ${con.sBookId}) values('${authorid}', '${bookid}');`;

    set(sql);

}

function add_bookstore(bsid, bsname, city, bsphone, account) {

    var sql = `insert into ${con.sBookStore}(${con.sBSID}, ${con.sBSName}, ${con.sCity}, ${con.sBSPhone}, ${con.sAccount}) values('${bsid}', '${bsname}', '${city}', '${bsphone}', '${account}')`;

    set(sql);
}

function add_order(orderno, account, bsid_array, bookid_array, bookcount_array, total_price) {

    var sql = `insert into [${con.sRoot}].[${con.sDbo}].[${con.sOrder}](${con.sOrderNo}, ${con.sOrderTime}, ${con.sAccount}, ${con.sTotalPrice}) values('${orderno}', SYSDATETIME(), '${account}', '${total_price}');`;

    set(sql, function(){
        add_order_book(orderno, bsid_array, bookid_array, bookcount_array);
        add_qcount(account);
    });
}

function add_qcount(account, callback) {
    db_select.account_get_ordercount(account, function(qcount){
        db_update.update_qcount(account, qcount, function(){
            if (callback) {
                callback();
            }
        });
    });
}

function add_order_book(orderno, bsid_array, bookid_array, bookcount_array) {
    bookid_array.forEach(function(element, index, array){
        var sql = `insert into ${con.sOrderBook}(${con.sOrderNo}, ${con.sBSID}, ${con.sBookId}, ${con.sBookCount}) values('${orderno}', '${bsid_array[index]}', '${element}', '${bookcount_array[index]}');`;

        set(sql);
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

module.exports.register_professor = register_professor;
module.exports.register_ta = register_ta;
module.exports.register_student = register_student;
module.exports.register_orderMan = register_orderMan;
module.exports.add_book = add_book;
module.exports.add_bookstore = add_bookstore;
module.exports.add_order = add_order;
module.exports.add_order_book = add_order_book;
module.exports.add_author = add_author;
