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

	Pages.Link = Backbone.Model.extend({
		defaults : {
			link : '',
			linkroute : ''
		}
	});

	Pages.LinkList = Backbone.Collection.extend({ 
		model : Pages.Link,
		url : '/api/links',
		initialize : function() {
			// this.add([{'link' : 'Home', 'linkroute' : '/'}]);
			console.log('new collection created');
		}
	});

	Pages.NavBar = Backbone.Marionette.CompositeView.extend({
		template : '#template-navbar',
		// region : App.navbar,
		events : {
			 // 'click' : 'fbLogin'
		},
		ItemViewContainer : '#nav-list',
		ItemView : Marionette.ItemView.extend({
			tagName : 'li',
			template : '#template-navbar-item',
			events : { 'click' : 'onClick' },
			onClick : function() {
				Backbone.history.navigate(this.model.get('route'));
			}
		}),
		emptyView : Marionette.ItemView.extend({
			template: "#template-workspace-loading"
		}),
		collection : new Pages.LinkList(),
		initialize : function() {
			console.log("view initied");
			this.collection.fetch();
		},
		onRender : function() {
			console.log("view rendered");
			this.collection.add({'link' : 'Home', 'route' : '/'}, {silent:true});
		}	
		// 	// this.collection.add(//[
		// 	// 	// {'link' : 'Home', 'route' : '/'},
		// 	// 	// {'link' : 'Login', 'route' : '/login'},
		// 	// 	// {'link' : 'Library', 'route' : '/search'},
		// 	// 	// {'link' : 'Workspace', 'route' : '/workspace'},
		// 	// 	// {'link' : 'Gallery', 'route' : '/decks'},
		// 	// 	{'link' : 'Editor', 'route' : '/editor'}
		// 	// // ]);
		// 	// );

		// 	FB.init({
		// 		appId      : '249511971845829', // App ID from the App Dashboard
		// 		channelUrl : '//'+window.location.hostname+'/channel.php', // Channel File for x-domain communication
		// 		status     : true, // check the login status upon init?
		// 		cookie     : true, // set sessions cookies to allow your server to access the session?
		// 		xfbml      : true  // parse XFBML tags on this page?
		// 	});
		// 	FB.getLoginStatus(function(response) {
		// 		if (response.status === 'connected') {
		// 			console.log('connected');
		// 		} else if (response.status === 'not_authorized') {
		// 			console.log('not_authorized');
		// 		} else {
		// 			console.log('not_logged_in');
		// 		}
		// 	});
		// 	console.log('fbinit called');
		// },
		// fbLogin : function() {
		// 	FB.login(function(response) {
		// 		if (response.authResponse) {
		// 			(function testAPI() {
		// 				console.log('Welcome!  Fetching your information.... ');
		// 				FB.api('/me', function(response) {
		// 					console.log('Good to see you, ' + response.name + '.');
		// 				});
		// 			}());
		// 		} else {
		// 			// cancelled
		// 		}
		// 	});
		// }

	});

	Pages.show = function (argument) {
		(new Pages.Header()).show();
		(new Pages.Footer()).show();
		App.navbar.show(new Pages.NavBar());
		App.main.show(new Pages.Workspace.View());
	}

});