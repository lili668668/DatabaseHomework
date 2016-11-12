var config = require('./dbConfig.js');
var mssql = require('mssql');
var con = require('./dbConst.js')

function verification_account(account, password, callback) {

    var sql = `select ${con.sPassword} from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`;

    set(sql, function(rows){
        if (callback) {
            callback(password === rows[0]["password"]);
        }
    });
}

function account_info(account, callback) {
    var sql = `select * from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`
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
module.exports.getType = getType;
module.exports.account_info = account_info;
