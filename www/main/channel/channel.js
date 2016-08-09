define(['butterfly/view', 'main/api/api'], function(View, Api) {

	var g_channels = new Array();
	return View.extend({
		

		render: function() {
			console.log('exhibition/channel.html render');
		},

		onShow: function() {
			console.log('exhibition/channel.html onShow');
			this.getChannellist();
		},
		
	});
});