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
		template : '#template-navbar',
		region : App.navbar,
		// collection : Backbone.Collection.extend({
		// 	blah : 'bleh'
		// }),

		// UI bindings create cached attributes that
		// point to jQuery selected objects
		// ui : {
		// 	input : '#login'
		// },

		// events : {
		// 	'keypress #new-todo':   'onInputKeypress'
		// },

		// onInputKeypress : function(evt) {
		// 	var ENTER_KEY = 13;
		// 	var loginText = this.ui.input.val().trim();

		// 	if ( evt.which === ENTER_KEY && loginText ) {
		// 		//TODO handle login
		// 		this.ui.input.val('');
		// 	}
		// }
	});

	Pages.show = function (argument) {
		(new Pages.Header()).show();
		(new Pages.Footer()).show();
		App.navbar.show(new Pages.NavBar());
		App.main.show(new Pages.Workspace.View());
	}

});