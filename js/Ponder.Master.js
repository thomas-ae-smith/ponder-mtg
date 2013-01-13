Ponder.module('Master', function(Master, App, Backbone, Marionette, $, _) {

	Master.Router = Marionette.AppRouter.extend({
		routes: {		//switching is handled by internal logic - routes exist for History only
			// '(/)': 'noOp',
			'home(/)': 'noOp',
			'login(/)': 'noOp',
			'profile(/)' : 'noOp',
			'library(/:id)' : 'noOp',
			'workspace(/:id)' : 'noOp',
			'gallery(/)' : 'noOp',
			'editor(/)' : 'noOp',
		},
		noOp : function() { null; }
	});

	Master.addInitializer(function() {
		new Master.Router({
			controller : App.Pages
		});
			// Backbone.history.navigate('home', true);
			// console.log('init\'d');

		App.vent.on('route:home', function() {
		 console.log('goingH'); Backbone.history.navigate('home/', true); App.main.show(new App.Pages.Home.View());
		});
		App.vent.on('route:workspace', function(id) {
		 console.log('goingW'); Backbone.history.navigate('workspace/' + ((id)? id : ''), true); App.main.show(new App.Pages.Workspace.View(id));
		});

		App.Pages.show();
		App.vent.trigger('routing:started');
	});
})