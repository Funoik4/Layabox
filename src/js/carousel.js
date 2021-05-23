/***
 * 
 * @param {Object} lunbo_parent		父容器
 * @param {Object} ratio				图片高宽比  			默认：280/520
 * @param {Object} showArrow			是否显示箭头			默认true
 * @param {Object} showPannel		是否显示底部控制点	默认true
 * @param {Object} aniTime			动画时间				默认500ms
 * @param {Object} isAuto			是否自动轮播  		默认true
 */
function lunbo(lunbo_parent, ratio, showArrow, showPannel, aniTime, isAuto) {

	if(!lunbo_parent) {
		alert("缺少容器选择器");
		return;
	}
	var
		ratio = ratio ? ratio : 280 / 520,
		aniTime = aniTime ? aniTime : 100000,
		showArrow = showArrow !== false ? true : false,
		showPannel = showPannel !== false ? true : false,
		isAuto = isAuto !== false ? true : false,
		autoTime = aniTime + 500, //定时器间隔
		curDirection = "right"; //当前的轮播方向
	this.lunbo_parent = $(lunbo_parent);
	var lunbo_wrap = this.lunbo_parent.find(".lunbo_wrap"),
		pic_box = this.lunbo_parent.find(".pic_box"),
		left_arrow = this.lunbo_parent.find("#left_arrow"),
		pannel = this.lunbo_parent.find(".pannel"),
		right_arrow = this.lunbo_parent.find("#right_arrow");
	var move_width = lunbo_wrap.width();
	var lunbo_wrap_heigth = lunbo_wrap.width() * ratio;
	lunbo_wrap.css("height", lunbo_wrap_heigth);
	var cur_index = 0,
		last_index = 0;
	pic_box.find("li").css("width", move_width);
	var pic_num = pic_box.find("li").length;
	/***********循环输出控制点**************/
	if(showPannel) {
		for(var i = 0; i < pic_num; i++) {
			i == 0 ? con_li = "active" : con_li = "";
			var li = $("<li index=" + i + " class= " + con_li + "></li>")
			pannel.append(li);
		}
		/************给圆点加控制效果******************/
		pannel.on("click", "li", function() {
			cur_index = $(this).index();
			curDirection = cur_index >= last_index ? "right" : "left";
			scroll();
		})
	}
	/*************点击右按钮********************/
	var isAni = false;
	if(showArrow) {
		right_arrow.on("click", function() {
			if(!isAni) {
				right();
			}
		})
		left_arrow.on("click", function() {
			if(!isAni) {
				left();
			}
		})
	}

	/***************设置定时器************************/
	if(isAuto) {
		var t = setInterval(right, autoTime);
		lunbo_wrap.on("mouseover", function() {
			clearInterval(t);
			t = 0;
		})
		lunbo_wrap.on("mouseout", function() {
			if(t <= 0) {
				t = setInterval(right, autoTime)
			}
		})
	}
	//右边按钮触发的函数
	function right() {
		curDirection = "right";
		cur_index++;
		if(cur_index > pic_num - 1) cur_index = 0;
		scroll();
	}
	//左边按钮触发的函数
	function left() {
		curDirection = "left";
		cur_index--;
		if(cur_index < 0) cur_index = pic_num - 1;
		scroll();
	}
	//控制滚动的函数
	function scroll() {
		isAni = true;

		//判断轮播是否走到了最右端
		if(curDirection == "right" && cur_index == 0 && last_index == pic_num - 1) {
			pic_box.find("li:first").clone().appendTo(pic_box);
			pic_box.animate({
				"margin-left": -pic_num * move_width,
			}, aniTime, "linear", function() {
				isAni = false;
				pic_box.css("margin-left", 0);
				pic_box.find("li:last").remove();
			})

			//轮播走到了最左边
		} else if(curDirection == "left" && cur_index == pic_num - 1 && last_index == 0) {
			pic_box.find("li:last").clone().prependTo(pic_box);
			pic_box.css({
				"margin-left": -move_width
			});
			pic_box.animate({
				"margin-left": 0
			}, aniTime, "linear", function() {
				isAni = false;
				pic_box.find("li:first").remove();
				pic_box.css({
					"margin-left": -(pic_num - 1) * move_width
				})
			})

		} else
		//正常不在两端时的情况
		{
			pic_box.animate({
				"margin-left": -cur_index * move_width
			}, aniTime, "linear", function() {
				isAni = false;
			})

		}

		last_index = cur_index;
		if(showPannel) {
			pannel.find("li").eq(cur_index)
				.addClass("active")
				.siblings()
				.removeClass("active");
		}

	}

	//鼠标移上去，控制左右显示箭头
	if(showArrow) {
		left_arrow.hide();
		right_arrow.hide();
		var isIn = false;
		lunbo_wrap.on("mouseenter", function(e) {
			if(!isIn) {
				left_arrow.fadeIn(100)
				right_arrow.fadeIn(100)
				isIn = true;
			}
			return false;
		})
		lunbo_wrap.on("mouseleave", function(e) {
			if(isIn) {
				left_arrow.fadeOut(100)
				right_arrow.fadeOut(100)
				isIn = false;
			}
			return false;
		})
	}

}