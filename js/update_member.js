var socket = io();
$(function(){
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

    $(".other").each(function(){
        $( this ).keyup(function(){
            var bool = $( this ).val().length < 1;
            var warningid = "#check_" + $( this ).attr("id");
            if ( bool ) {
                $(warningid).text("請勿留白");
            } else {
                $(warningid).text("");
            }

            checkSubmit();
        })
        .keyup();
    });

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

