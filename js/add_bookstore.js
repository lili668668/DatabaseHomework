var socket = io();
$(function(){
    setCheck("#id", function(){
        return $("#id").val().length < 1;
    }, "#checkId", "請輸入書店編號");
    
    setCheck("#name", function(){
        return $("#name").val().length < 1;
    }, "#checkName", "請輸入書店名稱");
    
    setCheck("#city", function(){
        return $("#city").val().length < 1;
    }, "#checkCity", "請輸入所在城市");

    setCheck("#phone", function(){
        return $("#phone").val().length < 1;
    }, "#checkPhone", "請輸入電話");
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
