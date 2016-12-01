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

socket.on("openBookRes", function(msg){
    var str = '<p>請問購買幾種書？</p><input name="bookSpeciesNum" id="bookSpeciesNum" type="number"><p id="checkBookSpeciesNum"></p>';
    $("#books_info").append(str);
    $("#bookSpeciesNum").keyup(function(){
        var tmp = $(this).val();
        if (tmp < 1) {
            $("#checkBookSpeciesNum").text("請輸入至少一本書");
        } else if (isNaN(parseInt(tmp))) {
            $("#bookSpeciesNum").text("請輸入正數");
        } else {
            var str = 
                `<div>`;
        }
    })
    .keyup();
});
