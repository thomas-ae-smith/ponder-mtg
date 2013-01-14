Ponder.module('Pages.Docs', function(Docs, App, Backbone, Marionette, $, _){

	Docs.View = Backbone.Marionette.Layout.extend({
		tagname : 'div',
		className : 'container docs',
		template : '#template-docs',
		regions : { doc : '#doc' },
		events : {
			'click #brief' : 'navBrief',
			'click #user' : 'navUser',
			'click #technical' : 'navTechnical'
		},
		initialize : function() { var that = this; App.vent.on('route:adoc', function(doc) { console.log('heard ', that); that.doc.show(new Docs.Doc({template : '#template-docs-' + doc})); }); },
		onRender : function () {
			this.doc.show(new Docs.Doc({template : '#template-docs-choose'})); 

			// $('#brief').click(function() { App.vent.trigger('route:adoc', 'brief') });
			// $('#user').click(function() { App.vent.trigger('route:adoc', 'user') });
			// $('#technical').click(function() { App.vent.trigger('route:adoc', 'technical') });
		},
		navBrief : function() { App.vent.trigger('route:adoc', 'brief'); },
		navUser : function() { App.vent.trigger('route:adoc', 'user'); },
		navTechnical : function() { App.vent.trigger('route:adoc', 'technical'); }
	});

	Docs.Doc = Backbone.Marionette.ItemView.extend({
		tagname : 'div',
		className : 'span10 offset1',
	});

});