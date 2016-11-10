var config = require('./dbConfig.js');
var mssql = require('mssql');

const sMember = "MEMBER";
const sProfessor = "PROFESSOR";
const sTa = "TA";
const sStudent = "STUDENT";
const sOrderMan = "ORDER_MAN";

// memeber
const sAccount = "Account";
const sPassword = "Password";
const sName = "Name";
const sSsid = "SSID";
const sEmail = "Email";
const sType = "Status";
const sQcount = "QCount";

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

function register_member(account, password, name, ssid, email, type, otherSet) {

    var sql = `INSERT INTO ${sMember} ("${sAccount}", "${sPassword}", "${sName}", "${sSsid}", "${sEmail}", "${sType}", "${sQcount}") VALUES ('${account}', '${password}', '${name}', '${ssid}', '${email}', '${type}', 0);`;

    set(sql);
}

function register_professor(account, password, name, ssid, email, type, proid, office, grade, otherSet) {
    var sql = `insert into ${sProfessor}(${sAccount}, ${sProid}, ${sOffice}, ${sGrade}) values("${account}", "${proid}", "${office}", "${grade}")`;

    register_member(account, password, name, ssid, email, type, set(sql, otherSet));
}

function register_ta(account, password, name, ssid, email, type, taid, room, otherSet) {
    var sql = `insert into ${sTa}(${sAccount}, ${sTaid}, ${sRoom}) values("${account}", "${taid}", "${room}")`;

    register_member(account, password, name, ssid, email, type, set(sql, otherSet));

}

function register_student(account, password, name, ssid, email, type, sid, class_, otherSet) {
    var sql = `insert into ${sStudent}(${sAccount}, ${sSID}, ${sClass}) values("${account}", "${sid}", "${class_}")`;

    register_member(account, password, name, ssid, email, type, set(sql, otherSet));
}

function register_orderMan(account, password, name, ssid, email, type, orderid, otherSet) {
    var sql = `insert into ${sOrderMan}(${sAccount}, ${sOrderid}) values("${account}", "${orderid}")`;
    register_member(account, password, name, ssid, email, type);
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

            //console.log(mydb);

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
                    }
                    console.log("commited");
                });
            });

        });
    });

    //if (callback && callback.typeof === 'function') {
        //callback();
    //}
}

module.exports.register_professor = register_professor;
module.exports.register_ta = register_ta;
module.exports.register_student = register_student;
module.exports.register_orderMan = register_orderMan;
