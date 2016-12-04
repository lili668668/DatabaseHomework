var socket = io();
$(function(){
    $("#inquire").click(function() {
        var bsid = $("#bookstore").val();
        var bookname = $("#book").val();
        var msg = {"bsid": bsid, "bookname": bookname};
        socket.emit("inquire_book", msg);
    });
});

socket.on("re_inquire_book", function(msg){
    var rows = msg;
    $("#info").empty();
    if (rows.length == 0) {
        $("#info").append("<p>查無此資料</p>");
    } else {
        var header = 
            `
                <tr>
                    <th>書號</th>
                    <th>書名</th>
                    <th>作者</th>
                    <th>出版商</th>
                    <th>書店號</th>
                    <th>書店</th>
                    <th>價格</th>
                    <th>訂購數量</th>
                    <th>下單</th>
                </tr>
            `;
        $("#info").append(header);
        var presame = false;
        var len = rows.length;
        var body = "";
        rows.forEach(function(element, index, array){
            var last =  index == len - 1;
            var nextsame = false;
            if (!last) {
                nextsame = (element["BookID"][0] == array[index + 1]["BookID"][0] && 
                        element["BSID"][0] == array[index + 1]["BSID"][0]);
            }

            if (!presame && last) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"][0]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td id="bsid">${element["BSID"][0]}</td>
                        <td>${element["BSName"]}</td>
                        <td>${element["Price"]}</td>
                        <td id="c"><input type="number" id="count"></input></td>
                        <td class="parent"><button class="add_shopping_car">下單</button></td>
                    </tr>
                    `;
                body += info;

            } else if (presame && last) {
                var info = 
                    `
                        , ${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td id="bsid">${element["BSID"][0]}</td>
                        <td>${element["BSName"]}</td>
                        <td>${element["Price"]}</td>
                        <td id="c"><input type="number" id="count"></input></td>
                        <td class="parent"><button class="add_shopping_car">下單</button></td>
                    </tr>
                    `;
                body += info;

            } else if (!presame && !nextsame) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"][0]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td id="bsid">${element["BSID"][0]}</td>
                        <td>${element["BSName"]}</td>
                        <td>${element["Price"]}</td>
                        <td id="c"><input type="number" id="count"></input></td>
                        <td class="parent"><button class="add_shopping_car">下單</button></td>
                    </tr>
                    `;
                body += info;
                presame = false;
                
            } else if (!presame && nextsame) {
                var info = 
                    `
                    <tr>
                        <td id="bookid">${element["BookID"][0]}</td>
                        <td>${element["BookName"]}</td>
                        <td>${element["Name"]}
                    `;
                body += info;
                presame = true;
            } else if (presame && !nextsame) {
                var info = 
                    `
                        , ${element["Name"]}</td>
                        <td>${element["Publisher"]}</td>
                        <td id="bsid">${element["BSID"][0]}</td>
                        <td>${element["BSName"]}</td>
                        <td>${element["Price"]}</td>
                        <td id="c"><input type="number" id="count"></input></td>
                        <td class="parent"><button class="add_shopping_car">下單</button></td>
                    </tr>
                    `;
                body += info;
                presame = false;

            } else if (presame && nextsame) {
                var info = ", " + element["Name"];
                body += info;
                presame = true;
            }

        });
        $("#info").append(body);

        $(".add_shopping_car").click(function(){
            var newbsid = $(this).parent(".parent").siblings("#bsid").text();
            var newbookid = $(this).parent(".parent").siblings("#bookid").text();
            var newcount = parseInt($(this).parent(".parent").siblings("#c").children("#count").val());

            if (!isNaN(newcount) && newcount > 0) {

                var newmsg = {"bsid": newbsid, "bookid": newbookid, "count": newcount};
                var request = $.ajax({
                    url: "/add_shopping_car",
                    method: "GET",
                    data: newmsg,
                    dataType: "text"
                });
                request.done(function(res){
                    $("#book_num").text(res);
                });
            }

        });
    }
});
