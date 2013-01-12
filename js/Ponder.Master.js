Ponder.module('Master', function(Master, App, Backbone, Marionette, $, _) {

	Master.Router = Marionette.AppRouter.extend({
		appRoutes: {
			//'': ''
		}
	});

	Master.Controller = function() {
		//make a collection?
	}


	_.extend(Master.Controller.prototype, {

		start: function(){
			App.Pages.show();
		}
	});

	Master.addInitializer(function() {
		var controller = new Master.Controller();
		new Master.Router({
			controller : controller
		});

		controller.start();
	});
})