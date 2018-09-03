$(function(){
	//以下是判断是否已有用户登录
	//获取cookie中的registeredUsers,验证是否有用户登陆成功
	var loginedUserStr=$.cookie("loginedUser")?$.cookie("loginedUser"):"";
	if(loginedUserStr==""){
		$("#toLogin").css("display","block");
		$("#logined").css("display","none");
	}else{
		$("#logined span").html(loginedUserStr);
		$("#toLogin").css("display","none");
		$("#logined").css("display","block");
	}
	$("#loginOut").click(function(){
		$.removeCookie("loginedUser",{path:"/"});
		window.location.href="../register/login.html";
	});
});
	