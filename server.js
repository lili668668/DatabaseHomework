var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var bodyparser = require('body-parser');
var cc = require('config-multipaas');
var fs = require('fs');
var render = require('./tool/setHtml.js');
var db_insert = require('./db/insert.js');

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

app.get('/', function(request,response){
    response.sendFile(__dirname + "/index.html");
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

app.post('/register_process', function(request, response){
    var row = request.body;
    var type = row.status;
    if (type == "professor") {
        db_insert.register_professor(row.account, row.password, row.name, row.ssid, row.email, "pr", row.proid, row.office, row.grade);
    } else if (type == "TA") {
        db_insert.register_ta(row.account, row.password, row.name, row.ssid, row.email, "ta", row.taid, row.room);
    } else if (type == "student") {
        db_insert.register_student(row.account, row.password, row.name, row.ssid, row.email, "st", row.sid, row.class);
    } else if (type == "order_man") {
        db_insert.register_orderMan(row.account, row.password, row.name, row.ssid, row.email, "om", row.omid);
    }

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

