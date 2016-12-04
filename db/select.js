var config = require('./dbConfig.js');
var mssql = require('mssql');
var con = require('./dbConst.js');
var tool = require('../tool/mytool.js');

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
            if (rows[cnt]) {
                callback(flag, rows[cnt]["AuthorID"]);
            } else {
                callback(flag, undefined);
            }
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

function books_info(bsids, bookids, callback) {
    var sql = "";
    bookids.forEach(function(element, index, array){
        if (index != 0) {
            sql += " union ";
        }

        var tmp = `
            select ${con.sBook}.*, ${con.sBookStoreBook}.*, ${con.sBookStore}.*, ${con.sAuthor}.*
            from [${con.sRoot}].[${con.sDbo}].[${con.sBook}] as ${con.sBook}
            , [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] as ${con.sBookStoreBook}
            , [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] as ${con.sBookStore}
            , [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}] as ${con.sAuthor}
            , [${con.sRoot}].[${con.sDbo}].[${con.sAuthorBook}] as ${con.sAuthorBook}
            where ${con.sBookStoreBook}.${con.sBSID} = '${bsids[index]}'
            and ${con.sBookStoreBook}.${con.sBookId} like '${element}'
            and ${con.sBookStoreBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
            and ${con.sAuthorBook}.${con.sAuthorId} = ${con.sAuthor}.${con.sAuthorId}
            and ${con.sAuthorBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
            and ${con.sBookStore}.${con.sBSID} = ${con.sBookStoreBook}.${con.sBSID} `;

        sql += tmp;
    });
    var foot = `order by ${con.sBookStoreBook}.${con.sBookId}, ${con.sBookStoreBook}.${con.sBSID};`;
    sql += foot;

    set(sql, function(rows) {
        if (callback) {
            callback(rows);
        }
    });
}

function order_info(account, orderno, callback) {
    var sql = 
        `
        select [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderNo}, 
        [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderTime},
        ${con.sBookStore}.${con.sBSID}, ${con.sBookStore}.${con.sBSName},
        ${con.sBook}.${con.sBookId}, ${con.sBook}.${con.sBookName},
        ${con.sOrderBook}.${con.sBookCount},
        [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sTotalPrice}
        from [${con.sRoot}].[${con.sDbo}].[${con.sOrder}],
        [${con.sRoot}].[${con.sDbo}].[${con.sOrderBook}] as ${con.sOrderBook},
        [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] as ${con.sBookStore},
        [${con.sRoot}].[${con.sDbo}].[${con.sBook}] as ${con.sBook}
        where [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sAccount} = '${account}'
        and ${con.sOrderBook}.${con.sBSID} = ${con.sBookStore}.${con.sBSID}
        and ${con.sOrderBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
        and [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderNo} = ${con.sOrderBook}.${con.sOrderNo}
        and [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderNo} = '${orderno}'
        order by [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderNo};
        `;

        set(sql, function(rows){
            var list = parseOrderBook(rows);
            if (callback) {
                callback(list);
            }
        });
}

function bsid_booknames_inquire_book(bsid, booknames, callback) {
    var sql = "";
    booknames.forEach(function(element, index, array){
        if (index != 0) {
            sql += " union ";
        }

        var tmp = `
            select ${con.sBook}.*, ${con.sBookStoreBook}.*, ${con.sBookStore}.*, ${con.sAuthor}.*
            from [${con.sRoot}].[${con.sDbo}].[${con.sBook}] as ${con.sBook}
            , [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] as ${con.sBookStoreBook}
            , [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] as ${con.sBookStore}
            , [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}] as ${con.sAuthor}
            , [${con.sRoot}].[${con.sDbo}].[${con.sAuthorBook}] as ${con.sAuthorBook}
            where ${con.sBookStoreBook}.${con.sBSID} = '${bsid}'
            and ${con.sBookStoreBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
            and ${con.sAuthorBook}.${con.sAuthorId} = ${con.sAuthor}.${con.sAuthorId}
            and ${con.sAuthorBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
            and ${con.sBookStore}.${con.sBSID} = ${con.sBookStoreBook}.${con.sBSID}
            and ${con.sBook}.${con.sBookName} like '%${element}%' `;

        sql += tmp;
    });
    var foot = `order by ${con.sBookStoreBook}.${con.sBookId}, ${con.sBookStoreBook}.${con.sBSID};`;
    sql += foot;

    set(sql, function(rows) {
        if (callback) {
            callback(rows);
        }
    });
}

function bsid_inquire_book(bsid, callback) {

    var sql = `
        select ${con.sBook}.*, ${con.sBookStoreBook}.*, ${con.sBookStore}.*, ${con.sAuthor}.*
        from [${con.sRoot}].[${con.sDbo}].[${con.sBook}] as ${con.sBook}
        , [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] as ${con.sBookStoreBook}
        , [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] as ${con.sBookStore}
        , [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}] as ${con.sAuthor}
        , [${con.sRoot}].[${con.sDbo}].[${con.sAuthorBook}] as ${con.sAuthorBook}
        where ${con.sBookStoreBook}.${con.sBSID} = '${bsid}' 
        and ${con.sBookStoreBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
        and ${con.sAuthorBook}.${con.sAuthorId} = ${con.sAuthor}.${con.sAuthorId}
        and ${con.sAuthorBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
        and ${con.sBookStore}.${con.sBSID} = ${con.sBookStoreBook}.${con.sBSID}
        order by ${con.sBookStoreBook}.${con.sBookId}, ${con.sBookStoreBook}.${con.sBSID};`;

    set(sql, function(rows) {
        if (callback) {
            callback(rows);
        }
    });

}

