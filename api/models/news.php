<?php

function output_news($news) {
	return array('id' => $news->id, 'title' => $news->title, 'text' => $news->text, 'timestring' => $news->timestring,
		'comments' => array_map(function ($comment) { return array( 'author' => array( 'name' => R::load('author', $comment->author_id), 'id' => $comment->author_id), 'comment' => $comment->comment, 'timestring' => $comment->timestring); }, $news->ownComment));
}

function addComment($comm, $news) {
	$comment = R::dispense('newscomment');
	$comment->author = R::load('user', $comm->author->id);
	$comment->comment = $comm->comment;
	$comment->timestring = $comm->timestring;
	R::store($comment);
}

function processnews($id) {
	$data = json_decode($app->request()->getBody());
	$news = ($id)? R::load('news', $id) : R::dispense('news');
	R::trashAll(R::find('newscomment', ' news_id = ? ', array($news->id)));
	while (list($index, $comment) = each($data->comments)) { addComment($comment, $news); }

	// return R::store($news);
}

$app->put('/news/:id(/)', function($id) use ($app) { processnews($id); });

// $app->post('/news(/)', function() use ($app) {
// 	$data->id = processnews(null);
// 	echo output_json($data);
// }); 
	
$app->get('/news/:id(/)', function($id) use ($app) { output_json( output_news( R::load('news', $id) ) ); }); //get a news by id

$app->get('/news(/)', function() use ($app) { output_json(array_values(array_map(function($news) { return output_news($news); }, R::findAll('news')))); }); //log in a news
	// $news = R::dispense('news');
	// $news->title = "Introduction to Ponder";
	// $news->text = "Ponder is an online web service designed to make it easier to manage and make use of a large collection of Magic: the Gathering playing cards. It uses a database sourced from Wizard's Gatherer service, meaning that every standard card from the history of Magic is available to be indexed and sorted. Ponder provides comprehensive seaching capabilities that are tied directly into the set creation process, making it easy to get started with organising your collection. It's even possible to upload an existing file representing a collection, and Ponder will automatically index it for you and convert it into a pre-build set on the site.";
	// date_default_timezone_set('UTC');
	// $news->timestring = date(' h:i A, l jS \of F Y');
	// R::store($news);

$app->delete('/news/:id(/)', function($id) use ($app) {	});	//delete a news item

