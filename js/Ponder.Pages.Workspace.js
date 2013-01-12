Ponder.module('Pages.Workspace', function(Workspace, App, Backbone, Marionette, $, _){

	Workspace.Card = Backbone.Model.extend({
		defaults : {
			name : '',
			types : [],
			cost : '',
			pt : '',
			rules : ''
		}
	});

	Workspace.Group = Backbone.Collection.extend({
		model : Workspace.Card,
		url : '/api/cards',
		// initialize : function() {
		// 	this.fetch();
		// }
	});


	Workspace.CardItemView = Marionette.ItemView.extend({
		tagName : 'li',
		template : '#template-workspace-cardItemView',
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

	Workspace.LoadingView = Marionette.ItemView.extend({
		template: "#template-workspace-loading"
	});


	Workspace.View = Backbone.Marionette.Layout.extend({
		template : '#template-workspace',
		tagName : 'div',
		className : 'row-fluid',
		regions : {
			sidebar : "#sidebar",
			canvas : "#canvas"
		},
		onRender : function() {
			this.sidebar.show(new Workspace.Search());
		}
	});

	Workspace.Search = Backbone.Marionette.CompositeView.extend({
		template : '#template-workspace-search',
		// tagName : 'div',
		itemView : Workspace.CardItemView,
		itemViewContainer : '#card-list',
		emptyView : Workspace.LoadingView,
		collection : new Workspace.Group(),
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