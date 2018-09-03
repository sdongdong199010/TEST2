$(function(){
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
		window.location.href="../cart/cart.html";
	});
	$(".search .indexSearch-r").click(function(){
		window.location.href="cart/cart.html";
	});
	
	//给所有的全部商品分类定义一个下拉动作
	$(".banner .banner-l").click(function(){
		$(".banner .goodTypes").slideToggle("normal");
	});
})	