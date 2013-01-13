Ponder.module('Pages', function(Pages, App, Backbone, Marionette, $, _){

	Backbone.Marionette.ItemView.prototype.show = function() {
		this.region.show(this);
	};

	Pages.Header = Backbone.Marionette.ItemView.extend({
		template : '#template-header',
		tagName : 'h2',
		region : App.header
	});

	Pages.Footer = Backbone.Marionette.ItemView.extend({
		template : '#template-footer',
		region : App.footer,
	});

	Pages.NavBar = Backbone.Marionette.ItemView.extend({
		tagName : 'ul',
		template : '#template-navbar',
		// region : App.navbar,
		ui : {
			home : '#home',
			lognav : '#login',
			profile : '#profile',
			library : '#library',
			workspace : '#workspace',
			gallery : '#gallery',
			editor : '#editor'
		},
		events : {
			 'click' : 'fbLogin',
			 'login' : 'toggleProfile'
		},
		toggleProfile : function() {
			console.log(this.ui);
			// this.el.('#home').hide();
			// this.ui.profile.show();
		},
		initialize : function() {
			App.vent.on('login', this.toggleProfile);
			FB.init({
				appId      : '249511971845829', // App ID from the App Dashboard
				channelUrl : '//'+window.location.hostname+'/channel.php', // Channel File for x-domain communication
				status     : true, // check the login status upon init?
				cookie     : true, // set sessions cookies to allow your server to access the session?
				xfbml      : true  // parse XFBML tags on this page?
			});
			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					App.vent.trigger('login');
					console.log('connected');
				} else if (response.status === 'not_authorized') {
					console.log('not_authorized');
				} else {
					console.log('not_logged_in');
				}
			});
			console.log('fbinit called');
		},
		fbLogin : function() {
			FB.login(function(response) {
				if (response.authResponse) {
					App.vent.trigger('login');
					// (function testAPI() {
					// 	console.log('Welcome!  Fetching your information.... ');
					// 	FB.api('/me', function(response) {
					// 		console.log('Good to see you, ' + response.name + '.');
					// 	});
					// }());
				} else {
					// cancelled
				}
			});
		}

	});

	Pages.show = function (argument) {
		(new Pages.Header()).show();
		(new Pages.Footer()).show();
		App.navbar.show(new Pages.NavBar());
		App.main.show(new Pages.Workspace.View());
	}

});