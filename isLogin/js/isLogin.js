$(function(){
	//获取cookie中的whereFalse
	var whereStr=$.cookie("whereFalse")?$.cookie("whereFalse"):"";
	//如果registeredObj中有当前的登录名，就比对密码，如果没有，就提示未注册
	if(whereStr!=""){
		//把里面的错误内容取出来，放到h1标签中
		$(".isLogin h1").html(whereStr);
		//设置一个定时器，使span里的内容每秒减1
		var timer= setInterval(function(){
			var time=$(".isLogin span").html();
			console.log(time)
			$(".isLogin span").html(time- 1);
		},1000);
		//设置一个定时器，3秒后自动跳转到登录页面
		setTimeout(function(){
			clearInterval(timer);
			if($(".isLogin h1").html()=="注册成功，为你跳转到主页。。"){
				window.location.href="../index.html";
			}else{
				$.cookie("whereFalse","",{path:"/"});
				window.history.back(-1);	
			}
			//window.location.href="../register/login.html";
		},3000);
	}
});
















