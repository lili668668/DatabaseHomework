var config = require('./dbConfig.js');
var mssql = require('mssql');
var con = require('./dbConst.js')

function verification_account(account, password, callback) {

    var sql = `select ${con.sPassword} from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows){
        if (callback) {
            callback(password === rows[0]["Password"]);
        }
    });
}

function verification_author(authorName, callback) {

    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}];`;

    set(sql, function(rows){
        var flag = false;
        var cnt = 0;
        for (;cnt < rows.legnth;cnt++) {
            var rowName = rows[cnt]["Name"];
            rowName = rowName.trim();
            if (rowName == authorName) {
                flag = true;
                break;
            }
        }

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

function getType(account, callback) {
    var sql = `select ${con.sType} from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`

    set(sql, function(rows){
        if (callback) {
            callback(rows[0]["status"]);
        }
    });
}

function getAuthorId(callback) {

    var sql = `select count(${con.sAuthorId}) as cou from [${con.sRoot}].[${con.sDbo}].[${con.sAuthor}]`;

    set(sql, function(rows){
        if (callback) {
            var count = parseInt(rows[0]["cou"], 10) + 1;
            callback(count);
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
module.exports.getType = getType;
module.exports.account_info = account_info;
module.exports.professor_info = professor_info;
module.exports.ta_info = ta_info;
module.exports.student_info = student_info;
module.exports.orderMan_info = orderMan_info;
module.exports.getAuthorId = getAuthorId;
