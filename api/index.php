<?php
session_start();

require_once '../lib/rb.php';

require_once '../lib/facebook/facebook.php';

$fbconfig = array(
	'appId' => '424893924242103',
	'secret' => 'c648259db9304f6cc5abb49bedafa070',
	'fileUpload' => 'false'
);

$facebook = new Facebook($fbconfig);


R::setup("mysql:host=localhost;dbname=ponder", 'ponderAdmin', 'jJ9x9LnM8pUJsvXh');



require '../lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim(); 

$paths = glob(__DIR__ . "/models/*.php");
foreach ($paths as $filename) {
	include $filename;
}

$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

$app->get('/heya', function () {
	echo "heya world.";
});

$app->get('/', function () {
	echo "Hello world.";
});

$app->run();

