var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var cookie_session = require('cookie-session');
var bodyparser = require('body-parser');
var cc = require('config-multipaas');
var fs = require('fs');
var render = require('./tool/setHtml.js');
var db_insert = require('./db/insert.js');
var db_select = require('./db/select.js');

var app = express();
var server = http.createServer(app);
var io = socketio(server);
var config = cc();

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

app.use( bodyparser.json() );
app.use( bodyparser.urlencoded({
    extended: true
}) );
app.use( cookie_session({
    name: 'session',
    secret: process.env.npm_package_config_secret
}) );

app.get('/', function(request,response){
    if (request.session.login) {
        if (request.session.type == 'om') {
            var sendHtml = render.setButton(__dirname + "/html/login_index.html", "#insert", "GET", "/manage_book", "管理書籍");
            sendHtml = render.setHTMLButton(sendHtml, "#insert", "GET", "/manage_store", "管理書店");
            response.send(sendHtml);
        } else {
            response.sendFile(__dirname + "/html/login_index.html");
        }
    } else {
        response.sendFile(__dirname + "/index.html");
    }
});

app.get('/register', function(request, response){
    var setting = fs.readFileSync(__dirname + "/setting/register.json");
    var memebers = JSON.parse(setting)["memebers"];
    var values = [];
    for (var cnt = 0;cnt < memebers.length;cnt++) {
        values.push(memebers[cnt]["status"]);
    }
    var options = [];
    for (var cnt = 0;cnt < memebers.length;cnt++) {
        options.push(memebers[cnt]["name"]);
    }
    var sendHtml = render.setDroplist(__dirname + "/html/register.html", "#status", values, options);
    response.send(sendHtml);
});

app.get('/login', function(request, response){
    if (request.session.login) {
        response.redirect("/");
    } else if (request.session.logfail){
        var sendHtml = render.setText(__dirname + "/html/login.html", "#error", "帳密錯誤");
        response.send(sendHtml);
    } else {
        response.sendFile(__dirname + "/html/login.html");
    }
});

app.get('/member_center', function(request, response){
    if (request.session.login) {
        db_select.account_info(request.session.login, function(rows) {
            var sendHtml = render.setTexts(__dirname + "/html/member_center.html", ["#account", "#password", "#name", "#ssid", "#email", "#type", "#qcount"], [rows["Account"], rows["Password"], rows["Name"], rows["Ssid"], rows["Email"], rows["Status"], rows["QCount"]]);
            response.send(sendHtml);
        });
    } else {
        response.redirect('/');
    }
});

app.get('/manage_book', function(request, response){
    if (request.session.login && request.session.type == 'om') {
        response.sendFile(__dirname + '/html/manage_book.html');
    } else {
        response.redirect('/');
    }
});

app.get('/add_book', function(request, response){
    if (request.session.login && request.session.type == 'om') {
        response.sendFile(__dirname + '/html/add_book.html');
    } else {
        response.redirect('/');
    }
});

app.post('/add_book_process', function(request, response){
    var row = request.body;
    if (!row) {
        response.redirect('/manage_book');
        return;
    }
    
    db_insert.add_book(row.bookid, row.bookname, row.price, row.author, row.publisher);
    response.redirect('/manage_book');
});

app.post('/login_process', function(request, response){
    var row = request.body;
    db_select.verification_account(row.account, row.password, function(bool){
        if (bool) {
            request.session.login = row.account;
            db_select.getType(row.account, function(type){
                request.session.type = type;
            });
            response.redirect("/");
        } else {
            request.session.logfail = "fail";
            response.redirect("/login");
        }
    });
});

app.get('/logout', function(request, response){
    request.session.login = "";
    request.session.type = "";
    response.redirect("/");
});

app.post('/register_process', function(request, response){
    var row = request.body;
    var type = row.status;
    if (type == "professor") {
        db_insert.register_professor(row.account, row.password, row.name, row.ssid, row.email, "pr", row.proid, row.office, row.grade);
        request.session.type = "pr";
    } else if (type == "TA") {
        db_insert.register_ta(row.account, row.password, row.name, row.ssid, row.email, "ta", row.taid, row.room);
        request.session.type = "ta";
    } else if (type == "student") {
        db_insert.register_student(row.account, row.password, row.name, row.ssid, row.email, "st", row.sid, row.class);
        request.session.type = "st";
    } else if (type == "order_man") {
        db_insert.register_orderMan(row.account, row.password, row.name, row.ssid, row.email, "om", row.omid);
        request.session.type = "om";
    }

    request.session.login = row.account;

    response.redirect("/");

});

io.on('connection', function(socket){
    socket.on('status', function(msg) {
        var setting = fs.readFileSync(__dirname + "/setting/register.json");
        var memebers = JSON.parse(setting)["memebers"];

        for (var cnt = 0;cnt < memebers.length;cnt++) {
            if (msg == memebers[cnt]["status"]) {
                var sendmsg = {"other": memebers[cnt]["other"], "other_name": memebers[cnt]["other_name"]};
                socket.emit("re_status", sendmsg);
                break;
            }
        }
        
    });
    //io.emit('info', name + "上線，目前線上" + people_counter + "人");

});

server.listen(config.get('PORT'), config.get('IP'), function () {
    console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT')  )
});

