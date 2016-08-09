define([
	'butterfly/view',
	'main/support',
	'main/animation',
	'main/api/api',
	'main/lyric/lyric'],
	 function(View,support,animation,Api, Lyric){

 	 return View.extend({

 	 	board : new Array(),
		score : 0,
		hasconflicted : new Array(),
		over : false,
		startx : 0,
		starty : 0,
		endx : 0,
		endy : 0,
		that : this,

		albums: new Array(),
		g_index: 0, //当前歌曲序号
		g_channelId: 1,
		g_channelName: "私人兆赫",
		g_network: 'wifi',
		g_playing: false, //播放状态
		g_songName: "",
		g_songs: new Array(),
		g_channels: new Array(),
		g_currentTime: 0,
		g_lrcIndex: 0,
		g_lyrics: null,
		g_lrcOn: false,
		g_download: false,
		channelScroll: null,
		lrcScroll: null,
		recordScroll: null,

		events: { 
			"click #newgamebutton": "newgame",
			"click .musicbutton": function(){
				console.log('musicbutton*********');
				$('#gameover').css('display',"none");
				$('.content').css('visibility','visible');
			},
			"click .wrap": function() {
				var audio = document.getElementById('audio');
				//Animation.actiondo();
				//console.log("click:audio.paused=" + audio.paused);
				if (audio.paused) { 
					this.playing();
				} else {
					this.pauseing();
				}
			},
			"click .header": function() {

				// $('#channelLayout').fadeIn(300, function(){});
				//console.log($(this));
				//this.channeladdEvent();
				$('.content').css('visibility','hidden');

			},
			"touchstart .next": function() {
				//console.log("touchstart:play next!");
				$('.next').addClass('nextActive');
				audio.pause();
				g_playing = false;
				animation.actionPause();

			},
			"touchend .next": function() {
				//console.log("touchend:play next!");
				$('.next').removeClass('nextActive');
				$('.image').css('background-image', 'url(img.jpg)');
				this.playNext();
			},
			"touchstart .lyric": function() {
				//console.log("touchstart:lyric show!");
				$('.lyric').addClass('lyricActive');
			},
			"touchend .lyric": function() {
				var _this = this;
				//console.log("touchend:lyric show!");
				$('.lyric').removeClass('lyricActive');
				$('#lrcLayout').fadeIn(300, function() {
					_this.lrcScroll = new IScroll('#lrcScroll');
					_this.lrcScroll.refresh();
					_this.g_currentTime = document.getElementById('audio').currentTime;
					_this.g_lrcOn = true;
					console.log(_this.g_currentTime);
					_this.lrcLight(_this.g_currentTime, true);

				});
			},
			"touchstart .record": function() {
				var _this = this;
				$('.record').addClass('recordActive');
				setTimeout(function(){
					_this.channeladdEvent();
				},300) 
			},
			"touchend .record": function() {
				$('.record').removeClass('recordActive');
				//this.recordaddEvent();
				
			},
			"touchstart .more": function() {
				$('.more').addClass('moreActive');
			},
			"touchend .more": function() {
				var _this = this;
				$('.more').removeClass('moreActive');
				$('#menuLayout').fadeIn(function() {
					$('.menuback').on('click', function() {
						$('#menuLayout').fadeOut();
					});
					/*$('.recordbtn').on('click', function() {
						_this.recordaddEvent();
					}); //end of recordbtn*/
					$('.downloadbtn').on('click', function() {
						_this.download(albums[g_index].url, albums[g_index].title, albums[g_index].artist);
						alert('正在下载...');
						$('#menuLayout').fadeOut();
					});
					$('.sharebtn').on('click', function() {
						console.log(albums[g_index - 1].picture);
						_this.share(albums[g_index - 1].picture);
					}); 


				});
			},
			"touchend .lrcInfo": function() {
				//console.log("click: lrc fadeout!")
				for (var i = this.g_lrcIndex; i >= 0; i--) {

					$('.lrcContent').find('p[data-index = ' + i + ']').removeClass('currentlyric');
				};


				$('#lrcLayout').fadeOut();
				this.g_lrcOn = false;

			}
			
		},


	    render: function(){
	     	 console.log('exhibition/index.html render');
	    },

	    onShow: function(){
	      	console.log('exhibition/index.html onShow');
	     	this.prepareForMobile();
			this.newgame();

			this.init(null, null, true);
			this.audioInit();
			this.getChannellist();
			
	    },
	    onHide: function() {
				audio.pause();
				g_playing = false;
				animation.actionPause();
				//console.log('exhibition/index.html onHide');
		},

		init: function(id, name, change) {

			this.g_channelId = id || this.g_channelId;
			this.g_channelName = name || this.g_channelName;
			$('.channelname').text(this.g_channelName);
			//console.log('exhibition/index.html onShow');
			if (change) {

				this.getPlaylist(this.g_channelId);

			}
		},

		recordaddEvent: function() {
			$('#recordLayout').css({
				'display': 'block'
			});
			this.getRecordlist();
			$('.recordback').on('click', function() {
				$('#recordLayout').fadeOut();
			});
			_this.recordScroll = new IScroll('#recordScroll');
			_this.recordScroll.refresh();
			$('.recordtotop').on('click', function() {
				_this.recordScroll.scrollToElement(document.querySelector('.recordTotal'), 300, null, true, IScroll.utils.ease.back)
			});
		},
		channeladdEvent: function() {
			var _this = this;
			$('#channelLayout').css({
				'display': 'block'
			});
			$('.channelback').on('click', function(e) {
				$('#channelLayout').fadeOut();
				////console.log(e);
			});
			$('.channelimg').on('click', function(e) {
				//console.log('click channelimg');
				var name = $(this).data('name');
				var id = $(this).data('id');
				$('#channelLayout').fadeOut();

				/*g_channelChange = true;*/
				// history.go(0);
				_this.init(id, name, true);

			});

			_this.channelScroll = new IScroll('#channelScroll');
			_this.channelScroll.refresh();
		},
		download: function(url, title, artist) {
			var fileTransfer = new FileTransfer();
			var filePath = "sdcard/" + title + '-' + artist + ".mp3";

			fileTransfer.download(
				url,
				filePath,
				function(entry) {
					console.log("download complete: " + entry.fullPath);
					alert("success!");
				},
				function(error) {
					console.log("download error source " + error.source);
					console.log("download error target " + error.target);
					console.log("upload error code" + error.code);
					alert("error!");
				}

			);
		},
		share: function(img) {
			var _this = this;
			window.umappkey = '54b78459fd98c5e4ae000adf';
			var opt = {
				'data': {
					'content': {
						'text': '要分享的文字  '+'http://douban.fm/?start='+ albums[g_index-1].sid+'g'+albums[g_index-1].ssid+'g'+'g0&cid='+_this.g_channelId+albums[g_index-1].sid, //要分享的文字
						//'furl': '', //在线图片URL
						'img': img //本地图片地址 furl和img同时存在时，优先取furl
					}
				}
			}
			/*$(".content").delegate("#menuLayout", "click", function() {

				$(".sharebtn").umshare(opt);
			});*/
			$(".sharebtn").umshare(opt);
		},
		audioInit: function() {
			var _this = this;

			var audio = $('#audio');
			audio.on('timeupdate', function() {
				////console.log("audio ontimeupdate!");
				_this.g_currentTime = document.getElementById('audio').currentTime;
				animation.animationGo(_this.g_currentTime);
				if (_this.g_lrcOn) {

					_this.lrcLight(_this.g_currentTime);
				}
				////console.log("g_currentTime = " + _this.g_currentTime);
			});
			//自动续播
			audio.on('ended', function() {

				//console.log("audio onended!");
				animation.actionPause();
				_this.playNext();

			});

			//暂停
			audio.on('pause', function() {
				//console.log("audio onpause!");

			});

		},
		playing: function() {
			audio.play();
			g_playing = true;
			animation.actionPlay();
		},
		pauseing: function() {

			audio.pause();
			g_playing = false;
			animation.actionPause(true);
		},
		playNext: function() {
			$('.lrcContent').empty();
			$('.lrcContent').append('<p class="nolyric">lyric loading...</p>');
			//console.log("playNext!");
			if (g_index < albums.length) {

				//未至队尾
				this.setPlaying();

			} else {
				//列表已播放完，重新获取列表
				//console.log("albums is empty, reloading new playlist...")
				this.getPlaylist(this.g_channelId);
			}
		},
		GetSongInfo: function() {
			var _this = this;
			var params = {
				data: {
					query: g_songName,
					_: new Date().getTime()
				}
			};
			Api.apiGetSongInfo(params, function(data) {

				//console.log("index.js:apiGetSongInfo success!");
				g_songs = data.song;
				//console.log(data.song);
				/*for (var i = 0; i< g_songs.length; i++) {*/
				//根据歌曲ID获取歌词
				if (g_songs != undefined && g_songs.length != 0) {

					//console.log("songid:" + g_songs[0].songid);
					_this.getSongLyric(g_songs[0].songid);
				} else {
					//console.log("index.js:SongInfo not found!");
					_this.lrcInit();
				}

				//}//end of for
			}, function(err) {

				//console.log(err);
				console.log("index.js:apiGetSongInfo error!");
				_this.lrcInit();
			});
		},
		getSongLyric: function(songid) {
			var _this = this;
			var _params = {
				data: {
					songid: songid || g_songs[0].songid,
					_: new Date().getTime()
				}
			};
			Api.apiGetLyric(_params, function(data) {
				//console.log("index.js:apiGetLyric success!");
				//console.log("songName:" + data.title);
				//console.log("songLyric:" + data.lrcContent);
				//处理歌词
				if (data.lrcContent == undefined || data.lrcContent == '') {
					_this.lrcInit();
				} else {

					_this.lrcInit(data.lrcContent);
				}
				//Api.apiDownLyric();

			}, function(err) {
				console.log("index.js:apiGetLyric error!");
				//console.log(err);
				_this.lrcInit();
			});
		},
		setPlaying: function(url, artist, title, picture, length) {
			var _url = url || albums[g_index].url;
			var _artist = artist || albums[g_index].artist;
			var _title = title || albums[g_index].title;
			var _picture = picture || albums[g_index].picture;
			var _length = length || albums[g_index].length;
			var _titleArtist = _title + "-" + _artist;
			////console.log("playing --" + _title + "-- by " + _artist);
			var audio = $('#audio');
			audio.attr("src", _url);
			$('.musicName').text(_title);
			$('.musicSinger').text(_artist);
			$('.artist').text(_artist);
			$('.songname').text(_title);
			$('.image').css("background-image", 'url(' + _picture + ')');
			$('.musicbutton').css("background-image", 'url(' + _picture + ')');

			if (_titleArtist.length > 50) {
				$('.titleArtist').addClass("marquee");
			}

			$('.lrctitle').text(_title);
			$('.lrcartist').text("/" + _artist);
			$('.lrcContent').find('p[data-index = ' + this.g_lrcIndex + ']').removeClass(' currentlyric');
			audio.load();
			g_lrcIndex = 0;
			
			g_playing = true;
			g_songName = _title;

			/*var olddata = JSON.parse(localStorage.getItem('record'));
			var newdata = JSON.stringify(olddata.push(albums[g_index]));
			localStorage.setItem('record', newdata);*/
			//
			this.GetSongInfo();

			animation.actionPlay();
			//设置进度条
			animation.actiondo(_length);
			if (this.g_download) {

				this.download(_url, _title, _artist);
			}


		},

		getPlaylist: function(channelId) {
			var _this = this;
			var params = {
				data: {
					channel: channelId || 1
				}
			};
			Api.apiPlaylist(params, function(data) {

				g_index = 0;
				albums = data.song;
				_this.setPlaying(albums[g_index].url, albums[g_index].artist, albums[g_index].title, albums[g_index].picture);
				//console.log("loaded Playlist as follow!");
				//console.log("********************************************");
				for (var i = 0; i < albums.length; i++) {
					//console.log(i + ".  " + albums[i].title + " -- " + albums[i].artist);
				};
				//console.log("********************************************");
				//console.log("getPlaylist success!");


			}, function() {
				//console.log("getPlaylist error!");
			});

		},
		getChannellist: function(start, limit, path) {
			var _this = this;

			var _path = path || "/j/explore/hot_channels"; //默认获取热门兆赫
			var params = {
				data: {

					start: start || 1,
					limit: limit || 18,

				},
				path: _path
			};
			Api.apiChannellist(params, function(data) {
				g_channels = data.data.channels;
				var li = '';
				//console.log("loaded Channellist as follow!");
				//console.log("********************************************");
				for (var i = 0; i < g_channels.length; i++) {
					li += '<li class = "channelLi"><a class = "channelimg" data-name="' + g_channels[i].name + '" data-id="' + g_channels[i].id + '" style = "background-image:url(' + g_channels[i].cover + ')" ></a><p class = "channeltitle">' + g_channels[i].name + '</p></li>';
					//console.log(i + ". --" + g_channels[i].name);
				};
				$('.channels').append(li);
				//console.log("********************************************");
				//console.log("getChannellist success!");
				//console.log(data.data.channels);
			}, function(err) {
				//console.log("getChannellist error!");
				//console.log(err);
			});
			//_this.channelScroll.refresh();

		},
		getRecordlist: function() {
			var record = JSON.parse(localStorage.getItem('record'));
			console.log(record);

			var element = $('.recordContent');
			var tpl = $('#tpl').html();

			// 创建数据, 这些数据可能是你从服务器获取的
			var data = {
					list: record
				}
				// 解析模板, 返回解析后的内容
			var render = _.template(tpl);
			var html = render(data);
			// 将解析后的内容填充到渲染元素
			element.html(html);
		},
		lrcInit: function(lrc) {
			/*Lyric.timeLine = null;
			lyrics = [1]null;*/
			g_lyrics = Lyric.dealLrc(lrc);
			if (lrc == undefined || lrc == '') {
				//console.log('lrcInit:lyric not found!');
				$('.lrcContent').empty();
				$('.lrcContent').append('<p class="nolyric">lyric not found!</p>');

			} else {

				$('.lrcContent').empty();
				var _p = "";
				for (var i = 0; i < g_lyrics.length; i++) {
					if (g_lyrics[i][1] == "" || g_lyrics[i][1] == undefined) {
						g_lyrics[i][1] = "...";
					}
					_p += '<p class = " lrcs" data-index = "' + i + '">' + g_lyrics[i][1] + '</p>';
				};
				$('.lrcContent').append(_p);
				//this.lrcScroll.refresh();
			}
			//console.log(Lyric.timeLine);
			//console.log(albums[g_index]);
			//albums[g_index].timeline = Lyric.timeLine;
			albums[g_index].lyrics = g_lyrics;
			//添加收听记录
			Api.apiUpdateLocalStorage('record', albums[g_index]);
			g_index++;
			//console.log(g_lyrics.le[1]ngth);
		},
		lrcLight: function(time, onshow) {

			/*if (onshow) {
				//进入时高亮上次退出前的那一行
				this.lrcScroll.scrollToElement(document.querySelector('p:nth-child(' + (this.g_lrcIndex + 1) + ')'), 300, null, true, IScroll.utils.ease.circular);
				$('.lrcContent').find('p[data-index = ' + this.g_lrcIndex + ']').addClass(' currentlyric');
			} else {*/
			if (g_lyrics == null) {
				return;
			}

			for (var i = g_lrcIndex; i < g_lyrics.length - 1; i++) {

				if (time < g_lyrics[0][0] && i != g_lrcIndex) {
					//console.log('11111')
					$('.lrcContent').find('p[data-index = ' + 0 + ']').addClass(' currentlyric');
					this.lrcScroll.scrollToElement(document.querySelector('p:nth-child(' + (g_lrcIndex + 1) + ')'), 300, null, true, IScroll.utils.ease.back);
					this.lrcScroll.refresh();
					break;
				};
				//符合时间轴显示高亮
				if (g_lyrics[i][0] < time && time < g_lyrics[i + 1][0] && i != g_lrcIndex) {

					// console.log("lrcLight:time = " + time);
					// console.log(i);
					// console.log(g_lrcIndex);
					/*Lyric.lightLrc(this.g_lrcIndex);*/
					//scrollToElement(, 100);
					//console.log('22222')
					this.lrcScroll.scrollToElement(document.querySelector('p:nth-child(' + (g_lrcIndex + 1) + ')'), 300, null, true, IScroll.utils.ease.back);
					//this.lrcScroll.scrollBy(0, -20,1000, IScroll.utils.ease.quadratic);
					$('.lrcContent').find('p[data-index = ' + g_lrcIndex + ']').removeClass('currentlyric');
					$('.lrcContent').find('p[data-index = ' + i + ']').addClass(' currentlyric');
					g_lrcIndex = i;
					this.lrcScroll.refresh();
					/*setTimeout(function(){*/
					////console.log("setTimeout(function() {}, 10);");
					/*	},100);*/

					//lrcScroll.scrollTo(this.g_lrcIndex);
					break;
				}
				if (i == g_lyrics.length - 1) {
					console.log('lrc not fit!');
				}
			}

			//}
		},
	    prepareForMobile: function(){

	    	that = this;
			$(document).bind('keydown',that.Keydown);
			document.addEventListener('touchstart',that.Touchstart);
			document.addEventListener('touchmove',that.Touchmove);
			document.addEventListener('touchend',that.Touchend);

			if(support.documentWidth > 500){
				support.gridContainerWidth = 500;
				support.cellSpace = 20;
				support.cellSideLength = 100;
			}

			$('#grid-container').css('width',support.gridContainerWidth);
			$('#grid-container').css('height',support.gridContainerWidth);
			$('#grid-container').css('padding',support.cellSpace);
			$('#grid-container').css('border-radius',0.02 * support.gridContainerWidth);

			$('.grid-cell').css('width',support.cellSideLength);
			$('.grid-cell').css('height',support.cellSideLength);
		
		},


		Keydown : function(event){

					switch(event.keyCode){
						case 37:
							event.preventDefault();
							if(that.moveLeft()){
								setTimeout("that.generateOneNumber()",210) ;
								setTimeout("that.isgameover()",300);
							}
							break;
						case 38:
							event.preventDefault();
							if(that.moveUp()){
								setTimeout("that.generateOneNumber()",210) ;
								setTimeout("that.isgameover()",300);
							}
							break;
						case 39:
							event.preventDefault();
							if(that.moveRight()){
								setTimeout("that.generateOneNumber()",210) ;
								setTimeout("that.isgameover()",300);
							}
							break;
						case 40:
							event.preventDefault();
							if(that.moveDowm()){
								setTimeout("that.generateOneNumber()",210) ;
								setTimeout("that.isgameover()",300);
							}
							break;
					}
		},



		newgame: function(){
				//初始化棋盘格
				this.initGame();
				//随机两个格子里生成数字
				
				this.generateOneNumber();
				this.generateOneNumber();
				
				$('#gameover').css('display',"none");
		},

		Touchstart : function(event){
			this.startx = event.touches[0].pageX;
			this.starty = event.touches[0].pageY;
		},

		Touchmove : function(event){
			event.preventDefault();
		},

		Touchend : function(event){
					this.endx = event.changedTouches[0].pageX;
					this.endy = event.changedTouches[0].pageY;

					var deltax = this.endx - this.startx;
					var deltay = this.endy - this.starty;

					if (Math.abs(deltax) < 0.3 *support.documentWidth && Math.abs(deltay) < 0.3 *support.documentWidth) {
						return;
					}
					//X
					if(Math.abs(deltax) >= Math.abs(deltay)){
						
						if(deltax > 0){
							//moveRight
							if(that.moveRight()){
								setTimeout("that.generateOneNumber()",210) ;
								setTimeout("that.isgameover()",300);
							}
						}else{
							//moveLeft
							if(that.moveLeft()){
								setTimeout("that.generateOneNumber()",210) ;
								setTimeout("that.isgameover()",300);
							}
						}
					}

					//Y
					else{
						if(deltay > 0){
							//moveDowm
							if(that.moveDowm()){
								setTimeout("that.generateOneNumber()",210) ;
								setTimeout("that.isgameover()",300);
							}
						}else{
							//moveUp
							if(that.moveUp()){
								setTimeout("that.generateOneNumber()",210) ;
								setTimeout("that.isgameover()",300);
							}
						}

					}
		},

		initGame: function(){
			for (var i = 0; i < 4; i ++) 
				for(var j = 0; j < 4; j ++){

					var gridCell = $('#grid-cell-' + i + "-" + j );
					gridCell.css('top', support.getPosTop(i, j));
					gridCell.css('left',support.getPosLeft(i, j));
				}

			for (var i = 0; i < 4; i ++){
				this.board[i] = new Array();
				this.hasconflicted[i] = new Array();
				for(var j = 0; j < 4; j ++){
					this.board[i][j] = 0;
					this.hasconflicted[i][j] = false;
				}
			}

			this.updateBoardView();

			this.score = 0;
			this.over = false;
			animation.updateScore(this.score);
		},

		updateBoardView: function(){

			$('.number-cell').remove();
			for(var i = 0; i < 4; i++)
				for(var j = 0; j < 4; j++){
					$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
					var theNumberCell = $('#number-cell-' + i + '-' + j);

					if (this.board[i][j] == 0) {
						theNumberCell.css('width', '0px');
						theNumberCell.css('height', '0px');
						theNumberCell.css('top',support.getPosTop(i, j) + 0.5 * support.cellSideLength);
						theNumberCell.css('left',support.getPosLeft(i, j) + 0.5 * support.cellSideLength);
					}
					else{
						theNumberCell.css('width', support.cellSideLength);
						theNumberCell.css('height', support.cellSideLength);
						theNumberCell.css('top',support.getPosTop(i, j));
						theNumberCell.css('left',support.getPosLeft(i, j));
						theNumberCell.css('background-color',support.getNumberBackgroundColor(this.board[i][j]));
						theNumberCell.css('color',support.getNumberColor(this.board[i][j]));
						theNumberCell.text(this.board[i][j]);
					}

					if (this.board[i][j] > 64) {
						if (support.gridContainerWidth < 300) {
							theNumberCell.addClass('fontsize15');
						}
						else if(support.gridContainerWidth < 350){
							theNumberCell.addClass('fontsize17');
						}
						else if(support.gridContainerWidth < 400){
							theNumberCell.addClass('fontsize20');
						}else{
							theNumberCell.addClass('fontsize25');
						}	

					}

						this.hasconflicted[i][j] = false;
				}

			$('.number-cell').css('line-height', support.cellSideLength + 'px');
			$('.number-cell').css('font-size', 0.6 * support.cellSideLength + 'px');
		},

		generateOneNumber: function(){

			if(support.nospace(this.board))
				return false;
			//随机一个位置
			var randx;
			var randy;
			var times = 0;
			do{
				randx = parseInt(Math.floor(Math.random()*4));
				randy = parseInt(Math.floor(Math.random()*4));
				times++;
				if(this.board[randx][randy] == 0)
					break;
			}while(times < 50);

			if(times == 50){
				for (var i = this.board.length - 1; i >= 0; i--) {
					for (var j = this.board.length - 1; j >= 0; j--) {
						if(this.board[i][j] == 0){
							randx = i;
							randy = j;
						}
					}
				}
			}
			//随机一个数字
			var randNumber = Math.random() < 0.5 ? 2 : 4;

			//随机一个位置显示
			this.board[randx][randy] = randNumber;
			animation.showNumberWithAnimation(randx, randy, randNumber);

			return true;
		},

		isgameover: function(){
			if(support.nospace(this.board) && support.nomove(this.board)){
				this.gameover();
			}
		},

		gameover: function(){
			if(this.over)
				return;
			$('#gameover').show();
			$('#gameover').css('width',(support.gridContainerWidth - 2 * support.cellSpace ));
			$('#gameover').css('height',(support.gridContainerWidth - 2 * support.cellSpace ));
			$('#gameover').css('top',$('#grid-container').offset().top + support.cellSpace);
			//$('#gameover').css('left',getPosLeft(0, 0));
			//$('#gameover').css('padding',cellSpace);
			$('#gameover').css('border-radius',0.02 * support.gridContainerWidth)
			over = true;
			//console.log(over);

			//alert("gameover");

		},

		moveLeft: function(){
			if(!support.canMoveLeft(this.board)) 
				return false;

			//movrLeft
			for(var i = 0; i < 4; i++)
				for(var j = 1; j < 4; j++){
					if(this.board[i][j] != 0){

						for(var k = 0; k < j; k++ ){
							if(this.board[i][k] == 0 && support.noBlockHorizontal(i, k, j, this.board)){
								//move
								animation.showMoveAnimation(i, j, i , k);
								this.board[i][k] = this.board[i][j];
								this.board[i][j] = 0;
								continue;
							}	
							else if(this.board[i][k] == this.board[i][j] && support.noBlockHorizontal(i, k, j, this.board) && !this.hasconflicted[i][k]){
								//move
								animation.showMoveAnimation(i, j ,i, k, true);
								//add
								this.board[i][k] += this.board[i][j];
								this.board[i][j] = 0;
								//add score
								this.score +=this.board[i][k];
								animation.updateScore(this.score);
								this.hasconflicted[i][k] = true;
								continue;
							}
						}
					}
				}
			setTimeout("that.updateBoardView()",200) ;
			return true;
		},

		moveRight:function(){
			if(!support.canMoveRight(this.board)) 
				return false;

			//movrRight
			for(var i = 0; i < 4; i++)
				for(var j = 2; j >= 0; j--){
					if(this.board[i][j] != 0){

						for(var k = 3; k > j; k-- ){
							if(this.board[i][k] == 0 && support.noBlockHorizontal(i, j, k, this.board)){
								//move
							 	animation.showMoveAnimation(i, j , i, k);
								this.board[i][k] = this.board[i][j];
								this.board[i][j] = 0;
								continue;
							}	
							else if(this.board[i][k] == this.board[i][j] && support.noBlockHorizontal(i, j, k, this.board) && !this.hasconflicted[i][k]){
								//move
								 animation.showMoveAnimation(i, j , i, k, true);
								//add
								this.board[i][k] += this.board[i][j];
								this.board[i][j] = 0;
								//add score
								this.score +=this.board[i][k];
								animation.updateScore(this.score);
								this.hasconflicted[i][k] = true;
								continue;
							}
						}
					}
				}
			setTimeout("that.updateBoardView()",200) ;
			return true;
		},

		moveUp: function(){
			if(!support.canMoveUp(this.board)) 
				return false;

			//movrUp
			for(var j = 0; j < 4; j++)
				for(var i = 1; i < 4; i++){
					if(this.board[i][j] != 0){

						for(var k = 0; k < i; k++){
							if(this.board[k][j] == 0 && support.noBlockVertical(j, k, i, this.board)){
								//move
								animation.showMoveAnimation(i, j, k, j);
								this.board[k][j] = this.board[i][j];
								this.board[i][j] = 0;
								continue;
							}	
							else if(this.board[k][j] == this.board[i][j] && support.noBlockVertical(j, k, i, this.board) && !this.hasconflicted[k][j]){
								//move
								animation.showMoveAnimation(i, j, k, j, true);
								//add
								this.board[k][j] += this.board[i][j];
								this.board[i][j] = 0;
								//add score
								this.score +=this.board[k][j];
								animation.updateScore(this.score);
								this.hasconflicted[k][j] = true;
								continue;
							}
						}
					}
				}
			setTimeout("that.updateBoardView()",200) ;
			return true;
		},

		moveDowm: function(){
			if(!support.canMoveDowm(this.board)) 
				return false;

			//movrDowm
			for(var j = 0; j < 4; j++)
				for(var i = 2; i >= 0 ; i--){
					if(this.board[i][j] != 0){

						for(var k = 3; k > i; k--){
							if(this.board[k][j] == 0 && support.noBlockVertical(j, i, k, this.board)){
								//move
								animation.showMoveAnimation(i, j, k, j);
								this.board[k][j] = this.board[i][j];
								this.board[i][j] = 0;
								continue;
							}	
							else if(this.board[k][j] == this.board[i][j] && support.noBlockVertical(j, i, k, this.board) && !this.hasconflicted[k][j]){
								//move
								animation.showMoveAnimation(i, j, k, j, true);
								//add
								this.board[k][j] += this.board[i][j];
								this.board[i][j] = 0;
								//add score
								this.score +=this.board[k][j];
								animation.updateScore(this.score);
								this.hasconflicted[k][j] = true;
								continue;
							}
						}
					}
				}
			setTimeout("that.updateBoardView()",200) ;
			return true;
		}

	  });
	});
