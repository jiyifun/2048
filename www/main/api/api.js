define([], function() {
	var server = "";
	var doubanServer = "http://douban.fm";
	var baiduServer = "http://tingapi.ting.baidu.com/v1/restserver/ting";
	var baiduServer2 = "http://ting.baidu.com/data/music/links";
	return {

		request: function(params, reqLayout, load) {
			_this = this;
			var defaults = {
				url: server + params.path,
				type: 'GET',
				contentType: 'application/jsonp; charset=utf-8', //raw; charset=utf-8
				timeout: 1000 * 60 * 5,
				dataType: "json",

				beforeSend: function() {
					if (load)
						_this.openLoad(); //打开加载层  
				},
				complete: function(data) {
					if (load)
						_this.closeLoad(); //关闭加载层  
				}

			}

			params = _.extend(defaults, params); //附加上默认的请求参数

			$.ajax(params);
		},
		openLoad: function() {
			$('#loadingLayout').fadeIn();
		},
		closeLoad: function() {
			$('#loadingLayout').fadeOut();
		},
		getHashParams: function(urlKey) {
			var hash = window.location.hash;
			if (hash != "") {

				var keyLength = urlKey.length;
				var params = new Array();
				params = hash.split("?");
				var array = new Array();
				array = params[1].split("&");
				for (var i = array.length - 1; i >= 0; i--) {
					var param = array[i].split("=");
					if (param[0] == urlKey)
						return param[1];
				}
			}
			return false;

		},

		apiPlaylist: function(params, success, error) {


			params.data.from = "mainsite";
			params.data.kbps = 128;
			params.data.type = "n";
			params.path = "/j/mine/playlist";
			server = doubanServer;
			params.success = success;
			params.error = error;
			this.request(params, true, true);

		},

		apiChannellist: function(params, success, error) {


			server = doubanServer;
			params.success = success;
			params.error = error;
			this.request(params, true);
		},
		apiGetSongInfo: function(params, success, error) {

			params.path = "?from=webapp_music&method=baidu.ting.search.catalogSug&callback=search_catalogSug_1420006336525&format=jsonp&qq-pf-to=pcqq.discussion";
			params.dataType = "jsonp";

			server = baiduServer;
			params.success = success;
			params.error = error;
			this.request(params, true);

		},
		apiGetLyric: function(params, success, error) {

			//params.path = "";
			params.path = "?from=webapp_music&method=baidu.ting.song.lry&format=jsonp&callback=search_catalogSug_1420006336525&qq-pf-to=pcqq.discussion"
			params.dataType = "jsonp";

			server = baiduServer;
			params.success = success;
			params.error = error;
			this.request(params, true);
		},
		apiDownLyric: function(params, success, error) {
			params.path = "";
			params.dataType = "json";
			server = baiduServer2;
			params.success = success;
			params.error = error;
			this.request(params, true);
		},
		//为localstorage添加数据
		apiUpdateLocalStorage: function(key, value) {
			
			var newdata = [];
			if (localStorage.getItem(key) != undefined) {
				newdata = JSON.parse(localStorage.getItem(key));
			}
			newdata.push(value);
			localStorage.setItem(key, JSON.stringify(newdata));

		}

	}

});