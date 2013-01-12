<?php
session_start();

require_once '../lib/rb.php';

require_once '../lib/facebook/facebook.php';

require_once '../lib/json-prettifier.php';

function output_json($content) {
	header("Content-Type: application/json");
	echo json_format(json_encode($content));
	exit;
};

$fbconfig = array(
	'appId' => '249511971845829',
	'secret' => '8fd801aa915be415dd31a82a5a911f47',
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

