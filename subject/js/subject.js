$(function(){
	$.get("data/furniture.json",null,function(data,text,xhr){
		for(var good in data){
			var currentGood = data[good];
			$('<dl>'+
				'<dt><a href="javascript:;"><img src="'+currentGood.src+'" /></a></dt>'+
				'<dd><a href="javascript:;">'+currentGood.info+'</a></dd>'+
			'</dl>').appendTo($(".furnitures"));
		}
		//给每个dt中的图片添加一个点击动作,使其弹出，全屏显示
		$(".furnitures dt img").click(function(){
			console.log("url(../"+$(this).attr('src')+")")
			$("#imgBox").css({display:"block","background-image":"url("+$(this).attr('src')+")"});
			$("#shade").css({display:"block"});
			return false;
		});
		$(document).click(function(){
			$("#imgBox").css({display:"none"});
			$("#shade").css({display:"none"});
		});
		$("#imgBox p").click(function(){
			$("#imgBox").css({display:"none"});
			$("#shade").css({display:"none"});
		});
		$("#imgBox").click(function(){
			return false;
		})
	},"json");
});
















