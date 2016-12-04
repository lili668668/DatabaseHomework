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

    $(".count").change(function(){
        var input = $(this);
        var num = parseInt(input);
        if (!isNaN(num) || num <= 0) {
            input.val(0);
        }
            
        var msg = {"bsid": input.parent("#c").siblings("#bsid").text(), "bookid": input.parent("#c").siblings("#bookid").text(), "count": input.val()};

        var request = $.ajax({
            url: "/update_order_change_line",
            method: "GET",
            data: msg,
            dataType: "text"
        });

        request.done(function(res){
            var prices = res.split(",");
            input.parent("#c").siblings(".linePrice").text(prices[0]);
            $("#all_price").text(prices[1]);
        });
    });
});

