var config = require('./dbConfig.js');
var mssql = require('mssql');
var con = require('./dbConst.js')

function verification_account(account, password, callback) {

    var sql = `select ${con.sPassword} from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows){
        if (callback) {
            callback(password === rows[0][con.sPassword]);
        }
    });
}

function verification_author(authorName, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}];`;

    set(sql, function(rows){
        var flag = false;
        var cnt = 0;
        rows.forEach(function(element, index, array) {
            var rowName = element["Name"];
            rowName = rowName.trim();
            if (rowName == authorName) {
                flag = true;
                cnt = index;
                return;
            }
        });
        if (callback) {
            callback(flag, rows[cnt]["AuthorID"]);
        }

    });
}

function account_info(account, callback) {
    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`;
    set(sql, function(rows){
        if (callback) {
            callback(rows[0]);
        }
    });
}

function professor_info(account, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sProfessor}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows){
        if (callback) {
            callback(rows[0]);
        }
    });
}

function ta_info(account, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sTa}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows){
        if (callback) {
            callback(rows[0]);
        }
    });
}

function student_info(account, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sStudent}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows){
        if (callback) {
            callback(rows[0]);
        }
    });
}

function orderMan_info(account, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDb_acc}].[${con.sOrderMan}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows){
        if (callback) {
            callback(rows[0]);
        }
    });
}

function book_info(bookid, callback) {

    var sql = `select ${con.sBook}.*, ${con.sBookStoreBook}.* from [${con.sRoot}].[${con.sDbo}].[${con.sBook}] as ${con.sBook}, [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] as ${con.sBookStoreBook} where ${con.sBookStoreBook}.${con.sBookId} = '${bookid}' and ${con.sBookStoreBook}.${con.sBookId} = ${con.sBook}.${con.sBookId};`;
    set(sql, function(rows){
        if (callback) {
            callback(rows);
        }
    });
}

function orderMan_get_bookstore(account, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows) {
        if (callback) {
            callback(rows[0]);
        }
    });
}

function bookstore_get_allBook(bsid, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] where ${con.sBSID} = '${bsid}';`;

    set(sql, function(rows) {
        if (callback) {
            callback(rows);
        }
    });
}

function book_exist(bookid, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sBook}] where ${con.sBookId} = '${bookid}';`;

    set(sql, function(rows) {
        if (callback) {
            callback(rows.length != 0);
        }
    });
}

function account_exist(account, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows){
        if (callback) {
            callback(rows.length != 0);
        }
    });
}

function bookstore_exist(bsid, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] where ${con.sBSID} = '${bsid}';`;
    set(sql, function(rows){
        if (callback) {
            callback(rows.length != 0);
        }
    });
}

function book_store_exist(bsid, bookid, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] where ${con.sBSID} = '${bsid}' and ${con.sBookId} = '${bookid}';`;

    set(sql, function(rows){
        if (callback) {
            callback(rows.length != 0);
        }
    })
}

function getType(account, callback) {
    var sql = `select ${con.sType} from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`

    set(sql, function(rows){
        if (callback) {
            callback(rows[0]["status"]);
        }
    });
}

function getAuthorId(callback) {

    var sql = `select ${con.sAuthorId} from [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}]`;

    set(sql, function(rows){
        if (callback) {
            var max = 1;
            rows.forEach(function(element, index, array) {
                var no = element[con.sAuthorId].substr(1, element[con.sAuthorId].length - 1);
                var num = parseInt(no, 10);
                if (max < num) {
                    max = num;
                }
            });

            var count = max + 1;
            callback(count);
        }
    });
}

function getOrderNo(callback) {

    var sql = `select ${con.sOrderNo} from [${con.sRoot}].[${con.sDbo}].[${con.sOrder}]`;

    set(sql, function(rows){
        if (callback) {
            var max = 1;
            rows.forEach(function(element, index, array) {
                var no = element.substr(1, element.length - 1);
                var num = parseInt(no, 10);
                if (max < num) {
                    max = num;
                }
            });

            var count = max + 1;
            callback(count);
        }
    });
}

function getBookPrice(bsid, bookid, callback) {

    var sql = `select ${con.sPrice} from [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] where ${con.sBookId} = '${bookid}' and ${con.sBSID} = '${bsid}';`;

    set(sql, function(rows){
        if (callback) {
            callback(rows[0][con.sPrice]);
        }
    });
}

function book_get_authors(bookid, callback) {

    var sql = `select ${con.sAuthorBook}.${con.sAuthorId}, ${con.sAuthor}.${con.sAuthorName} from [${con.sRoot}].[${con.sDbo}].[${con.sAuthorBook}] as ${con.sAuthorBook}, [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}] as ${con.sAuthor} where ${con.sAuthorBook}.${con.sBookId} = ${bookid} and ${con.sAuthorBook}.${con.sAuthorId} = ${con.sAuthor}.${con.sAuthorId};`;
    set(sql, function(rows){
        if (callback) {
            callback(rows);
        }
    });
}

function author_get_name(authorid, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}] where ${con.sAuthorId} = authorid;`;
    set(sql, function(rows){
        if (callback) {
            callback(rows);
        }
    });
}

function getAllBookstores(callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}];`;

    set(sql, function(rows) {
        if (callback) {
            callback(rows);
        }
    });
}

function getAllAccounts(callback) {

    var sql = `select ${con.sAccount} from [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}];`;

    set(sql, function(rows) {
        if (callback) {
            callback(rows);
        }
    });
}

function set(sqlstr, callback) {
    var connection = new mssql.Connection(config);
    var rows = [];
    connection.connect(function(err) {
        if (err) {
            console.log(err);
            return;
        }
        var mydb = new mssql.Request(connection);
        mydb.stream = true;
        mydb.query(sqlstr);
        mydb.on('row', function(row){
            rows.push(row);
        });
        mydb.on('error', function(err){
            console.log(err);
            console.log(sqlstr);
            return;
        });
        mydb.on('done', function(affected){
            if (callback) {
                callback(rows);
            }
        });
    });

}

module.exports.verification_account = verification_account;
module.exports.verification_author = verification_author;
module.exports.account_info = account_info;
module.exports.professor_info = professor_info;
module.exports.ta_info = ta_info;
module.exports.student_info = student_info;
module.exports.orderMan_info = orderMan_info;
module.exports.book_info = book_info;
module.exports.orderMan_get_bookstore = orderMan_get_bookstore;
module.exports.bookstore_get_allBook = bookstore_get_allBook;
module.exports.book_get_authors = book_get_authors;
module.exports.author_get_name = author_get_name;
module.exports.book_exist = book_exist;
module.exports.book_store_exist = book_store_exist;
module.exports.account_exist = account_exist;
module.exports.bookstore_exist = bookstore_exist;
module.exports.getType = getType;
module.exports.getAuthorId = getAuthorId;
module.exports.getOrderNo = getOrderNo;
module.exports.getBookPrice = getBookPrice;
module.exports.getAllBookstores = getAllBookstores;
module.exports.getAllAccounts = getAllAccounts;
