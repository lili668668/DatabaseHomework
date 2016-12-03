var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var cookie_session = require('cookie-session');
var bodyparser = require('body-parser');
var cc = require('config-multipaas');
var fs = require('fs');

var render = require('./tool/setHtml.js');
var tool = require('./tool/string_tool.js');
var db_insert = require('./db/insert.js');
var db_select = require('./db/select.js');
var db_update = require('./db/update.js');

var app = express();
var server = http.createServer(app);
var io = socketio(server);
var config = cc();

const mapStus = {"pr": "professor", "ta": "TA", "st": "student", "om": "order_man"};

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
            sendHtml = render.setHTMLButton(sendHtml, "#insert", "GET", "/manage_bookstore", "管理書店");
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
            var stu = rows["Status"];

            var titles = ["帳號", "名字", "身分證字號", "Email", "訂購次數"];
            var texts = [rows["Account"], rows["Name"], rows["SSID"], rows["Email"], rows["QCount"]];

            if (stu == "pr") {
                db_select.professor_info(request.session.login, function(res){
                    titles.push("身分", "教師代碼", "辦公室", "職等");
                    texts.push("教授", res["Proid"], res["Office"], res["Grade"]);
                    var sendHtml = render.setTexts(__dirname + "/html/member_center.html", "#fill", titles, texts);
                    response.send(sendHtml);
                });
            } else if (stu == "st") {
                db_select.student_info(request.session.login, function(res){
                    titles.push("身分", "學生代碼", "班級");
                    texts.push("學生", res["SID"], res["Class"]);
                    var sendHtml = render.setTexts(__dirname + "/html/member_center.html", "#fill", titles, texts);
                    response.send(sendHtml);
                });
            } else if (stu == "ta") {
                db_select.ta_info(request.session.login, function(res){
                    titles.push("身分", "助教代碼", "實驗室");
                    texts.push("助教", res["TAID"], res["Room"]);
                    var sendHtml = render.setTexts(__dirname + "/html/member_center.html", "#fill", titles, texts);
                    response.send(sendHtml);
                });
            } else if (stu == "om") {
                db_select.orderMan_info(request.session.login, function(res){
                    titles.push("身分", "銷售員代碼");
                    texts.push("銷售員", res["OMID"]);
                    var sendHtml = render.setTexts(__dirname + "/html/member_center.html", "#fill", titles, texts);
                    response.send(sendHtml);
                });
            }
        });
    } else {
        response.redirect('/');
    }
});

