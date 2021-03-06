<?php

list($type_file, $rarity_file, $block_file, $set_file, $card_file) = array('resources/types.dat', 'resources/rarity.dat', 'resources/blocks.dat', 'resources/sets.dat', 'resources/cards.dat');

$app->get('/construct/types(/)', function() use ($app, $type_file) {
	R::wipe('type_type'); R::wipe('type');

	$name = $supertype = $subtype = '';
	$required = array();

	$types = file($type_file);
	echo "Types_file loaded</br>";
	reset($types);
	while (list($key, $val) = each($types)) {
		if ($val[0] == '#') { continue; }

		$typedata = array_map('trim', array_filter(explode(',', $val)));
		if ($typedata[1] != "") {
			$supertype = $typedata[1] === 'true';
			$subtype = $typedata[2] === 'true';
			$required = array();
			if ($typedata[3]) {
				foreach (array_slice($typedata, 3) as $key => $value) {
					$required[] = R::findOne('type', ' name = ? ', array($value));
		}	}	}

		$type = R::dispense('type');
		list($type->name, $type->supertype, $type->subtype) = array($typedata[0], $supertype, $subtype);

		foreach ($required as $key => $value) { $type->sharedType[] = $value; };

		R::store($type);
		echo "$type->name constucted with " . count($type->sharedType) . " requirements.<br>";
	}
	echo "Types constructed";
});

$app->get('/construct/rarities(/)', function() use ($app, $rarity_file) {
	R::wipe('rarity');

	$rarities = file($rarity_file);
	echo "Rarity_file loaded</br>";
	reset($rarities);
	while (list($key, $val) = each($rarities)) {
		if ($val[0] == '#') { continue; }

		$rarity = R::dispense('rarity');
		list($rarity->name, $rarity->letter) = array_map('trim', array_filter(explode(',', $val)));
		R::store($rarity);
	}
	echo "Rarities constructed";
});

// $app->get('/construct/blocks(/)', function() use ($app, $block_file) {
// 	R::wipe('block');

// 	$blocks = file($block_file);
// 	echo "block_file loaded</br>";
// 	reset($blocks);
// 	while (list($key, $val) = each($blocks)) {
// 		if ($val[0] == '#') {
// 			continue;
// 		}

// 		$block = R::dispense('block');
// 		list($block->name) = array_map('trim', array_filter(explode(',', $val)));
// 		R::store($block);
// 	}
// 	echo "Blocks constructed";
// });

// $app->get('/construct/sets(/)', function() use ($app, $set_file) {
// 	R::wipe('set');

// 	$sets = file($set_file);
// 	echo "set_file loaded</br>";
// 	reset($sets);
// 	while (list($key, $val) = each($sets)) {
// 		if ($val[0] == '#') {
// 			continue;
// 		}

// 		$set = R::dispense('set');
// 		list($set->name, $block, $set->symbol, $set->codename, $set->abbr, $set->release) = array_map('trim', array_filter(explode(',', $val)));
// 		$set->block = R::findOne('block', ' name = ? ', array($block));
// 		R::store($set);
// 	}
// 	echo "sets constructed";
// });

$app->get('/construct/cards(/)', function() use ($app, $card_file) {
	// R::wipe('card');

	$mode = 'name';
	$rules = array();
	$card = R::dispense('card');

	$cards = file($card_file);
	echo "card_file loaded</br>";
	reset($cards);
	while (list($key, $val) = each($cards)) {
		if ($val[0] === "\n") {
			if ($mode === 'rules') {	//we're processing a Vanguard with no rules
				echo "storing Vanguard " . $card->name . "<br>";
				R::store($card);
				$card = R::dispense('card');
			}
			$mode = 'name'; continue;
		}
		switch ($mode) {
			case 'name':
				$mode = 'cost';
				echo "processing " . $val . "<br>";
				set_time_limit(20); //give more time
				if (strpos($val, '//')) { $mode = 'invalid'; break; }	//for dealing with split cards
				$card->name = trim($val);
				break;

			case 'cost':
				$mode = 'types';
				if(preg_match('/^X*[0-9]*(?:\([wubrg2]\/[wubrgp]\))*[WUBRGS]*$/', $val)) { $card->cost = trim($val); break; } 
				//if it didn't match, this is actually a type, fall through

			case 'types':
				$mode = 'rules';
				list($bigtypes, $subtypes) = explode(' -- ', trim($val));
				foreach (explode(' ', $bigtypes) as $key => $value) {
					$card->sharedType[] = R::findOne('type', ' name = ? ', array($value));
					// echo "type: " . $value;
					if ($value === 'Creature' || $value === 'Vanguard') { $mode = 'pt'; } //only these types have a pt
				}
				if ($bigtypes === 'Plane') {
					$card->sharedType[] = R::findOne('type', ' name = ? ', array($subtypes));
				} else if ($subtypes) {
					foreach (explode(' ', $subtypes) as $key => $value) { $card->sharedType[] = R::findOne('type', ' name = ? ', array($value)); }
				} break;

			case 'pt':
				$mode = 'rules'; $card->pt = trim($val); break;

			case 'rules':
				if (preg_match('/^(?:[A-Z0-9]{1,5}-[LCURMS](?:, )?)+$/', $val)){
					// foreach (explode(', ', trim($val)) as $key => $value) {
					// 	$edition = R::dispense('edition');
					// 	list($set, $rarity) = explode('-', $value);
					// 	$edition->card = $card;
					// 	$edition->set = R::findOne('set', ' abbr = ? LIMIT 1 ', array('\"'.$set.'\"'));
					// 	$edition->rarity = R::findOne('rarity', ' letter = ? ', array($rarity));
					// 	R::store($edition);
					// 	// echo "made edition" . $value;
					// }
					$card->rules = implode("\n", $rules);
					// echo "storing " . $card->name;
					R::store($card);
					$mode = 'name';
					$rules = array();
					$card = R::dispense('card');
					break;
				}
				$rules[] = trim($val);
				break;

			case 'invalid': break; //for dealing with split cards

			default: echo "Something has gone horribly wrong\n"; break;
	}	}
	echo "cards constructed";
});