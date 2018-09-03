$(function(){
	if($("#username").get(0).placeholder=="输入邮箱"){
		var user_REG =/^\w+@\w+(\.\w+)+$/;	//判断用户名是不是正确格式的邮箱帐号
	}else{
		var user_REG = /^1\d{10}$/; //判断用户名是不是正确格式的手机号码
	}
	
	var $usn="";
	var $pwd="";
	var $confirm="";
	$("#regiestering").click(function(){
		//获取登录名和密码以及验证框内容
		$usn=$("#username").val();
		$pwd=$("#password").val();
		$confirm=$("#confirm").val();
		//判断用户名栏是不是空
		if($usn==""){
			$("#userError").html("请输入此字段！")
			$("#userError").css("display","block");
			return;		//	return表示跳过直接中断该函数，下面语句都不在执行
		}
		//判断用户名格式是否正确
		if(user_REG.test($usn)){
			$("#userError").css("display","none");
		}else{
			$("#userError").html("请匹配要求的格式")
			$("#userError").css("display","block");
			return;	
		}
		//判断密码框是不是空
		if($pwd==""){
			$("#pwdError").css("display","block");
			return;
		}
		//判断确认密码框是不是空
		if($confirm==""){
			$("#confirmError").css("display","block");
			return;
		}
		//判断已阅读协议是否选中
		if(!$("#check").get(0).checked){
			$.cookie("whereFalse","请选择同意《嘉丽购物网服务条款》",{path:"/"});
			window.location.href="../isLogin/isLogin.html";
			return;
		}
		//判断用户名是不是注册过了
		var registeredStr=$.cookie("registeredUsers")?$.cookie("registeredUsers"):"{}";
		registeredObj=JSON.parse(registeredStr);
		for(var id in registeredObj){
			if(id==$usn){
				$.cookie("whereFalse","操作失败！已存在的用户名。。",{path:"/"});
				window.location.href="../isLogin/isLogin.html";
				return;
			}
		}
		//如果两次密码不相同，就提示数据出错
		if($confirm!=$pwd){
			$.cookie("whereFalse","两次输入的密码不一致！请重新输入。。",{path:"/"});
			window.location.href="../isLogin/isLogin.html";
			return;
		}
		//没有注册过，也无其他错误，那就注册一下，并保存到cookie中
		registeredObj[$usn]=$pwd;
		registeredStr = JSON.stringify(registeredObj);
		$.cookie("registeredUsers",registeredStr,{expires:1000,path:"/"});
		$.cookie("loginedUser",$usn,{expires:1000,path:"/"});
		$.cookie("whereFalse","注册成功，为你跳转到主页。。",{path:"/"});
		window.location.href="../isLogin/isLogin.html";
		return;
	});
	//给用户名输入框定义一个聚焦事件
	$(".register form input").focus(function(){
		$(".register form h2").css("display","none");
	});
	
	//给回车按钮定义一个点击事件，使其等价于点击注册按钮
	$(document).keydown(function(e){
		if(e.keyCode==13){
			$("#regiestering").click();
		}
	});
});
















