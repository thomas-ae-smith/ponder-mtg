<?php


$app->get('/links(/)', function() use ($app) {
	$links = array( array('link' => 'Home', 'route' => '/'),
					array('link' => 'Login', 'route' => '/login') );
	output_json($links);

// 	// this.collection.add(//[
		// 	// 	// {'link' : 'Home', 'route' : '/'},
		// 	// 	// {'link' : 'Login', 'route' : '/login'},
		// 	// 	// {'link' : 'Library', 'route' : '/search'},
		// 	// 	// {'link' : 'Workspace', 'route' : '/workspace'},
		// 	// 	// {'link' : 'Gallery', 'route' : '/decks'},
		// 	// 	{'link' : 'Editor', 'route' : '/editor'}
		// 	// // ]);
		// 	// );
});