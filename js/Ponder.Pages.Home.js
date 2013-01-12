Ponder.module('Pages.Home', function(Home, App, Backbone, Marionette, $, _){

	Home.NewsItemView = Marionette.ItemView.extend({
		tagName : 'li',
		template : '#template-newsItemView'

	});

	Home.View = Backbone.Marionette.CompositeView.extend({
		template : '#template-home',
		tagName : 'div',
		itemView : Home.NewsItemView,
		itemViewContainer : '#news-list'
	});

});