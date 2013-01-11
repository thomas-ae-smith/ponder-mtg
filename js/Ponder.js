var Ponder = new Backbone.Marionette.Application();

Ponder.addRegions({
	sidebar		: '#sidebar',
	main		: '#main'
});

Ponder.on('initialize:after', function() {
	Backbone.history.start();
})