function booknames_inquire_book(booknames, callback) {
    var sql = "";
    booknames.forEach(function(element, index, array){
        if (index != 0) {
            sql += " union ";
        }

        var tmp = `
            select ${con.sBook}.*, ${con.sBookStoreBook}.*, ${con.sBookStore}.*, ${con.sAuthor}.*
            from [${con.sRoot}].[${con.sDbo}].[${con.sBook}] as ${con.sBook}
            , [${con.sRoot}].[${con.sDbo}].[${con.sBookStoreBook}] as ${con.sBookStoreBook}
            , [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] as ${con.sBookStore}
            , [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}] as ${con.sAuthor}
            , [${con.sRoot}].[${con.sDbo}].[${con.sAuthorBook}] as ${con.sAuthorBook}
            where ${con.sBookStoreBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
            and ${con.sAuthorBook}.${con.sAuthorId} = ${con.sAuthor}.${con.sAuthorId}
            and ${con.sAuthorBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
            and ${con.sBookStore}.${con.sBSID} = ${con.sBookStoreBook}.${con.sBSID}
            and ${con.sBook}.${con.sBookName} like '%${element}%' `;

        sql += tmp;
    });
    var foot = `order by ${con.sBookStoreBook}.${con.sBookId}, ${con.sBookStoreBook}.${con.sBSID};`;
    sql += foot;

    set(sql, function(rows) {
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

                var no = element[con.sOrderNo].substr(1, element[con.sOrderNo].length - 1);
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

    var sql = `select ${con.sAuthor}.* from [${con.sRoot}].[${con.sDbo}].[${con.sAuthorBook}] as ${con.sAuthorBook}, [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}] as ${con.sAuthor} where ${con.sAuthorBook}.${con.sBookId} = '${bookid}' and ${con.sAuthorBook}.${con.sAuthorId} = ${con.sAuthor}.${con.sAuthorId};`;
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

function memeber_get_order(account, callback) {
    var sql = 
        `
        select [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderNo}, 
        [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderTime},
        ${con.sBookStore}.${con.sBSID}, ${con.sBookStore}.${con.sBSName},
        ${con.sBook}.${con.sBookId}, ${con.sBook}.${con.sBookName},
        ${con.sOrderBook}.${con.sBookCount},
        [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sTotalPrice}
        from [${con.sRoot}].[${con.sDbo}].[${con.sOrder}],
        [${con.sRoot}].[${con.sDbo}].[${con.sOrderBook}] as ${con.sOrderBook},
        [${con.sRoot}].[${con.sDbo}].[${con.sBookStore}] as ${con.sBookStore},
        [${con.sRoot}].[${con.sDbo}].[${con.sBook}] as ${con.sBook}
        where [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sAccount} = '${account}'
        and ${con.sOrderBook}.${con.sBSID} = ${con.sBookStore}.${con.sBSID}
        and ${con.sOrderBook}.${con.sBookId} = ${con.sBook}.${con.sBookId}
        and [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderNo} = ${con.sOrderBook}.${con.sOrderNo}
        order by [${con.sRoot}].[${con.sDbo}].[${con.sOrder}].${con.sOrderNo};
        `;

        set(sql, function(rows) {
            var list = parseOrderBook(rows);
            if (callback) {
                callback(list);
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

function parseOrderBook(rows) {
    var list = [];
    // var obj = {OrderNo, OrderTime, BSID:[], BSName:[], BookID:[], BookName:[], Book_Count:[], Total_Price};
    
    var presame = false;
    var len = rows.length;
    rows.forEach(function(element, index, array) {
        var last = index == len - 1;
        var nextsame = false;
        if (!last) {
            nextsame = element[con.sOrderNo] == array[index + 1][con.sOrderNo];
        }

        if (!presame) {
            var obj = {};
            obj[con.sOrderNo] = element[con.sOrderNo];
            obj[con.sOrderTime] = element[con.sOrderTime];
            obj[con.sBSID] = [element[con.sBSID]];
            obj[con.sBSName] = [element[con.sBSName]];
            obj[con.sBookId] = [element[con.sBookId]];
            obj[con.sBookName] = [element[con.sBookName]];
            obj[con.sBookCount] = [element[con.sBookCount]];
            obj[con.sTotalPrice] = element[con.sTotalPrice];
            list.push(obj);
        } else {
            list[list.length - 1][con.sBSID].push(element[con.sBSID]);
            list[list.length - 1][con.sBSName].push(element[con.sBSName]);
            list[list.length - 1][con.sBookId].push(element[con.sBookId]);
            list[list.length - 1][con.sBookName].push(element[con.sBookName]);
            list[list.length - 1][con.sBookCount].push(element[con.sBookCount]);
        }

        presame = nextsame;

    });

    return list;
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
module.exports.books_info = books_info;
module.exports.order_info = order_info;
module.exports.bsid_booknames_inquire_book = bsid_booknames_inquire_book;
module.exports.bsid_inquire_book = bsid_inquire_book;
module.exports.booknames_inquire_book = booknames_inquire_book;
module.exports.orderMan_get_bookstore = orderMan_get_bookstore;
module.exports.bookstore_get_allBook = bookstore_get_allBook;
module.exports.book_get_authors = book_get_authors;
module.exports.author_get_name = author_get_name;
module.exports.memeber_get_order = memeber_get_order;
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
