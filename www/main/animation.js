define(['main/support'],function(support){

	var canvas = document.getElementById("myCanvas");
    //console.log(canvas);
    var cwidth = canvas.offsetWidth;
    var cheight = canvas.offsetHeight;
    var ctx = canvas.getContext("2d");
    var n = 2000;
    var step, startAngle, endAngle, add = Math.PI * 2 / n;
    ctx.shadowOffsetX = 0; // 设置水平位移
    ctx.shadowOffsetY = 0; // 设置垂直位移
    /*ctx.shadowBlur = 10; // 设置模糊度*/
    /*ctx.lineWidth = 1.0;*/
    counterClockwise = false;
    canvas.width = cwidth * 2;
    canvas.height = cheight * 2;
    canvas.style.width = cwidth + 'px';
    canvas.style.height = cheight + 'px';
    ctx.scale(2, 2);
    x = Math.floor(cwidth / 2);
    y = Math.floor(cheight / 2);
    var radius = Math.floor(cheight * 3 / 8);//根据圆形图片大小确定进度条半径
    //var animation_interval = 20;
    var animation_duration, animation_progress;

    var progress;

    return {

	showNumberWithAnimation : function(i, j, randNumber){

			var numberCell = $('#number-cell-' + i + '-' + j);

			numberCell.css('background-color',support.getNumberBackgroundColor(randNumber));
			numberCell.css('color',support.getNumberColor(randNumber));
			numberCell.text(randNumber);

			numberCell.animate({
				width:support.cellSideLength,
				height:support.cellSideLength,
				top:support.getPosTop(i, j),
				left:support.getPosLeft(i , j)
			},50);
	},

 	showMoveAnimation : function(fromx, fromy, tox, toy, scale){
		var numberCell = $('#number-cell-' + fromx + '-' +fromy);

		numberCell.animate({
			top:support.getPosTop(tox, toy),
			left:support.getPosLeft(tox, toy)
		},200);
		//格子合并动画
		if(scale){
			numberCell.addClass("scale");
			$('#number-cell-' + tox + '-' +toy).addClass("scale");
		}
	},



	updateScore:function(_score){
		$('#score').text(_score);
		$('#score').addClass("rote").on("webkitAnimationEnd",function(){
			$('#score').off("webkitAnimationEnd").removeClass("rote");
		});

	},
	actiondo: function(duration) {
	    step = 1;
	   // var that = this;
	    startAngle = Math.PI * 1.5;
	    animation_duration = duration;
	    animation_progress = 0;
	    animation_interval = (duration || 5) * 1000 / n;
	    /*ctx.strokeStyle = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6); //圆圈颜色                
	    ctx.shadowColor = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6); // 设置阴影颜色*/
	    //圆心位置
	    ctx.strokeStyle = '#65bf7f';

	    // clearInterval(progress);
	    ctx.clearRect(0, 0, 200, 200); //清除canvas
	    this.drawArc(startAngle, -0.5 * Math.PI, '#e1f7eb');
	    // this.drawPoint(x, Math.floor(y - radius)); //0%占位原点
	    //progress = setInterval(this.animation, animation_interval);
	},

	actionPause: function(animation) {
	    //clearInterval(progress);
	    if (animation) {

	        $('#pauseimg').css("display", "block");
	        $('#pause').css("display", "block");
	    }
	    /*$('.img').css("background-color","rbga(255,255,255,0.7)");*/
	    //console.log("animation:actionPause!");
	},

	actionPlay: function() {
	    //progress = setInterval(this.animation, animation_interval);
	    $('#pause').css("display", "none");
	    $('#pauseimg').css("display", "none");
	    //console.log("animation:actionPlay!");

	},

	/* animation: function() {

	     if (step <= n) {
	         var _x, _y;
	         endAngle = startAngle + add;
	         _y = x + Math.sin(endAngle) * radius;
	         _x = y + Math.cos(endAngle) * radius;
	         that.drawPoint(_x, _y);
	         // that.drawArc(startAngle, endAngle);
	         startAngle = endAngle;
	         step++;
	     } else {
	         clearInterval(progress);
	     }

	 },*/
	animationGo: function(time) {
	    if (time / animation_duration > animation_progress && animation_progress < 1) {
	        ctx.clearRect(0, 0, 200, 200); //清除canvas
	        var _x, _y;
	        //endAngle = startAngle + add;
	        animation_progress = time / animation_duration;
	        endAngle = 2 * Math.PI * animation_progress - 0.5 * Math.PI;
	        _y = x + Math.sin(endAngle) * radius;
	        _x = y + Math.cos(endAngle) * radius;
	        //that.drawPoint(_x, _y);
	        this.drawArc(endAngle, -0.5 * Math.PI, '#e1f7eb', 'butt');
	        this.drawArc(1.5 * Math.PI, endAngle, '#65bf7f', 'round');
	        // startAngle = endAngle;

	    }
	},
	//进度前进头部圆点
	drawPoint: function(x, y) {
	    ctx.beginPath();
	    ctx.arc(x, y, 5, 0, Math.PI * 2, counterClockwise);
	    ctx.lineWidth = 1;
	    ctx.fillStyle = '#65bf7f';
	    ctx.closePath();
	    ctx.fill();
	    ////console.log("drawPoint");
	},
	//填补圆环
	drawArc: function(s, e, c, cap) {
	    ctx.beginPath();
	    ctx.lineWidth = 10;
	    ctx.lineCap = cap || 'butt';

	    ctx.strokeStyle = c;
	    ctx.arc(x, y, radius, s, e, counterClockwise);
	    ctx.stroke();
	}

    };
});
