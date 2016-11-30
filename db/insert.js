var config = require('./dbConfig.js');
var con = require('./dbConst.js');
var mssql = require('mssql');
var db_select = require('./select.js');

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

function add_book(bookid, bookname, price, author, publisher) {

    var sql = `insert into ${con.sBook}(${con.sBookId}, ${con.sBookName}, ${con.sPrice}, ${con.sPublisher}) values('${bookid}', '${bookname}', '${price}', '${publisher}');`;

    set(sql, function(){
        add_author(author, bookid);
    });

}

function add_author(author, bookid) {
    var authorlist = split(author, ",");

    authorlist.forEach(function(authorName, index, array){
        db_select.verification_author(authorName, function(inAuthor, authorid){
            if (inAuthor) {
                add_author_book(authorid.trim(), bookid);
            
            } else {
                db_select.getAuthorId(function(authorNo) {
                    authorNo = authorNo + index;

                    var sql = `insert into ${con.sAuthor}(${con.sAuthorId}, ${con.sAuthorName}) values('A${authorNo}', '${authorName}');`;
                    set(sql, function(){
                        add_author_book('A' + authorNo, bookid);
                    });
                });
            }
        });

    });

}

function add_author_book(authorid, bookid) {

    var sql = `insert into ${con.sAuthorBook}(${con.sAuthorId}, ${con.sBookId}) values('${authorid}', '${bookid}');`;

    set(sql);

}

function add_bookstore(bsid, bsname, city, bsphone) {

    var sql = `insert into ${con.sBookStore}(${con.sBSID}, ${con.sBSName}, ${con.sCity}, ${con.sBSPhone}) values('${bsid}', '${bsname}', '${city}', '${bsphone}')`;

    set(sql);
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

function split(origin, spliter) {
    var list = origin.split(spliter);
    var newlist = [];
    for (var cnt = 0;cnt < list.length;cnt++) {
        newlist.push(list[cnt].trim());
    }

    return newlist;
}

module.exports.register_professor = register_professor;
module.exports.register_ta = register_ta;
module.exports.register_student = register_student;
module.exports.register_orderMan = register_orderMan;
module.exports.add_book = add_book;
module.exports.add_bookstore = add_bookstore;
