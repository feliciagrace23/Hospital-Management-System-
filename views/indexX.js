$("h1").click(function(){
    $("h1").css("color", "blue");
});

$(document).ready(function () {
    // Get value on button click and show alert
    $("#myBtn").click(function () {
        var str = $("#myInput").val();
        alert(str);
    });
});