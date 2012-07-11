<?php

/**
 * @author Martin Gallagher <martin@martinpaulgallagher.com>
 */
class StyleJS {

	/**
	 * @var V8js
	 */
	private $V8;

	/**
	 * Cache copy of Style.js
	 * @var string
	 */
	private $StyleJS = '';

	public function __construct($StyleFile = 'Style.js') {
		if (!empty($StyleFile) && class_exists('V8js')) {
			if (is_readable($StyleFile)) {
				$this->StyleJS = file_get_contents($StyleFile);

				if (!empty($this->StyleJS)) {
					$this->V8 = new V8js;
				}
			}
		}
	}

	/**
	 * Attempt to "compile" the given JavaScript string to CSS
	 * @param string $str
	 */
	public function toCSS($str) {
		if (!empty($str) && $this->V8 !== null) {
			try {
				return $this->V8->executeString($this->StyleJS . "\n" . $str . "\ntoCSS();");
			} catch (V8JsException $e) {
				return null;
			}
		}
	}

}