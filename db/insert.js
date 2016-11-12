var config = require('./dbConfig.js');
var con = require('./dbConst.js');
var mssql = require('mssql');

function register_member(account, password, name, ssid, email, type, callback) {

    var sql = `INSERT INTO ${con.sMember} (${con.sAccount}, ${con.sPassword}, ${con.sName}, ${con.sSsid}, ${con.sEmail}, ${con.sType}, ${con.sQcount}) VALUES ('${account}', '${password}', '${name}', '${ssid}', '${email}', '${type}', ${con.initQcount});`;

    set(sql, callback);

}

function register_professor(account, password, name, ssid, email, type, proid, office, grade, otherSet) {
    var sql = `insert into ${con.sProfessor}(${con.sAccount}, ${con.sProid}, ${con.sOffice}, ${con.sGrade}) values('${account}', '${proid}', '${office}', '${grade}');`;

    register_member(account, password, name, ssid, email, type, function(){set(sql);});
}

function register_ta(account, password, name, ssid, email, type, taid, room, otherSet) {
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
