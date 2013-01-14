<?php



function output_user($user) { return array('name' => $user->name, 'nick' => $user->nick, 'library_id' => $user->deck_id); }

function processUser($data, $id) {
	$data = json_decode($app->request()->getBody());
	$user = ($id)? R::load('user', $id) : R::dispense('user');
	$user->name = $data->name;
	$user->nick = $data->nick;
	$user->library_id = $data->library_id;
	return R::store($user);
}

$app->put('/users/:id(/)', function($id) use ($app) { processUser($id); }); //add user

$app->post('/users(/)', function() use ($app) { echo output_json(array('id' => processUser(null))); });  //create user
	
$app->get('/users/:id(/)', function($id) use ($app) { output_json( output_user( R::load('user', $id) ) ); }); //get a user by id

$app->get('/users(/)', function() use ($app) { output_json(array_values(array_map(function($user) { return output_user($user); }, R::findAll('users')))); }); //log in a user
	// list($ponder, $wizards) = R::dispense('users', 2);
	// $ponder->name = 'System Admin';
	// $ponder->nick = "Ponder";
	// R::store($ponder);
	// $wizards->name = "Wizards of the Coast";
	// $wizards->nick = "Wizards";
	// R::store($wizards);
	// echo "all the users";

$app->delete('/users/:id(/)', function($id) use ($app) { });	//logout a user

