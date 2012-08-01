<?php

require 'StyleJS.php';

$handler = new StyleJS(
	'../../../Type.js/src/Type.js',
	'../../../Util.js/src/Util.js',
	'../Style.js'
);

$handler->request('../example.css.js');