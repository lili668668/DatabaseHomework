$(function(){
    $("#againPassword").keyup(function(){
        var value = $( this ).val();
        var password = $( "#password" ).val();
        console.log(value);
        console.log(password);
        console.log(value != password);
        if (value != password) {
            $( "#checkPassword" ).css("display", "block");
        } else {
            $( "#checkPassword" ).css("display", "none");
        }
        
    })
    .keyup();
});
