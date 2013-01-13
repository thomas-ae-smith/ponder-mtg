var Ponder = new Backbone.Marionette.Application();

Ponder.addRegions({
	header		: '#header',
	navbar		: '#navbar',
	main		: '#main',
	footer		: '#footer'
});

// Ponder.on('initialize:after', function() {
// 	Backbone.history.start();
// })

Ponder.vent.on("routing:started", function(){
	console.log("routing has started");
	// if (!Backbone.History.started) 
		Backbone.history.start();
		Backbone.history.navigate('home', true);

});


/* layouts:
Home page 
Gallery 
Workspace 
Library 
Editor
Profile 
*/