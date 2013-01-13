<?php
// We get PHP to load our dependancies
$styles = array('lib/bootstrap.min.css', 'css/base.css');
$libs = array('lib/jquery-1.8.3.min.js', 'lib/underscore.js', 'lib/backbone.js', 'lib/bootstrap.min.js', 'lib/backbone.marionette.js', 'lib/json2.js', 'http://connect.facebook.net/en_US/all.js');
$scripts = array_merge(array('js/Ponder.js'), glob("js/*.*.js"));

?><!DOCTYPE html>
<html> <head> 
	<link href='http://fonts.googleapis.com/css?family=Tinos|Droid+Serif:700' rel='stylesheet' type='text/css'>
	<meta charset="utf-8"> <title>Ponder</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php foreach ($styles as $style) { echo '
	<link rel="stylesheet" href="' . $style . '">'; }
		foreach (array_merge($libs, $scripts) as $script) { echo '
	<script type="text/javascript" src="' . $script . '"></script>'; } ?>
</head> <body>
	<div class="container">
	<div id="fb-root"></div>
	<div id="header" class="hero-unit"></div>
	<hr>
	<div id="navbar" class="nav"></div>
	<hr>
	<div id="main"></div>
	<hr>
	<footer id="footer"></footer>
</div>
	<div id="templates">
		<?php $paths = glob(__DIR__ . "/templates/*.html"); foreach ($paths as $filename) { include $filename; } ?>
	</div>
	<script> $(function(){ Ponder.start(); }); </script>
</body> </html>
