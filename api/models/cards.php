<?php


$app->put('/cards/:id(/)', function($id) use ($app) { }); 	//add card

$app->post('/cards(/)', function() use ($app) {}); 	//edit card

function output_cards($cards) {
	return array_map(function ($card) {
		$types = array_values(array_map(function ($type) { return $type->name; }, $card->sharedType));
		// $editions = array_map(function ($edition) { return array( 'set' => R::load('set', $edition->set_id)->name, 'rarity' => R::load('rarity', $edition->rarity_id)->name); }, $card->ownEdition);
		return array( 'id' => $card->id, 'name' => $card->name, 'types' => $types, 'cost' => $card->cost, 'pt' => $card->pt, 'rules' => $card->rules, );
	}, array_values($cards)); }


$app->get('/cards/search/:search(/)', function($search) use ($app) {
	$cards = R::find('card', ' name LIKE ? ', array("%".$search."%"));
	output_json(output_cards($cards));
});

$app->get('/cards/', function() use ($app) {
	//get all the cards (limited 15)
	output_json( output_cards( R::findAll('card', ' ORDER BY rand() LIMIT 15 ') ) );
});

$app->delete('/cards/:id(/)', function($id) use ($app) { }); 	//delete a card
