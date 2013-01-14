Ponder.module('Pages.Workspace', function(Workspace, App, Backbone, Marionette, $, _){

	Workspace.Card = Backbone.Model.extend({
		defaults : {
			name : '',
			types : [],
			cost : '',
			pt : '',
			rules : '',
			cmc : '',
			mana : '',
			ci : '',
			hybrid : false
		},
		events : {
			'change' : 'onChange'
		},
		processCost : function() {
			function img(code) { return "<img src=\"\/img\/Mana" + code + ".gif\">"; }
			var cost = this.get('cost');
			var cmc = 0;
			var tags = '';
			var ci = {};
			for (var i = 0; i < cost.length; i++) {
				switch (cost[i]) {
					case 'X': tags += img(cost[i].toLowerCase()); break;
					case 'W': case 'U': case 'B': case 'R': case 'G': case 'S': 
						tags += img(cost[i].toLowerCase()); cmc +=1; ci[cost[i]] = true; break;
					case '(': tags += img(cost[i+1] + cost[i+3]); cmc += (cost[i+1] == '2')? 2 : 1;
						if(isNaN(cost[i+1])){ ci[cost[i+1]] = true;}; if(cost[i+3] != 'p'){ ci[cost[i+3]] = true; }; i += 4; break;
					default: tags += (isNaN(cost[i+1]))? img(cost[i]) : img((cost[i]*10) + cost[i+1]*1);
						cmc += (isNaN(cost[i+1]))? cost[i]*1 : (cost[i]*10) + cost[i+1]*1; i += (isNaN(cost[i+1]))? 0 : 1;
				}
			};
			ci = _.keys(ci).join('') || 0;
			this.set({'cmc' : cmc, 'mana' : tags, 'ci' : ci, 'hybrid' : (ci && ci == ci.toLowerCase()), silent : true });
		},
		onChange : function(model) {
			if (model.get('cost')) {
				this.processCost();
			}
			// console.log(this.get('name'), "processed:", this.get('mana'));
		},
		initialize : function() {
			this.on('change', this.onChange);
			this.onChange(this);
			// this.onChange(this);
			// this.set({'name' : 'test'});
		}
	});

	Workspace.Group = Backbone.Collection.extend({
		model : Workspace.Card,
		url : '/api/cards',
		toJSON : function() {
			return this.map(function(model){ return { 'name' : model.get("name"), 'id' : model.get("id") }; });
		}
		// initialize : function() {
		// 	this.fetch();
		// }
	});

	Workspace.Deck = Backbone.Model.extend({
		defaults : {
			name : 'New Deck',
			owner : 'Anonymous',
			// cards : new Workspace.Group(),
			cards : {},
			sideboard : new Workspace.Group(),
		},
		url : function() { console.log('/api/decks/' + ( this.get('id') || '' ));
			return '/api/decks/' + ( this.get('id') || '' ); },
		initialize : function() {
			// this.get('sideboard').wrapper = this.get('cards').wrapper = this;
		},
		parse : function(resp) {
			console.log(resp);
			if (resp && resp['cards']) {
				console.log("found cards");
				this.get('cards').add(resp['cards']);
				delete resp.cards;
			}
			return resp;
		},
	})


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
			App.vent.trigger('search:add', this.model);
			this.ui.collapse.collapse('toggle');
		},

		onRender : function() {
			var card = this.$el;
			var colours = { '0' : 'lightgray', 'w' : 'cornsilk', 'W' : 'wheat', 
				'u' : 'lightblue', 'U' : 'blue', 'b' : 'gray', 'B' : 'black', 
				'r' : 'lightcoral', 'R' : 'red', 'g' : 'darkseagreen', 'G' : 'green', 
				'm' : '#E1B74D', 'M' : 'goldenrod', 'l' : 'burlywood', 'L' : 'sienna' };
			this.ui.collapse.on('show', function () {
				card.animate({'border-radius': '10px'});
			})
			
			this.ui.collapse.on('hide', function () {
				card.animate({'border-radius': '0px'});
			})
			var ci = this.model.get('ci');
			var types = this.model.get('types');
			if ($.inArray('Land', types) > -1) {
				var rules = this.model.get('rules');
				ci += ($.inArray('Plains', types) > -1 || rules.indexOf('{W}') > -1)? 'W' : '';
				ci += ($.inArray('Island', types) > -1 || rules.indexOf('{U}') > -1)? 'U' : '';
				ci += ($.inArray('Swamp', types) > -1 || rules.indexOf('{B}') > -1)? 'B' : '';
				ci += ($.inArray('Mountain', types) > -1 || rules.indexOf('{R}') > -1)? 'R' : '';
				ci += ($.inArray('Forest', types) > -1 || rules.indexOf('{G}') > -1)? 'G' : '';
			}
			switch (ci.length) {
				case 1:
					card.css({'background-color' : colours[ci.toUpperCase()]});//TODO for the grunge
					card.find('hr').css({'background-color' : colours[ci.toUpperCase()]});
					break;
				case 2:
					if (this.model.get('hybrid')) {
						card.css({'background' : '-webkit-gradient(linear, 0 0, 100% 0, from(' + colours[ci[0]] + '), to(' + colours[ci[1]] + '))' });
					} else {
						card.css({'background-color' : colours['M']}); //TODO for the grunge
					}
					card.find('hr').css({'background' : '-webkit-gradient(linear, 0 0, 100% 0, from(' + colours[ci[0].toUpperCase()] + '), to(' + colours[ci[1].toUpperCase()] + '))'});
					break;
				default:
					card.css({'background-color' : colours['M']});		//TODO for th grunge
					card.find('hr').css({'background-color' : colours['M']});
			}
			if ($.inArray('Artifact', types) > -1) {
				card.css({'background-color' : colours['0']});
				if (!ci) { card.find('hr').css({'background-color' : colours['b']}); };
			}
			if ($.inArray('Land', types) > -1) {
				card.css({'background-color' : colours['L']});
				if (!ci) { card.find('hr').css({'background-color' : colours['L']}); };
			}

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
			this.canvas.show(new Workspace.Canvas());
		}
	});

	Workspace.Canvas = Backbone.Marionette.CompositeView.extend({
		template : '#template-workspace-canvas',
		itemView : Workspace.CardItemView,
		itemViewContainer : '#card-area',
		emptyView : Workspace.LoadingView,
		collection : new Workspace.Group(),
		model : new Workspace.Deck(),
		ui : { viewName : '#viewName', editName : '#editName' },
		events : {
			'click #save' : 'triggerSave',
			'mouseover #viewname' : 'toggleEdit',
			'blur #editName' : 'toggleEdit',
			'keypress #editName' : 'onInputKeypress'
		},
		addCard : function(card) {
			console.log(this.collection);
			console.log(this.model.get('cards'));
			this.collection.add(card);
		},
		triggerSave : function() {
			if (this.model.get('id') != 5) {
			console.log(this.model.get('id'));
				this.model.set({'id' : 5});
				this.model.fetch();
				return;
			}

			console.log("sending", this.model);
			this.model.set({'name' : this.ui.editName.val().trim()});
			this.model.save(this.model,{ success : function(model, response, options) {
				console.log("success", model, response, options);
			}, error : function(model, xhr, options) {
				console.log("error", model, xhr, options);
			} } );
		},
		onInputKeypress : function(e) {
			if ( e.which === 13 ) {	//ENTER_KEY
				e.preventDefault();
				this.toggleEdit();
		}	},
		toggleEdit : function() {
			console.log('togglin\'');
			// this.model.set({'name' : this.ui.editName.val()});
			$('#viewName').val($('#editName').val());
			$('#viewName').toggleClass('hidden');
			$('#editName').toggleClass('hidden');
		},
		initialize : function() {
			this.model.set({'cards' : this.collection });
			this.bindTo(App.vent, 'search:add', this.addCard, this);
			this.bindTo(this.model, 'change', this.render, this);
		},
		onRender : function() {
			console.log('rendered workspace');
			$('#viewName').click(this.toggleEdit);
			$('#editName').blur(this.toggleEdit);
			$('#editName').keypress(this.onInputKeypress);
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
				if (!this.ui.list.hasClass('in')) this.ui.list.collapse('show');
			}
			
		}
	});

});