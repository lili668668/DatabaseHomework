var config = require('./dbConfig.js');
var con = require('./dbConst.js');
var mssql = require('mssql');
var db_select = require('./select.js');

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

function add_book(bookid, bookname, price, author, publisher) {

    var sql = `insert into ${con.sBook}(${con.sBookId}, ${con.sBookName}, ${con.sPrice}, ${con.sPublisher}) values('${bookid}', '${bookname}', '${price}', '${publisher}');`;

    set(sql, function(){
        add_author(author, bookid);
    });

}

function add_author(author, bookid) {
    db_select.getAuthorId(function(authorid) {

        var sql = `insert into ${con.sAuthor}(${con.sAuthorId}, ${con.sAuthorName}) values('A${authorid}', '${author}');`;
        set(sql, function(){
            add_author_book(authorid, bookid);
        });
    });
}

function add_author_book(authorid, bookid) {

    var sql = `insert into ${con.sAuthorBook}(${con.sAuthorId}, ${con.sBookId}) values('A${authorid}', '${bookid}');`;

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

module.exports.update_professor = update_professor;
module.exports.update_ta = update_ta;
module.exports.update_student = update_student;
module.exports.update_orderMan = update_orderMan;
module.exports.add_book = add_book;
