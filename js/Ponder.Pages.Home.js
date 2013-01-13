Ponder.module('Pages.Home', function(Home, App, Backbone, Marionette, $, _){

	//comments model and view
	Home.NewsItemComment = Backbone.Model.extend({ defaults : {author : {}, comment : '', timestring : ''} });
	Home.NewsItemCommentView = Backbone.Marionette.ItemView.extend({ tagName : 'li', template : '#template-home-comment'});
	//comments collection
	Home.NewsComments = Backbone.Collection.extend({ model : Home.NewsItemComment });

	//news item model
	Home.NewsItem = Backbone.Model.extend({	defaults : { title : '', text : '', timestring: '', comments : Home.NewsComments } });
	//full view with comments
	Home.NewsItemView = Backbone.Marionette.CompositeView.extend({
		tagName : 'div', template : '#template-home-newsItemView', collection : Home.NewsComments, itemView : Home.NewsItemCommentView, itemViewContainer : '#comments-list', ui : { textInput : '#textInput' }, events : { 'click #submit' : 'addComment' },
		addComment : function() {
			this.model.get('comments').add({author:{name:'', id:''}, comment: this.ui.textInput.val().trim(), timestring : now()});
			this.model.save();
	}	});
	//compact view that links to full view
	Home.NewsItemCompactView = Backbone.Marionette.ItemView.extend({ tagName : 'li', template : '#template-home-newsItemCompactView', events : { 'click' : 'loadNews'}, loadNews : function(e) { e.preventDefault(); console.log("here"); App.vent.trigger('route:news', this.model.get('id')); }});

	Home.NewsItemTinyView = Home.NewsItemCompactView.extend({template : '#template-home-newsItemTinyView'});

	Home.News = Backbone.Collection.extend({ model : Home.NewsItem, url : '/api/news/'});


	Home.Main = Backbone.Marionette.CompositeView.extend({
		template : '#template-home-main',
		tagName : 'div',
		className : 'span7 offset1',
		itemView : Home.NewsItemCompactView,
		itemViewContainer : '.news-list',
		model : new Home.NewsItem(),
		initialize : function() {
			this.collection = new Home.News();
			this.collection.fetch({success: function(model) {console.log("fetched", model);}});
		}
	});

	Home.Archives = Home.Main.extend({ template : '#template-home-archives', className : 'span3', itemView : Home.NewsItemTinyView, appendHtml: function(collectionView, itemView){
    collectionView.$el.find(this.itemViewContainer).prepend(itemView.el);
  }});

	Home.View = Backbone.Marionette.Layout.extend({ regions : { main : '#home-main', archives : '#home-archives'}, tagname : 'div', className : 'container', template : '#template-home', onRender : function() { this.main.show(new Home.Main()); this.archives.show(new Home.Archives()); } });


});