app.get('/update_member', function(request, response){
    if (request.session.login) {
        db_select.account_info(request.session.login, function(rows) {
            var stu = rows["Status"];
            var setting = fs.readFileSync(__dirname + "/setting/register.json");
            var memebers = JSON.parse(setting)["memebers"];

            var fillid = ["#name", "#ssid", "#email"];
            var content = [rows["Name"], rows["SSID"], rows["Email"]];
            var resHTML = "";
            for (var cnt = 0;cnt < memebers.length;cnt++) {
                if (mapStus[stu] == memebers[cnt]["status"]) {
                    resHTML = render.setStatusItem(__dirname + "/html/update_member.html", "#other", memebers[cnt]["other"], memebers[cnt]["other_name"]);
                    break;
                }
            }

            if (stu == "pr") {
                db_select.professor_info(request.session.login, function(res){
                    fillid.push("#proid", "#office", "#grade");
                    content.push(res["Proid"], res["Office"], res["Grade"]);
                    var sendHtml = render.fillBlank(resHTML, fillid, content);
                    response.send(sendHtml);
                });
            } else if (stu == "st") {
                db_select.student_info(request.session.login, function(res){
                    fillid.push("#sid", "#class");
                    content.push(res["SID"], res["Class"]);
                    var sendHtml = render.fillBlank(resHTML, fillid, content);
                    response.send(sendHtml);
                });
            } else if (stu == "ta") {
                db_select.ta_info(request.session.login, function(res){
                    fillid.push("#taid", "#room");
                    content.push(res["Taid"], res["Room"]);
                    var sendHtml = render.fillBlank(resHTML, fillid, content);
                    response.send(sendHtml);
                });
            } else if (stu == "om") {
                db_select.orderMan_info(request.session.login, function(res){
                    fillid.push("#omid");
                    content.push(res["OMID"]);
                    var sendHtml = render.fillBlank(resHTML, fillid, content);
                    response.send(sendHtml);
                });
            }
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
        db_select.orderMan_get_bookstore(request.session.login, function(row) {
            db_select.getAllBookstores(function(rows) {
                var bookstoreId_array = [];
                for (var cnt = 0;cnt < rows.length;cnt++) {
                    bookstoreId_array.push(rows[cnt]['BSID']);
                }
                var bookstoreName_array = [];
                for (var cnt = 0;cnt < rows.length;cnt++) {
                    bookstoreName_array.push(rows[cnt]['BSName']);
                }

                var sendstr = render.setAddBook_Bookstore(
                        __dirname + '/html/add_book.html',
                        '#bookstore_info',
                        row,
                        bookstoreId_array,
                        bookstoreName_array);
                response.send(sendstr);
            });
        });
    } else {
        response.redirect('/');
    }
});

app.post('/add_book_process', function(request, response){
    if (request.session.login && request.session.type == 'om') {
        var row = request.body;
        if (!row) {
            response.redirect('/manage_book');
            return;
        }

        db_insert.add_book(row.id, row.name, row.price, row.author, row.publisher, row.bookstore);
        response.redirect('/manage_book');
    } else {
        response.redirect('/');
    }
});

app.get('/manage_bookstore', function(request, response) {
    if (request.session.login && request.session.type == 'om') {
        db_select.orderMan_get_bookstore(request.session.login, function(row){
            var sendstr = "";
            if (row) {
                var titles = ["目前所屬書店:", "書店名稱:", "書店城市:", "書店電話:"];
                var texts = [row["BSID"], row["BSName"], row["City"], row["BSPhone"]];
                sendstr = render.setTexts(__dirname + '/html/manage_bookstore.html', '#info', titles, texts);
            } else {
                sendstr = render.setButton(__dirname + '/html/manage_bookstore.html', '#add_bookstore', "GET", "/add_bookstore", "新增書店");
            }
            response.send(sendstr);
        });
    } else {
        response.redirect('/');
    }

});

app.get('/add_bookstore', function(request, response) {
    if (request.session.login && request.session.type == 'om') {
        response.sendFile(__dirname + '/html/add_bookstore.html');
    } else {
        response.redirect('/');
    }
});

app.post('/add_bookstore_process', function(request, response) {
    if (request.session.login && request.session.type == 'om') {
        var row = request.body;
        if (!row) {
            response.redirect('/manage_bookstore');
        } else {
            db_insert.add_bookstore(row.id, row.name, row.city, row.phone, request.session.login);
            response.redirect('/manage_bookstore');
        }
    } else {
        response.redirect('/');
    }
});

app.get('/inquire_book', function(request, response){
    if (request.session.login) {
        db_select.getAllBookstores(function(rows){
            var bsid = [];
            rows.forEach(function(element, index, array) {
                bsid.push(element["BSID"]);
            });
            var bsname = [];
            rows.forEach(function(element, index, array) {
                bsname.push(element["BSName"]);
            });
            var sendstr = render.setDroplist(__dirname + '/html/inquire_book.html', '#bookstore', bsid, bsname);
            if (request.session.bookids) {
                sendstr = render.setHTMLText(sendstr, "#book_num", request.session.bookids.length);
            } else {
                sendstr = render.setHTMLText(sendstr, "#book_num", 0);
            }
            response.send(sendstr);
        });
    } else {
        response.redirect('/');
    }
});

app.get('/add_order', function(request, response) {
    if (request.session.login) {
        var bsids = request.session.bsids;
        var bookids = request.session.bookids;
        var counts = request.session.counts;
        if (bsids && bookids) {
            db_select.books_info(bsids, bookids, function(rows){
                var sendstr = render.setShopcarTable(__dirname + '/html/add_order.html', "#table", rows, bsids, bookids, counts);
                response.send(sendstr);
            });
        } else {
            var sendstr = render.setText(__dirname + '/html/add_order.html', '#table', "沒有商品資料");
            response.send(sendstr);
        }
    } else {
        response.redirect('/');
    }
});

app.get('/add_order_process', function(request, response) {
    if (request.session.login) {
        var bsids = request.session.bsids;
        var bookids = request.session.bookids;
        var counts = request.session.counts;
        db_select.books_info(bsids, bookids, function(rows){
            var all_price = 0;
            rows.forEach(function(element, index, array) {
                var countindex = render.shopcar_findcountindex(bsids, bookids, element["BSID"][0], element["BookID"][0]);
                var count = counts[countindexa];
                all_price += parseInt(element["Price"]) * count;
            });
            db_select.getOrderNo(function(id){
                var no = "B" + id;
                db_insert.add_order(no, request.session.login, bsids, bookids, counts, all_price);
                response.redirect('/add_order_cancel');
            });
        });
    } else {
        response.redirect('/');
    }
});

app.get('/add_order_cancel', function(request, response) {
    request.session.bsids = undefined;
    request.session.bookids = undefined;
    request.session.counts = undefined;
    response.redirect('/inquire_book.html');
});

app.post('/login_process', function(request, response){
    var row = request.body;
    db_select.verification_account(row.account, row.password, function(bool){
        if (bool) {
            request.session.login = row.account;
            db_select.getType(row.account, function(type){
                request.session.type = type;
                response.redirect("/");
            });
        } else {
            request.session.logfail = "fail";
            response.redirect("/login");
        }
    });
});

app.get('/logout', function(request, response){
    request.session.login = undefined;
    request.session.type = undefined;
    request.session.logfail = undefined;
    request.session.bsids = undefined;
    request.session.bookids = undefined;
    request.session.counts = undefined;
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

app.post('/update_member_process', function(request, response){
    var row = request.body;
    var type = mapStus[request.session.type];
    if (type == "professor") {
        db_update.update_professor(request.session.login, row.name, row.ssid, row.email, row.proid, row.office, row.grade);
    } else if (type == "TA") {
        db_update.update_ta(request.session.login, row.name, row.ssid, row.email, row.taid, row.room);
    } else if (type == "student") {
        db_update.update_student(request.session.login, row.name, row.ssid, row.email, row.sid, row.class);
    } else if (type == "order_man") {
        db_update.update_orderMan(request.session.login, row.name, row.ssid, row.email, row.omid);
    }

    response.redirect("/");

});

app.get('/add_shopping_car', function(request, response){
    var session = request.session;
    if (session.login) {
        if (!session.bsids) {
            session.bsids = [];
        }
        if (!session.bookids) {
            session.bookids = [];
        }
        if (!session.counts) {
            session.counts = [];
        }

        var index = render.shopcar_findcountindex(session.bsids, session.bookids, request.query["bsid"], request.query["bookid"]);
        if (index < 0) {
            session.bsids.push(request.query["bsid"]);
            session.bookids.push(request.query["bookid"]);
            session.counts.push(parseInt(request.query["count"]));
        } else {
            session.bsids.push(request.query["bsid"]);
            session.counts[index] = session.counts[index] + parseInt(request.query["count"]);
        }

        response.format({
            text: function() {
                response.send(request.session.bookids.length + "");
            }
        });
        response.end();
    } else {
        response.redirect('/');
    }
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

    socket.on('update_member_ok', function(msg){
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

    socket.on('checkBookExist', function(msg){
        db_select.book_store_exist(msg['bsid'], msg['bookid'], function(flag) {
            socket.emit('checkBookRes', flag);
        });
    });

    socket.on('checkAccountExist', function(msg){
        db_select.account_exist(msg, function(flag){
            socket.emit('checkAccountRes', flag);
        });
    });

    socket.on('checkBookstoreExist', function(msg){
        db_select.bookstore_exist(msg, function(flag){
            socket.emit('checkBookstoreRes', flag);
        });
    });

    socket.on("inquire_book", function(msg){
        var bsid = msg["bsid"];
        var bookname = msg["bookname"];
        var booknames = tool.split(bookname, " ");

        var bsid_exist = (bsid != "none");
        var booknames_exist = (booknames[0] != "");

        if (bsid_exist && booknames_exist) {
            db_select.bsid_booknames_inquire_book(bsid, booknames, function(rows){
                socket.emit("re_inquire_book", rows);
            });
        } else if (bsid_exist) {
            db_select.bsid_inquire_book(bsid, function(rows){
                socket.emit("re_inquire_book", rows);
            });
        } else if (booknames_exist) {
            db_select.booknames_inquire_book(booknames, function(rows){
                socket.emit("re_inquire_book", rows);
            });
        } else {
            socket.emit("re_inquire_book", []);
        }
    });

    //io.emit('info', name + "上線，目前線上" + people_counter + "人");

});

server.listen("8800", config.get('IP'), function () {
    console.log( "Listening on " + config.get('IP') + ", port " + "8800");
});

