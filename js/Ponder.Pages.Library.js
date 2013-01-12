Ponder.module('Pages.Library', function(Library, App, Backbone, Marionette, $, _){

	Library.Card = Backbone.Model.extend({
		defaults : {
			name : '',
			types : [],
			cost : '',
			pt : '',
			rules : ''
		}
	});

	Library.Group = Backbone.Collection.extend({
		model : Library.Card,
		url : '/api/cards',
		// initialize : function() {
		// 	this.fetch();
		// }
	});


	Library.CardItemView = Marionette.ItemView.extend({
		tagName : 'li',
		template : '#template-library-cardItemView',
		className : 'card',
		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui : {
			collapse : '.collapse'
		},
		events : {
			'click' : 'onClick'
		},

		onClick : function() {
			this.ui.collapse.collapse('toggle');
		},

		onRender : function() {
			var card = this.$el;
			this.ui.collapse.on('show', function () {
				card.animate({'border-radius': '10px'});
			})
			
			this.ui.collapse.on('hide', function () {
				card.animate({'border-radius': '0px'});
			})
		}

	});

	Library.LoadingView = Marionette.ItemView.extend({
		template: "#template-library-loading"
	});


	Library.View = Backbone.Marionette.Layout.extend({
		template : '#template-library',
		tagName : 'div',
		regions : {
			sidebar : "#sidebar",
			results : "#results"
		}
	});

	Library.Search = Backbone.Marionette.CompositeView.extend({
		template : '#template-library-search',
		tagName : 'div',
		itemView : Library.CardItemView,
		itemViewContainer : '#card-list',
		emptyView : Library.LoadingView,
		collection : new Library.Group(),
		ui : {
			input : "#input",
			search : "#search",
			list : "#card-list"
		},
		events : {
			'keypress #input': 'onInputKeypress',
			'click #search': 'search'
		},
		onInputKeypress: function(e) {
			var ENTER_KEY = 13;
			if ( e.which === ENTER_KEY ) {
				e.preventDefault();
				this.search();
			}
		},
		search: function() {
			var searchText = this.ui.input.val().trim();

			if ( searchText && searchText.length > 2 ) {
				this.collection.url = '/api/cards/search/' + searchText;
				this.collection.fetch();
				this.ui.list.collapse('show');
			}
			
		}
	});

});