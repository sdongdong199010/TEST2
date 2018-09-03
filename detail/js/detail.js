$(function(){
//放大镜效果	smallBox:商品图片存放位置		kit：用于移动的放大镜      big	Box：放大后的图片存放位置
	var smallBox=document.getElementById("smallBox");
	var bigBox=document.getElementById("bigBox");
	var smallImg=smallBox.getElementsByTagName("img")[0];
	var bigImg=bigBox.getElementsByTagName("img")[0];
	var kit=document.getElementById("kit");
	//给smallBox定义一个鼠标进入事件，当鼠标进入时，把kit和bigBox显示出来
	smallBox.onmouseenter=function(){
		kit.className="active";
		bigBox.className="active";
		//给document定义一个鼠标移动时间
		document.onmousemove=function(e){
			var _e=e||window.event;
			//获取小工具和的left值，等于相对于可是区域的坐标 - smallBox相对于可视区域的left值 - kit/2，这样鼠标就会始终停留在kit的中心处
			var x = _e.clientX - smallBox.offsetLeft -kit.offsetWidth/2;
			var y = _e.clientY - smallBox.offsetTop + $(window).scrollTop()- kit.offsetHeight/2;
			//console.log("yasdf:"+_e.clientY)
			//console.log("s:"+smallBox.offsetTop)
			//console.log("k:"+kit.offsetHeight/2)
			//console.log("y:"+y)
			//显示鼠标只能在smallBox里面进行移动
			if(x<0){
				x=0;
			}
			if(x>smallBox.offsetWidth-kit.offsetWidth-2){
				x=smallBox.offsetWidth-kit.offsetWidth-2;
			}
			if(y<0){
				y=0;
			}
			if(y>smallBox.offsetHeight-kit.offsetHeight-2){
				y=smallBox.offsetHeight-kit.offsetHeight-2;
			}
			//定义kit的left和top值，使其能跟随鼠标的移动而移动
			kit.style.left= x+ "px";
			kit.style.top= y + "px";
			//定义bigBox背景图的位置，使放大后的图片始终和kit中的图片对应起来
			bigImg.style.left=-(bigBox.offsetWidth/kit.offsetWidth)*x+"px";
			bigImg.style.top=-(bigBox.offsetWidth/kit.offsetWidth)*y+"px";
		}
	}
	//给smallBox定义一个鼠标离开事件，停止鼠标移动事件，以及使kit和bigBox隐藏
	smallBox.onmouseleave=function(){
		document.onmousemove=null;
		kit.className="";
		bigBox.className="";
	}
	
//给tabBox定义一个鼠标点击事件
	//获取tabBox中a的节点
	var tabBox=document.getElementById("tabBox");
	var tabs=tabBox.getElementsByTagName("a");
	//添加一个索引，使在全局中时刻知道当前点击的图片的索引
	var index=0;
	//定义一个for循环，给tabBox里所有的图片添加一个点击事件
	for(var i=0; i<tabs.length; i++){
		tabs[i].index=i;
		tabs[i].onclick=function(){
			index=this.index;
			//console.log(index);
			//改变smallBox和bigBox中的背景路径
			smallImg.src=$(this).children().get(0).src;
			bigImg.src=$(this).children().get(0).src;
		}
	}
	
//以下是pro-r中商品尺寸的切换
	$("#size p").children().click(function(){
		//console.log(1)
		//给当前点击对象的颜色显示出来，其他的兄弟元素颜色全清掉
		$(this).addClass("active").siblings().removeClass("active");
	});
//以下是pro-r中商品颜色的切换
	$("#color p").children().click(function(){
		//console.log(1)
		//给当前点击对象的颜色显示出来，其他的兄弟元素颜色全清掉
		$(this).addClass("active").siblings().removeClass("active");
	});
	
//以下是detailInfo-r右侧商品的各种详情的tab切换
	$(".detailInfo-r h1").children().click(function(){
		console.log(1)
		$(this).addClass("active").siblings().removeClass("active")
		.parent().siblings().eq($(this).index()).addClass("active").siblings().removeClass("active")
	});
	
//以下是购物车的相关操作
	$(".search-r").click(function(){
		window.location.href="../cart/cart.html";
	});	
	
	//给加入购物车添加一个点击事件：右上角购物车里的数字发生改变，cookie中的数据进行更新。
	//totalNum为右上角购物车中商品的总数量
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
	//页面刚开始时，调用一下该函数，实时显示总数量
	loadCart();	
	
	//给左右的加减符号添加一个鼠标点击事件，当点击时，改变里面的value值
	$("#add,#subtract").click(function(){
		if($(this).html()=="+"){
			$(".product #count").val(parseInt($(".product #count").val())+1);
		}else{
			if(parseInt($(".product #count").val()-1)<1){
				parseInt($(".product #count").val()-1)=1;
			}
			$(".product #count").val(parseInt($(".product #count").val())-1);
		}
	});
	
	
	
	$("#toCart").click(function(){
		/*定义cookie中商品数据的存放形式：
		{pid1:{
				img:goodImg,
				name:goodName,
				id:goodId,
				info:goodInfo,
				discount:goodDiscount
				price:goodPrice,
				num:goodNum,
				score:goodScore
			}
		}
		*/
		//获取所有需要操作的标签，goodImg代表当前图片的链接，goodName代表商品的名字，goodInfo代表商品的尺码颜色信息，goodDiscount代表商品的折扣信息，goodPrice代表商品的价格，goodPid代表当前商品的货号，goodNum代表当前商品的添加数量，goodScroe代表商品的积分
		var goodImg=$("#tabBox").find("img:first").attr("src");
		var  goodName=$(".pro-r h1 strong").html();
		var goodInfo="";
		//如果有尺码，就传回尺码信息		$("#size .active").size()!=0意思是使用选择符获取到的jquery对象长度不是0，也就是当获取到尺码对象时
		if($("#size .active").size()!=0){
			goodInfo+=$("#size .active").html();
		}
		//如果有颜色，就传回颜色信息
		if($("#color .active").size()!=0){
			goodInfo+=$("#color .active").html();
		}
		//如果有尺码或是颜色，就在前面拼接上一个商品名称
		if(!goodInfo){
			goodInfo="";
		}else{
			goodInfo="颜色/尺码 ："+goodName+"_"+goodInfo;
		}
		//console.log(goodInfo)
		//定义一个商品折扣的信息
		var  goodDiscount="";	
		$(".pro-r h2 .disc").each(function(index){
			goodDiscount+=$(".pro-r h2 .disc").eq(index).parent().html();
		});
		//如果没有折扣信息，就传回空字符串
		if(!goodDiscount){
			goodDiscount="";
		}
		//console.log(goodDiscount)
		
		var goodPrice=$(".pro-r h2 strong.first").html().match(/\D*(\d+\.\d+)\D*/)[1];
		var goodPid=$("#pid").html().match(/\D*(\d+)\D*/)[1];
		var goodNum=parseInt($(".product #count").val());
		var  goodScore=$(".pro-r .pink").html().match(/\D*(\d+)\D*/)[1];
		//获取cookie里name为cart的数据
		var cartStr = $.cookie("cart")?$.cookie("cart"):"{}";
		//将获取到的JSON字符串数据转化为是对象格式
		var cartObj = JSON.parse(cartStr);
		//id是in选择符定义的变量名，表示对象中的每一个键名
		if(goodPid in cartObj){
			//当对像中有该商品时，就把该商品对应的数量加上添加的数量
			cartObj[goodPid].num += goodNum;
		}else{
			//当对象汇总没有该商品时，就在cookie的value中添加上这一个数据
			cartObj[goodPid]={
				img:goodImg,
				name:goodName,
				id:goodPid,
				info:goodInfo,
				discount:goodDiscount,
				price:goodPrice,
				num:goodNum,
				score:goodScore
			}
		}
		/*bug:颜色和尺寸不一样时，要创建一个新的pid*/
		//更新cookie里的商品数据
		cartStr=JSON.stringify(cartObj);
		$.cookie("cart",cartStr,{expires:7,path:"/"});
		//更新右上角购物车中的商品数量
		loadCart();	
		
		//弹出提示添加购物车成功，并把body添加一个遮罩，3s后自动关闭
		$(".shade").css("display","block");
		$(".sucTips").css("display","block");
		$(".shade p span").click(function(){
			$(".shade").css("display","none");
			$(".sucTips").css("display","none");
		});
		setTimeout(function(){
			$(".shade").css("display","none");
			$(".sucTips").css("display","none");
		},1000);
	});
	
	//给所有的全部商品分类定义一个下拉动作
	$(".banner .banner-l").click(function(){
		$(".banner .goodTypes").slideToggle("normal");
	});
	
	//给购买商品按钮添加一个点击事件，跳转到订单管理页面
	$("#buy").click(function(){
		window.location.href="../order/order.html";
	});
});
















