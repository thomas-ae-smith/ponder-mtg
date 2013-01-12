<?php


$app->put('/users/:id(/)', function($id) use ($app) {
	//add user
});

$app->post('/users(/)', function() use ($app) {
	//edit user
}); 
	
$app->get('/users/:id(/)', function($id) use ($app) {
	//get a user by id
});

$app->get('/users/', function() use ($app) {
	//log in a user
	echo "all the users";
});

$app->delete('/users/:id(/)', function($id) use ($app) {
	//logout a user
});

