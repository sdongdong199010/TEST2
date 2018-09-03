$(function(){
	//当以前勾选过自动登录时，就自动跳转到首页
	//获取cookie中的loginedUser
	var loginedStr=$.cookie("loginedUser")?$.cookie("loginedUser"):"{}";
	//如果有loginedUser信息，就跳转到主页
	if(loginedStr!="{}"){
		//window.location.href="../index.html";
	}
});


$(function(){
	// 写一个函数，用于生成随机的四位数字验证码
	function createVCode(){
		var res = '';
		var letterStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		for(var i = 0; i < 4; i++){
			var randomIndex = parseInt(Math.random()*62);
			res += letterStr[randomIndex];
		}
		return res;
	}
	//当页面刷新时，验证码框自动生成一组随机数
	$("#createCode").html(createVCode());
	//当点击验证码框时，验证码框自动生成一组随机数
	$("#createCode").click(function(){
		$(this).html(createVCode());
	});
	
	//以下是登录验证
	var REG_usn1 = /^1\d{10}$/;			//判断用户名是不是手机号码
	var REG_usn2 =/^\w+@\w+(\.\w+)+$/;			//判断用户名是不是邮箱帐号
	var REG_psw = /^.{6,20}$/;	//判断密码是不是6-20位
	var $usn="";
	var $pwd="";
	var $code="";
	var $createCode = "";
	//给登录按钮定义一个点击事件
	$("#logining").click(function(){
		//获取登录名和密码以及验证框内容
		$usn=$("#username").val();
		$pwd=$("#password").val();
		$code=$("#loginCode").val();
		$createCode=$("#createCode").html();
		//判断用户名栏是不是空
		if($usn==""){
			$("#userError").html("请填写此字段")
			$("#userError").css("display","block");
			return;		//	return表示跳过直接中断该函数，下面语句都不在执行
		}
		//判断用户名格式是否正确
		if(REG_usn1.test($usn) || REG_usn2.test($usn)){
			$("#userError").css("display","none");
		}else{
			$("#userError").html("请匹配对应格式")
			$("#userError").css("display","block");
			return;	
		}
		//判断密码框是不是空
		if($pwd==""){
			$("#pwdError").html("请填写此字段")
			$("#pwdError").css("display","block");
			return;
		}
		//判断验证码是不是空
		if($code==""){
			$("#codeError").html("请填写此字段")
			$("#codeError").css("display","block");
			return;
		}
		//如果验证码输入框的值不等于创造框里的值，就意味着验证码输入错误，跳转到isLogining页面，并显示出验证码输入错误。
		if($createCode.toLowerCase()!=$code.toLowerCase()){
			//使用whereFalse名称的cookie保存一下错误位置，放到isLogin页面上显示出错误位置
			$.cookie("whereFalse","操作失败！验证码错误！",{path:"/"});
			//跳转到isLogining页面，并显示出验证码输入错误
			window.location.href="../isLogin/isLogin.html";
			return;
		}
		
		//获取cookie中的registeredUsers,验证用户名密码是否正确
		var registeredStr=$.cookie("registeredUsers")?$.cookie("registeredUsers"):"{}";
		registeredObj=JSON.parse(registeredStr);
		//console.log(registeredObj[$usn])
		//如果registeredObj中有当前的登录名，就比对密码，如果没有，就提示未注册
		if(registeredObj[$usn]){
			if(registeredObj[$usn]==$pwd){
				//登陆成功，把当前的用户名保存到loginedUser的cookie中，当勾选自动登录时，就把过期时间设置为1000天，如果没勾选则不设置过期时间，页面过期后自动删除
				if($("#autoLogin").get(0).checked){
					$.cookie("loginedUser",$usn,{expires:1000,path:"/"});
					window.location.href="../index.html";
					return;	
				}else{
					$.cookie("loginedUser",$usn,{path:"/"});
					window.location.href="../index.html";
					return;	
				}
			}else{
				//使用whereFalse名称的cookie保存一下错误位置，放到isLogin页面上显示出错误位置
				$.cookie("whereFalse","操作失败！密码不正确！",{path:"/"});
				window.location.href="../isLogin/isLogin.html";
				return;
			}		
		}else {
			//使用whereFalse名称的cookie保存一下错误位置，放到isLogin页面上显示出错误位置
				$.cookie("whereFalse","操作失败! 没有找到用户！",{path:"/"});
				window.location.href="../isLogin/isLogin.html";
				return;
		}
	});
	
	//给用户名输入框定义一个聚焦事件
	$(".login form input").focus(function(){
		$(".login form h1").css("display","none");
	});
	
	//给回车按钮定义一个点击事件，使其等价于点击登录按钮
	$(document).keydown(function(e){
		if(e.keyCode==13){
			$("#logining").click();
		}
	});
	
});
















