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
    $("#info").empty();
    if (msg.length == 0) {
        $("#info").append("<p>查無此資料</p>");
    } else {
        msg.forEach(function(element, index, array){
            var info = 
                `
                <div>
                    <p>書號:</p><span id="bookid">${element["BookID"][0]}</span>
                    <p>書名:${element["BookName"]}</p>
                    <p>出版商:${element["Publisher"]}</p>
                    <p>書店號:</p><span id="bsid">${element["BSID"][0]}</span>
                    <p>書店:${element["BSName"]}</p>
                    <p>價格:${element["Price"]}</p>
                    <span>訂購數量:</span><input type="number" id="count"></input>
                    <button class="add_shopping_car">下單</button>
                </div>
                `;
            $("#info").append(info);
        });
        $(".add_shopping_car").click(function(){
            var newbsid = $(this).siblings("#bsid").text()
            var newbookid = $(this).siblings("#bookid").text();
            var newcount = parseInt($(this).siblings("#count").val());

            if (!isNaN(newcount) && newcount > 0) {

                var newmsg = {"bsid": newbsid, "bookid": newbookid, "count": newcount};
                var request = $.ajax({
                    url: "/add_shopping_car",
                    method: "GET",
                    data: newmsg,
                    dataType: "text"
                });
                request.done(function(res){
                    console.log(res);
                    $("#book_num").text(res);
                });
            }

        });
    }
});
