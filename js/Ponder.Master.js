Ponder.module('Master', function(Master, App, Backbone, Marionette, $, _) {

	Master.Router = Marionette.AppRouter.extend({ routes: {		//switching is handled by internal logic - routes exist for History only
			'home(/)': 'noOp',
			'login(/)': 'noOp',
			'profile(/)' : 'noOp',
			'library(/:id)' : 'noOp',
			'workspace(/:id)' : 'noOp',
			'gallery(/)' : 'noOp',
			'docs(/:id)' : 'noOp',
	}, noOp : function() { null; } });

	Master.addInitializer(function() { new Master.Router({ controller : App.Pages });

		App.vent.on('route:home', function() { console.log('goingH'); Backbone.history.navigate('home/', true); App.main.show(new App.Pages.Home.View()); });
		App.vent.on('route:news', function(model) { console.log('goingN',model); Backbone.history.navigate('home/news/' + ((model.id)? model.id : ''), true); });
		App.vent.on('route:workspace', function(id) { console.log('goingW'); Backbone.history.navigate('workspace/' + ((id)? id : ''), true); App.main.show(new App.Pages.Workspace.View({'id':id})); });
		App.vent.on('route:docs', function() { console.log('goingD'); Backbone.history.navigate('docs/', true); App.main.show(new App.Pages.Docs.View()); });
		App.vent.on('route:adoc', function(doc) { console.log('goingAD', doc); Backbone.history.navigate('docs/' + ((doc)? doc : ''), true); });

		App.Pages.show(); App.vent.trigger('routing:started');
	});
})