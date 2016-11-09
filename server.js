var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var bodyparser = require('body-parser');
var cc = require('config-multipaas');
var fs = require('fs');
var render = require('./tool/setHtml.js');

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

io.on('connection', function(socket){
    //socket.on('message', function(msg){
    //});	

    //socket.emit('name', name);
    //io.emit('info', name + "上線，目前線上" + people_counter + "人");

});

server.listen(config.get('PORT'), config.get('IP'), function () {
    console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT')  )
});

