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
	private $TypeJS = '';

	/**
	 * Cache copy of Style.js
	 * @var string
	 */
	private $UtilJS = '';

	/**
	 * Cache copy of Style.js
	 * @var string
	 */
	private $StyleJS = '';

	public function __construct($TypeJS = 'Type.js', $UtilJS = 'Util.js', $StyleFile = 'Style.js') {
		if (!empty($StyleFile) && class_exists('V8js')) {
			if (is_readable($StyleFile) && is_readable($TypeJS) && is_readable($UtilJS)) {
				$this->TypeJS = file_get_contents($TypeJS);
				$this->UtilJS = file_get_contents($UtilJS);
				$this->StyleJS = file_get_contents($StyleFile);

				if (!empty($this->TypeJS) && !empty($this->UtilJS) && !empty($this->StyleJS)) {
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
				return $this->V8->executeString($this->TypeJS . "\n" . $this->UtilJS . "\n" . $this->StyleJS . "\n" . $str . "\ntoCSS();");
			} catch (V8JsException $e) {
				return null;
			}
		}
	}

	/**
	 * Example HTTP request method
	 * @param string $file
	 * @param string $outputFile
	 * @param boolean $cache
	 */
	public function request($file, $outputFile = null, $cache = true) {
		$CSS = '';

		// Style file and V8 instance required
		if (!empty($file) && $this->V8 !== null) {
			// If no output file provided, use a MD5 checksum of the input file
			if ($outputFile === null) {
				$outputFile = md5($file) . '.css';
			}

			// If the file is readable (exists) and the file timestamp matches If-Modified-Since header, sent HTTP code 304 (file hasn't changed)
			if (is_readable($outputFile) && strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) === filemtime($outputFile)) {
				header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($fn)) . ' GMT', true, 304);

				return;
			} elseif (is_readable($file)) {
				// Attempt to transform to CSS
				$CSS = $this->toCSS(file_get_contents($file));

				// Test writability of output file, finally checking if writing to file is successful
				if ($CSS !== null && $cache && is_writable($outputFile) && file_put_contents($outputFile, $CSS) !== false) {
					// Set Last-Modified header with the output file time
					header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($outputFile)) . ' GMT', true, 200);
					header('Content-Length: ' . filesize($outputFile));
				}

				header('Content-Type: text/css');
			}
		}

		// Print CSS output
		echo $CSS;
	}

}