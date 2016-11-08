var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var bodyparser = require('body-parser');
var cc = require('config-multipaas');

var app = express();
var server = http.createServer(app);
var io = socketio(server);
var config = cc();

var people_counter = 0;
var name;

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

io.on('connection', function(socket){
    //socket.on('message', function(msg){
    //});	

    //socket.emit('name', name);
    //io.emit('info', name + "上線，目前線上" + people_counter + "人");

});

server.listen(config.get('PORT'), config.get('IP'), function () {
    console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT')  )
});

