Ponder.module('Pages', function(Pages, App, Backbone, Marionette, $, _){

	Pages.Header = Backbone.Marionette.ItemView.extend({
		template : '#template-header', tagName : 'div', className : "hero-unit", initialize : function() {
			back = function() { $('body').animate({'margin-top' : '0px'}); $('#main').removeClass('expand');};
			App.vent.on('route:home', back);
			App.vent.on('route:profile', function() { $('body').animate({'margin-top' : '0px'}); });
			App.vent.on('route:library', function() { $('body').animate({'margin-top' : '0px'}); });
			App.vent.on('route:gallery', function() { $('body').animate({'margin-top' : '0px'}); });
			App.vent.on('route:workspace', function() {
				$('body').animate({'margin-top' : '-280px'}, function() { $('body').animate({'margin-top' : '-210px'});});
				$('#main').addClass('expand');
			});
		}
	});

	// Pages.Footer = Backbone.Marionette.ItemView.extend({
	// 	template : '#template-footer',
	// 	region : App.footer,
	// });

	Pages.NavBar = Backbone.Marionette.ItemView.extend({
		tagName : 'ul', template : '#template-navbar',
		ui : {
			home : '#home',
			login : '#login',
			profile : '#profile',
			library : '#library',
			workspace : '#workspace',
			gallery : '#gallery',
			editor : '#editor'
		},
		events : {
			'click #home' : 'navHome',
			'click #login' : 'fbLogin',
			'click #workspace' : 'navWorkspace',
			'login' : 'toggleProfile',
			'mousover #library' : 'mouseOver'
		},
		toggleProfile : function() {
			this.ui.login.hide();
			this.ui.profile.removeClass('hidden');
		},
		initialize : function() {
			App.vent.on('login', this.toggleProfile, this);
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
		fbLogin : function() { Pages.fbLogin(); },
		navHome : function() { App.vent.trigger('route:home');},
		// navHome : function() { Backbone.history.navigate('home', true);},
		navProfile : function() { Backbone.history.navigate('profile', true);},
		navLibrary : function() { Backbone.history.navigate('library', true);},
		navWorkspace : function() { App.vent.trigger('route:workspace');},
		// navWorkspace : function() { console.log('going'); Backbone.history.navigate('workspace', true); App.main.show(new Pages.Workspace.View(id));},
		navGallery : function() { Backbone.history.navigate('gallery', true);},
		navEditor : function() { Backbone.history.navigate('editor', true);},
		mouseOver : function() { console.log('mouse!'); }
	});

	Pages.fbLogin = function() {
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
	};

	Pages.showHome = function() { App.main.show(new Pages.Home.View()); };
	Pages.showProfile = function() { console.log('showP');/*App.main.show(new Pages.Profile.View()); */};
	Pages.showLibrary = function(id) { console.log('showL');App.main.show(new Pages.Library.View(id)); };
	Pages.showWorkspace = function(id) { console.log('showW'); App.main.show(new Pages.Workspace.View(id)); };
	Pages.showGallery = function() { console.log('showG');/*App.main.show(new Pages.Gallery.View());*/ };
	Pages.showEditor = function() { console.log('showE');/*App.main.show(new Pages.Editor.View()); */};

	Pages.show = function (argument) {
		App.header.show(new Pages.Header());
		// (new Pages.Footer()).show();
		App.navbar.show(new Pages.NavBar());
		App.main.show(new Pages.Home.View());
	}

});