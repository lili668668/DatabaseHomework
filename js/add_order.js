var socket = io();
$(function(){
    $("#bookstore").change(function() {
        if ( $( this ).val() == "none" ) {
            $("#checkBookstore").text("請選擇一家書店");
        } else {
            $("#checkStatus").text("");
            socket.emit("openBook", $(this).val());
        }
        checkSubmit();
    })
    .change();
});

function setCheck(id, check, warningid, warning) {
    $(id).keyup(function(){
        var bool = check();
        if (bool) {
            $(warningid).text(warning);
        } else {
            $(warningid).text("");
        }

        checkSubmit();
    })
    .keyup();

}

function checkSubmit() {
    let flag = true;
    $(".check").each(function(){
        if ( $( this ).text() != "" ) {
            flag = false;
            return;
        }
        return;
    });
    if (flag) {
        $("#submit").prop("disabled", false);
    } else {
        $("#submit").prop("disabled", true);
    }
}

var all_book_info = [];

socket.on("openBookRes", function(msg){
    all_book_info = msg;

    var str = '<p>請問購買幾種書？</p><input name="bookSpeciesNum" id="bookSpeciesNum" type="number"><p id="checkBookSpeciesNum"></p>';
    $("#books_info1").append(str);
    $("#bookSpeciesNum").keyup(function(){
        var tmp = $(this).val();
        var num = parseInt(tmp);
        if (isNaN(num)) {
            $("#checkBookSpeciesNum").text("請輸入至少一本書");
        } else if (num < 1) {
            $("#bookSpeciesNum").text("請輸入正數");
        } else {
            console.log()
            /*for (var cnt = 0;cnt < num;cnt++) {
                var str = 
                    `<div class="book_info">
                        <select name="book_option${cnt}" id="book_option${cnt}" class="book_option">
                            <option value="none" selected>請選擇書籍</option>';
                for (var cnt2 = 0;cnt2 < msg["bookInfo"].length;cnt2++) {
                    var another = `<option value="${msg['bookInfo'][cnt2]['BookID']}">${msg['book_info'][cnt2]['BookId']}</option>`;
                    str += another;
                }
                str += "</select></div>";
                $("#books_info2").empty();
                $("#books_info2").append(str);
            }*/
        }
    })
    .keyup();
});
