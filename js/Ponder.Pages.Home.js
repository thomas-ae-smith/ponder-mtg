Ponder.module('Pages.Home', function(Home, App, Backbone, Marionette, $, _){

	//comments model and view
	Home.NewsItemComment = Backbone.Model.extend({ defaults : {author : {}, comment : '', timestring : ''} });
	Home.NewsItemCommentView = Backbone.Marionette.ItemView.extend({ tagName : 'li', template : '#template-home-comment'});
	//comments collection
	Home.NewsComments = Backbone.Collection.extend({ model : Home.NewsItemComment });

	//news item model
	Home.NewsItem = Backbone.Model.extend({	defaults : { title : '', text : '', timestring: '', comments : new Home.NewsComments() }, url : function() { return '/api/news/' + ( this.get('id') || '' ); }, parse : function(resp) {
			console.log('parsing news response',resp);
			if (resp && resp['comments'].length) {
				console.log("found comments");
				this.get('comments').add(resp['comments']);
			}
				delete resp.comments;
			return resp;
		},

});
	//full view with comments
	Home.NewsItemView = Backbone.Marionette.CompositeView.extend({
		template : '#template-home-newsItemView', 
		tagName : 'div', 
		className : 'span7 offset1',
		itemView : Home.NewsItemCommentView, 
		itemViewContainer : '#comments-list', 
		model : new Home.NewsItem(), //
		// collection : new Home.NewsComments(), 
		ui : { textInput : '#textInput' }, 
		events : { 'click #submit' : 'addComment' },
		addComment : function() {
			var comments = this.model.get('comments');
			console.log('comment detected', this.model);
			var comment = this.ui.textInput.val().trim();
			comments.add({author:{name:'', id:''}, 'comment' : comment, timestring : (new Date()).toUTCString()});
			this.model.save();
			this.render();
			console.log('comment saved, supposedly', this.model);
		},
		onRender : function() { console.log('init', this.model);
			$('#submit').click(this.addComment);
			that = this;
			this.model.fetch({'success' : function() {
				console.log('after', that.model);
				that.collection = that.model.get('comments');
				// that.render();
			}})
		}
	});
	//compact view that links to full view
	Home.NewsItemCompactView = Backbone.Marionette.ItemView.extend({ tagName : 'li', template : '#template-home-newsItemCompactView', events : { 'click' : 'loadNews'}, loadNews : function(e) { e.preventDefault(); console.log("here", this.model); App.vent.trigger('route:news', this.model); }});

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
		}, appendHtml: function(collectionView, itemView){ collectionView.$el.find(this.itemViewContainer).prepend(itemView.el); }
	});

	Home.Archives = Home.Main.extend({ template : '#template-home-archives', className : 'span3', itemView : Home.NewsItemTinyView, appendHtml: function(collectionView, itemView){ collectionView.$el.find(this.itemViewContainer).prepend(itemView.el); } });

	Home.View = Backbone.Marionette.Layout.extend({ regions : { main : '#home-main', archives : '#home-archives'}, tagname : 'div', className : 'container', template : '#template-home', onRender : function() { this.main.show(new Home.Main()); this.archives.show(new Home.Archives()); }, initialize : function() { var that = this; App.vent.on('route:news', function(model) { console.log('heard ', that); that.main.show(new Home.NewsItemView({'model' : model})); }); } });


});