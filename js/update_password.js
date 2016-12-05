var socket = io();
$(function(){
    setCheck("#newpassword", function(){
        return $("#newpassword").val().length < 4;
    }, "#checkNewPassword", "密碼至少四碼");
    
    setCheck("#againPassword", function(){
        return $("#againPassword").val() != $("#newpassword").val();
    }, "#checkAgainPassword", "與新密碼不合");
    
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
