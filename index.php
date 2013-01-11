<?php
// We get PHP to load our dependancies
$styles = array();
$libs = array('lib/jquery-1.8.3.min.js', 'lib/underscore.js', 'lib/backbone.js', 'lib/backbone.marionette.min.js', 'lib/json2.js');
$scripts = array('js/Ponder.js', 'js/Ponder.Layout.js', 'js/Ponder.Master.js');

?><!DOCTYPE html>
<html>
<head>
	<title>Ponder</title>
	<?php
		foreach ($styles as $style) {
			echo '
	<link rel="stylesheet" href="' . $style . '">';
		}
		foreach (array_merge($libs, $scripts) as $script) {
			echo '
	<script type="text/javascript" src="' . $script . '"></script>';
		}
	?>
</head>
<body>
	<div id="fb-root"></div>
	<div id="header"></div>
	<div id="main"></div>
	<div id="footer"></div>
	<div id="templates">
		<?php $paths = glob(__DIR__ . "/templates/*.html"); foreach ($paths as $filename) { include $filename; } ?>
	</div>
	<script>
		$(function(){
			Ponder.start();
		});
	</script>
</body>
</html>
