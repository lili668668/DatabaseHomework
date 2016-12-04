var socket = io();
$(function(){
    
    setCheck("#name", function(){
        return $("#name").val().length < 1;
    }, "#checkName", "請輸入書籍名稱");
    
    setCheck("#author", function(){
        return $("#author").val().length < 1;
    }, "#checkAuthor", "請輸入作者");

    setCheck("#price", function(){
        return $("#price").val().length < 1 && $("#price").val() < 0;
    }, "#checkPrice", "請輸入正數");
    
    setCheck("#publisher", function(){
        return $("#publisher").val().length < 1;
    }, "#checkPulisher", "請輸入出版商");

    $("#bookstore").change(function() {
        if ( $( this ).val() == "none" ) {
            $("#checkBookstore").text("請去新增書店");
        } else {
            $("#checkStatus").text("");
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

