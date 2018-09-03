window.onload = function() {
    var payBtn = document.getElementById("payBtn");
    var box = document.getElementById("box");
    var myImg = document.createElement('img');
    myImg.src = "http://api.k780.com:88/?app=qr.get" +
        "&data=" + "你还真想付钱啊" +
        "&level=L&size=16";
    box.appendChild(myImg);

};