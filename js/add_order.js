var socket = io();
$(function(){
    $(".delete").click(function(){
        var button = $(this);

        var msg = {"bsid": button.parent(".parent").siblings("#bsid").text(),
            "bookid": button.parent(".parent").siblings("#bookid").text() };
        var request = $.ajax({
            url: '/update_order_delete_line',
            method: 'GET',
            data: msg,
            dataType: "text"
        });
        request.done(function(res) {
            if (res != "") {
                $("#all_price").text(res);
                button.parent(".parent").parent("tr").remove();
                $("#update_info").text("刪除成功");
            } else {
                $("#update_info").text("刪除失敗，找不到條目");
            }
        });
    });
});

