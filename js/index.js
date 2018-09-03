
$(function(){
	//以下是banner的轮播图
	//定义一个用于轮播函数
	var index=0;
	letShow();
	var len=$("#list li").size();
	function carousel(){
		index++;
		if(index>len-1){
			index=0;
		}
		letShow();
	}
	//起一个定时器，每隔一段时间轮播一次
	var timer=setInterval(carousel,3000);
	//定义一个函数，用于切换图片
	function letShow(){
		//处理一下导航
		$("#banBtn span").eq(index).addClass("active").siblings().removeClass("active");
		//让当前图片淡入,其它图片淡出
		$("#list li").eq(index).fadeIn(1000).siblings().fadeOut(1000);
		
	}
	$("#banBtn span").click(function(){
		clearInterval(timer);
		index = $(this).index();
		letShow();
		timer=setInterval(carousel,3000);
	});
	
	//以下是banner中侧边栏的显示隐藏
	//给每一个选项都绑定一个移入移出事件
	$(".sidebar-l div").hover(function(){
		$(this).children().eq(1).addClass("active");
		console.log($(this).children());
	},function(){
		$(this).find("h2").removeClass("active");
	});
	
	//以下是hot中今日/昨日热门的tab切换
	$(".top span").click(function(){
		$(this).addClass("active").siblings().removeClass("active")
		.parent().next().next().children().eq($(this).index()).addClass("active").siblings().removeClass("active");
	});
	
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
		window.location.href="register/login.html";
	});
	
	//定义一个函数，获取cookie中商品的总数量，并赋值给购物车右上角
	function loadCart(){
		var cartStr=$.cookie("cart")?$.cookie("cart"):"{}";
		var cartObj=JSON.parse(cartStr);
		//定义total为商品总数量
		var total=0;
		for(var id in cartObj){
			total+=parseInt(cartObj[id].num);
		}
		$(".search-r .num").html(total);
	//console.log(total);
	}
	//调用一下获取商品总数量的函数
	loadCart();
	$(".search .search-r").click(function(){
		window.location.href="cart/cart.html";
	});
});
	
	
	
	
	