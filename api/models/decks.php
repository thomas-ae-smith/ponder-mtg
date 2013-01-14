<?php

function output_deck($deck) {
	return array('name' => $deck->name, 'owner' => $deck->owner,
		'cards' => output_cards(R::batch('card', array_map(function ($link) { if ($link->sideboard) return $link->card_id;}, $deck->ownDeckcard))),
		'sideboard' => output_cards(R::batch('card', array_map(function ($link) { if (!$link->sideboard) return $link->card_id;}, $deck->ownDeckcard))) );
}

function addCard($card, $deck, $copies=1, $sideboard='false') {
	$link = R::dispense('deckcard');
	$link->copies = $copies;
	$link->deck = $deck;
	$link->sideboard = $sideboard;
	$link->card = R::load('card', $card->id);
	R::store($link);
}

function processDeck($data, $id) {
	$deck = ($id)? R::load('deck', $id) : R::dispense('deck');
	$deck->name = $data->name;
	$deck->owner = $data->owner;
	R::trashAll(R::find('deckcard', ' deck_id = ? ', array($deck->id)));
	while (list($index, $card) = each($data->cards)) {
		addCard($card, $deck);
	}
	while (list($index, $card) = each($data->sideboard)) {
		addCard($card, $deck, 1, true);
	}

	return R::store($deck);
}

$app->put('/decks/:id(/)', function($id) use ($app) {
	$data = json_decode($app->request()->getBody());
	processDeck($data, $id);

	// echo output_json($data);
});

$app->post('/decks(/)', function() use ($app) {
	// output_json($app->request()->getBody());
	$data = json_decode($app->request()->getBody());
	$data->id = processDeck($data, null);

	echo output_json(array('id' => $data->id));
	// echo output_json($data);
}); 
	
$app->get('/decks/:id(/)', function($id) use ($app) {
	//get a deck by id
	output_json( output_deck( R::load('deck', $id) ) );
});

$app->get('/decks(/)', function() use ($app) {
	//log in a deck
	output_json(array_values(array_map(function($deck) { return output_deck($deck); }, R::findAll('deck'))));

});

$app->delete('/decks/:id(/)', function($id) use ($app) {
	//logout a deck
});

