var socket = io();
$(function(){
    setCheck("#account", function(){
        return $("#account").val().length < 1;
    }, "#checkAccount", "請輸入帳號");
    
    setCheck("#password", function(){
        return $("#password").val().length < 4;
    }, "#checkPassword", "密碼至少四碼");
    
    setCheck("#againPassword", function(){
        return $("#againPassword").val() != $("#password").val();
    }, "#checkAgainPassword", "與密碼不合");
    
    setCheck("#name", function(){
        return $("#name").val().length < 1;
    }, "#checkName", "請輸入名字");
    
    setCheck("#ssid", function(){
        var re = new RegExp("^[A-Z]\\d{9}");
        return !re.test($("#ssid").val());
    }, "#checkSsid", "身分證字號格式不對");
    
    setCheck("#email", function(){
        var re = new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z]+$");
        return !re.test($("#email").val());
    }, "#checkEmail", "Email格式不合");


    $("#status").change(function() {
        if ( $( this ).val() == "none" ) {
            $("#checkStatus").text("請選擇一個身分");
            $("#other").empty();
        } else {
            $("#checkStatus").text("");
            socket.emit("status", $( this ).val());
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

socket.on("re_status", function(msg){
    $("#other").empty();
    var other = msg["other"];
    var other_name = msg["other_name"];
    for (var cnt = 0;cnt < other.length;cnt++) {
        var str1 = `<p>${other_name[cnt]}</p>`;
        var str2 = `<input type="text" id="${other[cnt]}" name="${other[cnt]}">`;
        var str3 = `<p class="check" id="check_${other[cnt]}"></p>`
        $("#other").append(str1);
        $("#other").append(str2);
        $("#other").append(str3);

        setCheck(`"#${other[cnt]}"`, function(){
            return $(`"#${other[cnt]}"`).val().length < 1;
        }, `"#check_${other}[cnt]"`, "請勿留空");
    }
});
