
$(function(){
	//下面是购物车实现
	//定义一个函数，用于更新商品的总价格和总积分
	function loadAllPriceScore(){
		//更新商品金额
		$(".goodTotal h2 strong").eq(0).html(totalPrice);
		//更新总计
		$(".goodTotal h2 .pink strong").eq(0).html(totalPrice);
		//更新一下总积分
		$(".goodTotal h2 strong").eq(2).html(totalScore);
		$(".goodTotal h2 strong").eq(3).html((totalScore*2));
	}
	
	//取出cookie，看里面cart有没有对象，如果是空对象，就显示blank，隐藏goodTotal，不是空对象就遍历对象动态生成里面的所有商品信息
	var cartStr=$.cookie("cart")?$.cookie("cart"):"{}";
	var cartObj=JSON.parse(cartStr);
	//console.log(cartObj)
	if(cartStr == "{}"){
		$("#blank").css("display","block");
	}else{
		$("#blank").css("display","none");
		//定义一个变量用于接收所有商品的总钱数
		var totalPrice = 0;
		//定义一个变量用于接收所有商品的总积分
		var totalScore=0;
		for(var id in cartObj){
			var key = cartObj[id];
			/*定义cookie中商品数据的存放形式：
			{pid1:{
					img:goodImg,
					name:goodName,
					id:goodId,
					info:goodInfo,
					discount:goodDiscount,
					price:goodPrice,
					num:goodNum
				}
			}
			*/
			//console.log(key.img)
			//console.log(key.name)
			//console.log(key.id)
			//console.log(key.discount)
			//console.log(key.price)
			//console.log(key.num)
//缺少一个完整的discount的判断，这里把discount设置死了
			//定义一个折扣价格
			var discountPrice = 0;
			if(key.discount){
				discountPrice=10;
			}
			$('<ul class="goods">'+
				'<li>'+
					'<i class="active">√</i>'+
					'<a href="javascript:;"><img src="../detail/'+key.img +'" alt="" /></a>'+
				'</li>'+
				'<li>'+
					'<p><a href="javascript:;"><strong>'+ key.name +'</strong></a></p>'+
					'<p>货号： '+key.id+'</p>'+
					'<p>'+key.info+'</p>'+
					'<p><span class="pink">'+key.discount+'</span></p>'+
				'</li>'+
				'<li><h4>¥ '+key.price+'</h4></li>'+
				'<li>'+
					'<h4><a href="javascript:;" class="subtract">-</a>'+
					'<input type="text" id="count"  disabled="disabled" value="'+key.num+'"/>'+
					'<a href="javascript:;" class="add">+</a> </h4>'+
				'</li>'+
				'<li><h4>¥ '+(key.price-discountPrice)+'</h4></li>'+
				'<li>'+
					'<h4><a href="javascript:;" id="toCollect">加入收藏夹</a><br />'+
					'<a href="javascript:;" id="delete">删除</a></h4>'+
				'</li>'+
			'</ul>').appendTo("#goodList");
			totalPrice+=parseFloat(key.price-discountPrice)*key.num;
			totalScore+=parseInt(key.score)*key.num
		}
		
		//动态生成总计框
		$('<div class="goodTotal">'+
			'<h1>'+
				'<input type="checkbox" id="allSelect" checked/>全选  &nbsp;'+
				'<a href="javascript:;" id="delSelected">删除选中的商品</a>  &nbsp;'+
				'<a href="javascript:;" id="delCart">清空购物车</a>'+
			'</h1>'+
			'<h2>'+
				'商品金额：<strong>'+totalPrice+'</strong>元<br />'+
				'运费：<strong>0.00</strong>元<br />'+
				'可返积分：<strong>'+totalScore+'</strong>*2 = <strong>'+(totalScore*2)+'</strong><br />'+
				'<span class="pink">总计：<strong>'+totalPrice+'</strong>元</span>'+
			'</h2>'+
			'<a href="javascript:;" id="toCount">去结算</a>'+
		'</div>').appendTo("#goodList");
	}
	
	//给左右的加减符号添加一个鼠标点击事件，当点击时，改变里面的value值
	$(".add,.subtract").each(function(index){
		$(this).click(function(){
			//获取cookie
			var cartStr=$.cookie("cart")?$.cookie("cart"):"{}";
			var cartObj=JSON.parse(cartStr);
			//获取当前商品的id值
			var currentId = $(this).parent().parent().prev().prev().children().eq(1).html().match(/\D*(\d+)/)[1];
			if($(this).html()=="+"){
				$(this).prev().val(parseInt($(this).prev().val())+1);
				//更新总价格totalPrice,等于当前总价格加等于后面的嘉丽价
				totalPrice +=parseFloat($(this).parent().parent().next().text().match(/..(.+)/)[1]);
				//更新一下总积分，等于当前总积分加等于当前商品的对应的积分
				totalScore +=parseInt(cartObj[currentId].score);
				//更新一下cookie里的num项
				cartObj[currentId].num+=1;
			}else{
				var num=parseInt($(this).next().val()-1);
				if(num<1){
					num=1;
					return;
				}
				$(this).next().val(num);
				//更新总价格totalPrice,等于当前总价格加等于后面的嘉丽价
				totalPrice -=parseFloat($(this).parent().parent().next().text().match(/..(.+)/)[1]);
				//更新一下总积分，等于当前总积分加等于当前商品的对应的积分
				totalScore -=cartObj[currentId].score;
				//更新一下cookie里的num项
				cartObj[currentId].num-=1;
			}
			//更新商品总金额，总积分等
			loadAllPriceScore();
			//更新cookie
			cartStr=JSON.stringify(cartObj);
			$.cookie("cart",cartStr,{expires:7,path:"/"})
		});	
	})
	
	//当点击加减按钮时，改变input框中的值，并更新小计，总计，cookie
	/*
	//给左右的加减符号添加一个鼠标点击事件，当点击时，改变里面的value值
	$("#add,#subtract").each(function(index){
		$(this).click(function(){
			//获取cookie
			var cartStr=$.cookie("cart")?$.cookie("cart"):"{}";
			var cartObj=JSON.parse(cartStr);
			//获取当前商品的id值
			var currentId = parseInt($(this).parent().parent().prev().prev().children().eq(1).html());
			if($(this).html()=="+"){
				$("#count").val(parseInt($("#count").val())+1);
				//更新总价格totalPrice,等于当前总价格加等于后面的嘉丽价
				totalPrice +=parseFloat($(this).parent().parent().next().text().match(/..(.+)/)[1]);
				//更新一下总积分，等于当前总积分加等于当前商品的对应的积分
				totalScore +=parseInt(cartObj[currentId].score);
				//更新一下cookie里的num项
				cartObj[currentId].num+=1;
			}else{
				var num=parseInt($("#count").val()-1);
				if(num<1){
					num=1;
					return;
				}
				$("#count").val(num);
				//更新总价格totalPrice,等于当前总价格加等于后面的嘉丽价
				totalPrice -=parseFloat($(this).parent().parent().next().text().match(/..(.+)/)[1]);
				//更新一下总积分，等于当前总积分加等于当前商品的对应的积分
				totalScore -=cartObj[currentId].score;
				//更新一下cookie里的num项
				cartObj[currentId].num-=1;
			}
			//更新商品总金额，总积分等
			loadAllPriceScore();
			//更新cookie
			cartStr=JSON.stringify(cartObj);
			$.cookie("cart",cartStr,{expires:7,path:"/"})
		});	
	})
	*/
	//给删除按钮添加一个点击事件
	$(".goods #delete").click(function(){
		var isdel = confirm("确定要删除该商品吗？");
		if(isdel){
			//获取cookie
			var cartStr=$.cookie("cart")?$.cookie("cart"):"{}";
			var cartObj=JSON.parse(cartStr);
			//获取当前删除商品的id值，顺便删除当前的ul,
			var delId= $(this).parent().parent().parent().remove().children().eq(1).children().eq(1).html().match(/\D*(\d+)/)[1];
			//console.log(delId);
			//删除对应商品的cookie对象里的数据
			delete cartObj[delId];
			//更新cookie
			cartStr=JSON.stringify(cartObj);
			$.cookie("cart",cartStr,{expires:7,path:"/"})
			//检测一下里面cart 的cookie里面还有没有数据，没有的话显示空空如也,并删除总计
			if(cartStr=="{}"){
				$("#blank").css("display","block");
				$("#goodList .goodTotal").remove();
			}	
		}
	});

	//给前面的选中按钮添加一个点击事件
	$("#goodList .goods").each(function(){
		$(this).children().eq(0).children("i").click(function(){
			//获取里选中按钮里的class名，如果有active，就移除active，如果没有active，就加上active
			if($(this).hasClass("active")){
				//有active类，表明当前是选中状态，移除active类
				$(this).removeClass("active");
				//把总价中这一部分的价钱给减掉,这一部分价格等于前商品的数量乘以嘉丽价
				totalPrice -=parseInt($(this).parent().siblings().eq(2).find("input").val())*parseFloat($(this).parent().parent().children().eq(4).text().match(/..(.+)/)[1]);
				//获取当前商品的id名
				var pId=$(this).parent().parent().children().eq(1).children().eq(1).html().match(/\D*(\d+)/)[1];
				//更新一下总积分，等于当前总积分减等于当前商品的对应的积分乘以当前商品的数量
				totalScore -=parseInt(cartObj[pId].score)*parseInt($(this).parent().siblings().eq(2).find("input").val());
				//更新商品总金额，总积分等
				loadAllPriceScore();
				//取消全选选中框
				$("#allSelect").removeAttr("checked");
			}else{
				//无active类，表明当前是非选中状态，添加active类
				$(this).addClass("active");
				//把总价中这一部分的价钱给加上,这一部分价格等于前商品的数量乘以嘉丽价
				totalPrice +=parseInt($(this).parent().siblings().eq(2).find("input").val())*parseFloat($(this).parent().parent().children().eq(4).text().match(/..(.+)/)[1]);
				//获取当前商品的id名
				var pId=$(this).parent().parent().children().eq(1).children().eq(1).html().match(/\D*(\d+)/)[1];
				//更新一下总积分，等于当前总积分加等于当前商品的对应的积分
				totalScore +=parseInt(cartObj[pId].score)*parseInt($(this).parent().siblings().eq(2).find("input").val());
				//更新商品总金额，总积分等
				loadAllPriceScore();
				//判断是不是所有的商品前面的选择框都被选中了，如果是，就把全选按钮勾上
				var isAllSelected=true;
				$("#goodList .goods li:first i").each(function(index){
					if(!$(this).hasClass("active")){
						isAllSelected=false;
						return false;
					}
				});
				if(isAllSelected){
					$("#allSelect").get(0).checked="true";
				}
			}
			//console.log(totalPrice)
		});	
	});

	//给全选按钮添加一个点击事件
	$("#allSelect").mouseup(function(){
		//因为当加减数量操作后，对应的cartObj对象就已经更新过了，所以可以直接使用cartObj对象不需要获取cookie
		if(!$(this).get(0).checked){
			//each循环给上面所有商品前面的选中框都加一个active类，表示全部选中
			$("#goodList .goods").each(function(index){
				$(this).children().eq(0).children("i").attr("class","active");
			});
			//将上面的所有商品，总价都进行计算
			$("#goodList .goods").each(function(index){
				//获取当前商品的id名
				var pId= $(this).children().eq(1).children().eq(1).html().match(/\D*(\d+)/)[1];
				totalPrice += parseInt($(this).children().eq(3).find("input").val())*parseFloat($(this).children().eq(4).text().match(/..(.+)/)[1]);
				totalScore +=parseInt(cartObj[pId].score)*parseInt($(this).children().eq(3).find("input").val());
			});
		}else{
			//each循环给上面所有商品前面的选中框都取消一个active类，表示全部不选中
			$("#goodList .goods").each(function(index){
				$(this).children().eq(0).children("i").attr("class","");
			});	
			totalPrice=0;
			totalScore=0;
		}
		//更新商品总金额，总积分等
		loadAllPriceScore();
	});
	//给删除选中上商品文字添加点击动作
	$("#delSelected").click(function(){
		var res=confirm("是否要删除选中的所有产品");
			if(res){
				$("#goodList .goods").each(function(index){
					
					if($(this).children().eq(0).children("i").hasClass("active")){
						//获取当前选中商品的id值，顺便删除当前的ul
						var delId= $(this).remove().children().eq(1).children().eq(1).html().match(/\D*(\d+)/)[1];
						//删除对应商品的cookie对象里的数据
						delete cartObj[delId];
					}
				});
				//选中的全部删除后，更新cookie
				cartStr=JSON.stringify(cartObj);
				$.cookie("cart",cartStr,{expires:7,path:"/"})
				//更新以下总价和积分
				totalPrice=0;
				totalScore=0;
				loadAllPriceScore();
				//检测一下里面cart 的cookie里面还有没有数据，没有的话显示空空如也,并删除总计
				if(cartStr=="{}"){
					$("#blank").css("display","block");
					$("#goodList .goodTotal").remove();
				}		
			}
	});
	//给清空购物车文字添加点击动作
	$("#delCart").click(function(){
		var res=confirm("是否要清空购物车");
		if(res){
			$("#goodList .goods").each(function(index){
				//获取当前选中商品的id值，顺便删除当前的ul
				var delId= $(this).remove().children().eq(1).children().eq(1).html().match(/\D*(\d+)/)[1];
				//删除对应商品的cookie对象里的数据
				delete cartObj[delId];
			});
			//选中的全部删除后，更新cookie
			cartStr=JSON.stringify(cartObj);
			$.cookie("cart",cartStr,{expires:7,path:"/"})
			//检测一下里面cart 的cookie里面还有没有数据，没有的话显示空空如也,并删除总计
			if(cartStr=="{}"){
				$("#blank").css("display","block");
				$("#goodList .goodTotal").remove();
			}
		}
	});
	
	//给去结算添加一个点击事件
	$("#toCount").click(function(){
		window.location.href="../order/order.html";
	});
});


$(function(){
	//设置ul下每个li的宽度
	$("#goodList ul").each(function(index){
		$("#goodList ul").eq(index).children().eq(0).css("width",270);
		$("#goodList ul").eq(index).children().eq(1).css("width",310);
		$("#goodList ul").eq(index).children().eq(2).css("width",150);
		$("#goodList ul").eq(index).children().eq(3).css("width",150);
		$("#goodList ul").eq(index).children().eq(4).css("width",155);	
	});
})
















