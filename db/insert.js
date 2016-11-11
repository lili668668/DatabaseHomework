var config = require('./dbConfig.js');
var mssql = require('mssql');

const sMember = 'MEMBER';
const sProfessor = 'PROFESSOR';
const sTa = 'TA';
const sStudent = 'STUDENT';
const sOrderMan = 'ORDER_MAN';

// memeber
const sAccount = 'account';
const sPassword = 'password';
const sName = 'name';
const sSsid = 'ssid';
const sEmail = 'email';
const sType = 'status';
const sQcount = 'qcount';
const initQcount = 0;

// PROFESSOR
const sProid = 'proid';
const sOffice = 'office';
const sGrade = 'grade';

// TA
const sTaid = 'taid';
const sRoom = 'room';

// STUDENT
const sSID = 'sid';
const sClass = 'class';

// ORDER_MAN
const sOrderManid = 'omid';

function register_member(account, password, name, ssid, email, type, otherSet) {

    var sql = `INSERT INTO ${sMember} (${sAccount}, ${sPassword}, ${sName}, ${sSsid}, ${sEmail}, ${sType}, ${sQcount}) VALUES ('${account}', '${password}', '${name}', '${ssid}', '${email}', '${type}', ${initQcount});`;

    set(sql);
}

function register_professor(account, password, name, ssid, email, type, proid, office, grade, otherSet) {
    var sql = `insert into ${sProfessor}(${sAccount}, ${sProid}, ${sOffice}, ${sGrade}) values('${account}', '${proid}', '${office}', '${grade}')`;

    register_member(account, password, name, ssid, email, type, set(sql, otherSet));
}

function register_ta(account, password, name, ssid, email, type, taid, room, otherSet) {
    var sql = `insert into ${sTa}(${sAccount}, ${sTaid}, ${sRoom}) values('${account}', '${taid}', '${room}')`;

    register_member(account, password, name, ssid, email, type, set(sql, otherSet));

}

function register_student(account, password, name, ssid, email, type, sid, class_, otherSet) {
    var sql = `insert into ${sStudent}(${sAccount}, ${sSID}, ${sClass}) values('${account}', '${sid}', '${class_}')`;

    register_member(account, password, name, ssid, email, type, set(sql, otherSet));
}

function register_orderMan(account, password, name, ssid, email, type, ordermanid, otherSet) {
    var sql = `insert into ${sOrderMan}(${sAccount}, ${sOrderManid}) values('${account}', '${ordermanid}')`;
    register_member(account, password, name, ssid, email, type, set(sql, otherSet));
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
                    }
                    console.log('commited');
                });
            });

        });
    });

}

module.exports.register_professor = register_professor;
module.exports.register_ta = register_ta;
module.exports.register_student = register_student;
module.exports.register_orderMan = register_orderMan;
