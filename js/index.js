var socket = io();
$(function(){
    $(".update").click(function(){
        var button = $(this);

        console.log(button.siblings(".target").children(".OrderNo").text());
        var msg = {"OrderNo": button.siblings(".target").children(".OrderNo").text()};
        var request = $.ajax({
            url: '/update_half',
            method: 'GET',
            data: msg,
            dataType: "text"
        });
        request.done(function(res) {
            window.location.replace("/update_order");
        });
    });

});

