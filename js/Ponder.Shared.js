Ponder.module('Shared', function(Shared, App, Backbone, Marionette, $, _){

	Shared.Card = Backbone.Model.extend({
		defaults : {
			name : '',
			types : [],
			cost : '',
			pt : '',
			rules : ''
		}
	});

	Shared.Group = Backbone.Collection.extend({
		model : Shared.Card,
		url : '/api/cards',
		// initialize : function() {
		// 	this.fetch();
		// }
	});


	Shared.CardItemView = Marionette.ItemView.extend({
		tagName : 'li',
		template : '#template-Shared-cardItemView',
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

	Shared.LoadingView = Marionette.ItemView.extend({
		template: "#template-Shared-loading"
	});


	Shared.View = Backbone.Marionette.Layout.extend({
		template : '#template-Shared',
		tagName : 'div',
		regions : {
			sidebar : "#sidebar",
			results : "#results"
		}
	});

	Shared.Search = Backbone.Marionette.CompositeView.extend({
		template : '#template-Shared-search',
		tagName : 'div',
		itemView : Shared.CardItemView,
		itemViewContainer : '#card-list',
		emptyView : Shared.LoadingView,
		collection : new Shared.Group(),
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