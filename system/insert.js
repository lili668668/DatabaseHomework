var config = require('./dbConfig.js');
var mssql = require('mssql');

const sMember = "MEMBER";
const sProfessor = "PROFESSOR";
const sTa = "TA";
const sStudent = "STUDENT";
const sOrderMan = "ORDER_MAN";

// memeber
const sAccount = "account";
const sPassword = "password";
const sName = "name";
const sSsid = "SSID";
const sEmail = "email";
const sType = "status";

// PROFESSOR
const sProid = "proid";
const sOffice = "office";
const sGrade = "grade";

// TA
const sTaid = "TAID";
const sRoom = "room";

// STUDENT
const sSID = "SID";
const sClass = "class";

// ORDER_MAN
const sOrderid = "OrderID";

var connection = new sql.Connection(config);

function register_member(account, password, name, ssid, email, type) {
    connection.connect(function(err){
        if (err) {
            console.log(err);
            return;
        }

        var db = mssql.Request();

        var sql = `insert into ${sMember}(${sAccount}, ${sPassword}, ${sName}, ${sSsid}, ${sEmail}, ${sType}) values("${account}", "${password}", "${name}", "${ssid}", "${email}", "${type}")`;

        db.query(sql, function(err, recordset, affected){
            if (err) {
                console.log(err);
                return;
            }
            console.log(recordset);
            console.log(affected);
        });

        connection.close();
    });

}

function register_professor(account, password, name, ssid, email, type, proid, office, grade) {
    register_member(account, password, name, ssid, email, type);

    connection.connect(function(err){
        if (err) {
            console.log(err);
            return;
        }

        var db = mssql.Request();

        var sql = `insert into ${sProfessor}(${sAccount}, ${sProid}, ${sOffice}, ${sGrade}) values("${account}", "${proid}", "${office}", "${grade}")`;

        db.query(sql, function(err, recordset, affected){
            if (err) {
                console.log(err);
                return;
            }
            console.log(recordset);
            console.log(affected);
        });

        connection.close();
    });
}

function register_ta(account, password, name, ssid, email, type, taid, room) {
    register_member(account, password, name, ssid, email, type);

    connection.connect(function(err){
        if (err) {
            console.log(err);
            return;
        }

        var db = mssql.Request();

        var sql = `insert into ${sTa}(${sAccount}, ${sTaid}, ${sRoom}) values("${account}", "${taid}", "${room}")`;

        db.query(sql, function(err, recordset, affected){
            if (err) {
                console.log(err);
                return;
            }
            console.log(recordset);
            console.log(affected);
        });

        connection.close();
    });
}

function register_student(account, password, name, ssid, email, type, sid, class_) {
    register_member(account, password, name, ssid, email, type);

    connection.connect(function(err){
        if (err) {
            console.log(err);
            return;
        }

        var db = mssql.Request();

        var sql = `insert into ${sStudent}(${sAccount}, ${sSID}, ${sClass}) values("${account}", "${sid}", "${class_}")`;

        db.query(sql, function(err, recordset, affected){
            if (err) {
                console.log(err);
                return;
            }
            console.log(recordset);
            console.log(affected);
        });

        connection.close();
    });
}

function register_orderMan(account, password, name, ssid, email, type, orderid) {
    register_member(account, password, name, ssid, email, type);

    connection.connect(function(err){
        if (err) {
            console.log(err);
            return;
        }

        var db = mssql.Request();

        var sql = `insert into ${sOrderMan}(${sAccount}, ${sOrderid}) values("${account}", "${orderid}")`;

        db.query(sql, function(err, recordset, affected){
            if (err) {
                console.log(err);
                return;
            }
            console.log(recordset);
            console.log(affected);
        });

        connection.close();
    });
}

module.exports.register_professor = register_professor;
module.exports.register_ta = register_ta;
module.exports.register_student = register_student;
module.exports.register_orderMan = register_orderMan;
