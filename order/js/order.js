$(function(){
	//给新增收货地址添加一个鼠标点击事件
	$("#addSite").click(function(){
		$(".newSite").toggle();
		//隐藏显示更多地址项目
		$(".order .moreAddress").hide();
	});
	//以下是省市县信息加载
	var proName=document.getElementById("proName");
	var cityName=document.getElementById("cityName");
	var countyName=document.getElementById("countyName");
	var allData;
	//以下是通过ajax调用各级省市镇的相关信息操作。
	ajax("get","data/allCity.json",function(data){
		allData = JSON.parse(data);
		loadPrince();
	});
	function loadPrince(){
		//遍历所有的的省份信息，每次都创建一个opation，并添加到select的最后
		var len=allData.regions.length;
		for(var i=0; i<len ;i++){
			var opt = document.createElement("option");
			opt.innerHTML=allData.regions[i].name;
			proName.appendChild(opt);
		}
		proName.onchange=function(){
			countyName.innerHTML="<option>请选择</option>";
			cityName.innerHTML="<option>请选择</option>";
			loadCity(this.value);
		}
	}
	function loadCity(proName){
		//根据所有的省份信息，遍历当前是的省份
		var len=allData.regions.length;
		for(var i=0; i<len ;i++){
			if(proName==allData.regions[i].name && allData.regions[i].regions){//找到对应的省份，并且该省份下面有市县等信息（排除自治区）
				//获取当前的市下面的所有县的信息
				cityData = (allData.regions)[i].regions;
		//console.log(cityData)
				//使用一个for循环把该省份下的所有市信息添加到第二个选择框里面
				for(var i=0;i<cityData.length; i++){
					//创建一个option，加入一个市的名称，添加到第二个选择框中
					 var opt=document.createElement("option");
					 opt.innerHTML=cityData[i].name;
					 cityName.appendChild(opt);
				}
				break;
			}
		}//当cityname中的选择框中内容改变，加载该市下所有的县名称到county框中，清除县选择框里面的内容，因为有可能是在市选择框里已经选择过相应内容后在选择第二个内容
		cityName.onchange=function(){
			countyName.innerHTML="<option>请选择</option>";
			loadCounty(cityData,this.value);
		}
		return cityData;
	}
	function loadCounty(cityData,cityName){
		//根据当前该省下的所有的市信息，遍历当前的城市名
		var len=cityData.length;
		for(var i=0; i<len ; i++){
			if(cityName==cityData[i].name){//找到当前市的相关信息
				//使用一个for循环把该市下的所有县信息添加到第三个选择框里面
				var countyData=cityData[i].regions;
				for(var j=0;j<countyData.length; j++){
					//创建一个option，加入一个市的名称，添加到第二个选择框中
					 var opt=document.createElement("option");
					 opt.innerHTML=countyData[j].name;
					 countyName.appendChild(opt);
				}
				break;
			}
		}
		//当cityname中的选择框中内容改变，清除乡镇选择框里面的内容，因为有可能是在县选择框里已经选择过相应内容后在选择第二个内容
		cityName.onchange=function(){
			countyName.innerHTML="<option>请选择</option>";
			//在这里，由于json文件中没有镇的信息，所以无法加载该县下所有乡镇名称到town框中
		}
		return cityData;
	}
	
	/*------------------------------------下面是关于收货地址默认显示和新增地址的相关操作---------------------------------------*/
	//新建一个收货地址
	$("#save").click(function(){
		//当点击保存按钮时，首先清空所有错误样式
		$("#error").css({display:"none"});
		//所有边框有颜色的input都选中，并把类名移除
		$(".errorBorder").removeClass("errorBorder");
		//console.log($("#proName").val());
		if($("#proName").val()=="请选择"){
			//显示错误信息
			$("#error").css({left:165,top:52,display:"block"});
			//边框颜色改变
			$("#proName").addClass("errorBorder");
			return;
		}
		if($("#cityName").val()=="请选择"){
			//显示错误信息
			$("#error").css({left:260,top:52,display:"block"});
			//边框颜色改变
			$("#cityName").addClass("errorBorder");
			return;
		}
		if($("#countyName").val()=="请选择"){
			//显示错误信息
			$("#error").css({left:353,top:52,display:"block"});
			//边框颜色改变
			$("#countyName").addClass("errorBorder");
			return;
		}
		if($("#detailSite").val()==""){
			//显示错误信息
			$("#error").css({left:163,top:140,display:"block"});
			//边框颜色改变
			$("#detailSite").addClass("errorBorder");
			return;
		}
		if($("#recipients").val()==""){
			//显示错误信息
			$("#error").css({left:178,top:198,display:"block"});
			//边框颜色改变
			$("#recipients").addClass("errorBorder");
			return;
		}
		if($("#phone").val()==""){
			//显示错误信息
			$("#error").css({left:260,top:255,display:"block"});
			//边框颜色改变
			$("#phone").addClass("errorBorder");
			return;
		}
		if(!(/^1\d{10}$/).test($("#phone").val())){
			//显示错误信息
			confirm("请填写正确的收货人手机号码");
		}else{
			/*   地址格式：json对象里存放数组，数组里在存放对象:
			{address：[{
				name:recipients,
				phone:phone,
				site:$("#proName").val()+$("#cityName").val()+$("#countyName").val()+$("#detailSite").val()
			},address2:{}]}      */
			//获取当前的address的cookie，并添加改组地址信息到该cookie中
			var addressStr=$.cookie("address")?$.cookie("address"):'{"address":[]}';
			addressObj=JSON.parse(addressStr);
			var newAddress = {name:$("#recipients").val(),
										phone:$("#phone").val(),
										site:$("#proName").val()+"省"+$("#cityName").val()+$("#countyName").val()+$("#detailSite").val(),
										proName:$("#proName").val(),
										cityName:$("#cityName").val(),
										countyName:$("#countyName").val(),
										detailSite:$("#detailSite").val()};
			addressObj.address.unshift(newAddress);
			//更新cookie数据
			addressStr=JSON.stringify(addressObj);
			console.log(addressStr)
			$.cookie("address",addressStr,{expires:1000,path:"/"});
			//地址创建完毕后，刷新页面
			location.reload();
		}
	});
	
	
	/*------------------------------------以下是显示默认收货地址的相关操作---------------------------------------*/
	//取出cookie，看里面address有没有对象，如果是空对象，就不生成数据，不是空对象就遍历cookie动态生成里面的所有收货人信息
	var addressStr=$.cookie("address")?$.cookie("address"):'{"address":[]}';
	var addressObj=JSON.parse(addressStr);
	var addressArr=addressObj.address;
	if(addressStr!='{"address":[]}'){
		$('<span class="pink">'+addressArr[0].name+"   "+addressArr[0].phone+'</span><strong>'+addressArr[0].site+'</strong>').prependTo($(".orderInfo h2 p"));
	}
	//把收货人姓名和收货地址赋值给右下角的订单提交项目中
	$("#deliveryAddress").html("收货地址："+addressArr[0].site);
	$("#receiver").html("收货人："+addressArr[0].name);
	
	//给editAddress添加一个点击事件，且填入当前内容的默认内容
	$("#editAddress").click(function(){
		var currentPro =addressArr[addressIndex].proName;
		var currentCity =addressArr[addressIndex].cityName;
		var currentCounty =addressArr[addressIndex].countyName;
		$("#proName").html('<option>'+currentPro+'</option><option>请选择</option>');
		loadPrince();
		$("#cityName").html('<option>'+currentCity+'</option><option>请选择</option>');
		var currentCityData = loadCity(currentPro);
		$("#countyName").html('<option>'+addressArr[addressIndex].countyName+'</option><option>请选择</option>');
		loadCounty(currentCityData,currentCity);
		$("#detailSite").val("zhenzhenjiajai");
		$("#recipients").val(addressArr[addressIndex].name);
		$("#phone").val("18787879090");
		$(".newSite").toggle();
		//隐藏更多地址项目
		$(".order .moreAddress").hide();
	});
	
	
	/*------------------------------------以下是点击更多收货地址的操作的相关操作---------------------------------------*/	
	//根据cookie生成里面的地址，遍历数组中元素，将里面的所有元素都生成为地址
	for(var i=0; i<addressArr.length; i++){
		$('<p><input type="radio" name="currenAddress"/> <span class="pink">'+addressArr[i].name+addressArr[i].phone+'</span>'+addressArr[i].site+'</p>').appendTo(".order .moreAddress h5")
	}
	//默认的是第一个地址为默认显示
	$(".order .moreAddress p input").eq(0).attr("checked","true");
	//给更多地址中每个地址下的单选框input添加一个点击事件
	$(".order .moreAddress p").children("input").click(function(){
		$(this).attr("checked","true").parent().siblings().children("input").removeAttr("checked");
	});

	
	//由于上面已经获取过addressObj，所以这里不需要在进行地址的获取操作
	$("#showMoreAddress").click(function(){
		//隐藏新建/修改地址项目
		$(".orderInfo .newSite").hide();
		//当点击显示更多收货地址时，显示/隐藏该项目
		$(".order .moreAddress").toggle();
	});
	//当点击确定时，保存当前选择的地址为默认收货地址，且在显示收货地址的项目中，显示该地址
	//定义一个变量，用于保存默认显示的地址
	var addressIndex=0;
	$("#confirmAddress").click(function(){
		$(".order .moreAddress p").each(function(index){
			if($(this).children("input").prop("checked")){
				addressIndex=$(this).index();
				return false;
			}
		});
		//首先情空空里面的原有的地址和信息
		$(".orderInfo h2 p span").remove();
		$(".orderInfo h2 p strong").remove();
		//把当前显示的默认地址改成该条件下对应的地址,
		$(".orderInfo h2 p").prepend('<span class="pink">'+addressArr[addressIndex].name+"   "+addressArr[addressIndex].phone+'</span><strong>'+addressArr[addressIndex].site+'</strong>');
		//更新右下角订单提交项目中的收货人姓名和收货地址
		$("#deliveryAddress").html("收货地址："+addressArr[addressIndex].site);
		$("#receiver").html("收货人："+addressArr[addressIndex].name);
		//隐藏显示更多地址项目
		$(".orderInfo .moreAddress").hide();
	});
	
	
	
	
	/*------------------------------------以下是引入购物车内的商品的相关操作---------------------------------------*/
	//取出cookie，看里面cart有没有对象，如果是空对象，就显示blank，隐藏goodTotal，不是空对象就遍历对象动态生成里面的所有商品信息
	var cartStr=$.cookie("cart")?$.cookie("cart"):"{}";
	var cartObj=JSON.parse(cartStr);
	//由于该页面是通过购物车结算页面进入的，所以购物车里肯定有商品,for-in遍历取出里面的所有商品
	var totalPrice = 0;
	var totalDiscount = 0;
	for(var id in cartObj){
		var key = cartObj[id];
		$('<ul class="goods">'+
			'<li>'+
				'<a href="javascript:;"><img src="../detail/'+key.img +'" alt="" /></a>'+
			'</li>'+
			'<li>'+
				'<p><a href="javascript:;"><strong>'+key.name+'</strong></a></p>'+
				'<p>'+key.info+'</p>'+
				'<p>'+key.id+'</p>'+
			'</li>'+
			'<li><h4>'+key.price+'</h4></li>'+
			'<li>'+
				'<input type="text" id="count" value="'+key.num+'"/>'+
			'</li>'+
			'<li>'+
				'<h4>免费</h4>'+
			'</li>'+
		'</ul>').appendTo($(".order .goodsInfo"));	
		//更新一下总价格
		totalPrice+=key.price*key.num;
		//更新一下总折扣
		if(key.discount){
			totalDiscount+=10*key.num;
		}
	}
	$('<h5>添加订单信息：<input type="text" /> 请勿填写与支付，收货，发票相关的信息</h5>').appendTo($(".order .goodsInfo"));	
	//把总价格和总折扣赋值给到对应位置
	$(".submitOrder .totalPrice").html(totalPrice);
	$(".submitOrder .discount").html(totalDiscount);
	$(".submitOrder .realPrice").html(totalPrice-totalDiscount+"元");
	
	//给提交订单按钮绑定一个点击事件
	$(".order .submitOrder").click(function(){
		window.location.href="../pay/pay.html";
	});
});


$(function(){
	//设置ul下每个li的宽度
	$(".delivery ul").each(function(index){
		$(".delivery ul").eq(index).children().eq(0).css("width",200);
		$(".delivery ul").eq(index).children().eq(1).css("width",450);
		$(".delivery ul").eq(index).children().eq(2).css("width",220);
		$(".delivery ul").eq(index).children().eq(3).css("width",190);
	});
})
















