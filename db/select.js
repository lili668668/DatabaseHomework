var config = require('./dbConfig.js');
var mssql = require('mssql');
var con = require('./dbConst.js')

function verification_account(account, password) {

    var sql = `select ${con.sPassword} from [${con.sRoot}].[${con.sDbo}].[${con.sMember}] where ${con.sAccount} = '${account}';`;

    var bool = false;
    return set(sql, function(rows){
        if (password === rows[0]["password"]) {
            return true;
        }
    });
}

function set(sqlstr, callback) {
    var connection = new mssql.Connection(config);
    var rows = [];
    return connection.connect(function(err) {
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
        return mydb.on('done', function(affected){
            if (callback) {
                return callback(rows);
            }
        });
    });

}

module.exports.verification_account = verification_account;
