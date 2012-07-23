/**
 * Copyright 2012 Martin Gallagher
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
(function ($, undefined) {
	'use strict';

	/**
	 * Style.js major version
	 * @private
	 * @constant
	 * @type {Number}
	 */
	var VERSION_MAJOR = 0;

	/**
	 * Style.js minor version
	 * @private
	 * @constant
	 * @type {Number}
	 */
	var VERSION_MINOR = 0;

	/**
	 * Style.js patch version
	 * @private
	 * @constant
	 * @type {Number}
	 */
	var VERSION_PATCH = 1;

	/**
	 * Array of Style objects
	 * @type {Array.<Style>}
	 */
	var Styles = [];

	/**
	 * Default EM dimension in pixels
	 * @type {Number}
	 */
	var emSize = 16;

	/**
	 * Flag determines whether to output branding when creating CSS
	 * @private
	 * @type {Boolean}
	 */
	var branding = true;

	/**
	 * Push string value to Styles array
	 */
	String.prototype.toStyle = function () {
		Styles.push(this);
	};

	/**
	 * Add values from an object to the current object
	 * @param {Object} obj
	 * @returns {Object}
	 */
	Object.prototype.extend = function () {
		var len = arguments.length;

		if (len > 0) {
			for (var i = 0; i < len; ++i) {
				if (Type.isObject(arguments[i])) {
					var property;

					for (property in arguments[i]) {
						this[property] = arguments[i][property];
					}
				}
			}
		}

		return this;
	};

	/**
	 * Set object value to null
	 * @returns {null}
	 */
	Object.prototype.disable = function () {
		return null;
	};

	/**
	 * Attempt to transform object value to Style
	 * @param {Boolean} multidimensional If true process the child objects
	 * @returns {Style}
	 */
	Object.prototype.toStyle = function () {
		return new Style(this);
	};

	/**
	 * Generic Color class for shared color functionality
	 * @class
	 */
	function Color() {}

	$.Color = Color;

	/**
	 * @static
	 * @constant
	 */
	Color.NAMED = 'Named';

	/**
	 * @static
	 * @constant
	 */
	Color.HEX = 'Hex';

	/**
	 * @static
	 * @constant
	 */
	Color.RGB = 'RGB';

	/**
	 * @static
	 * @constant
	 */
	Color.RGBA = 'RGBA';

	/**
	 * @static
	 * @constant
	 */
	Color.HSL = 'HSL';

	/**
	 * @static
	 * @constant
	 */
	Color.HSLA = 'HSLA';

	/**
	 * @static
	 * @constant
	 */
	Color.HSV = 'HSV';

	/**
	 * @static
	 * @constant
	 */
	Color.XYZ = 'XYZ';

	/**
	 * @static
	 * @constant
	 */
	Color.CIELAB = 'CIELab';

	/**
	 * @static
	 * @constant
	 * @type {Object}
	 */
	Color.regex = {
		/**
		 * @static
		 * @constant
		 * @type {Object}
		 */
		hex: /^\s*#[a-f0-9]{3,6}\s*$/i,

		/**
		 * @static
		 * @constant
		 * @type {Object}
		 */
		RGB: /^\s*rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i,

		/**
		 * @static
		 * @constant
		 * @type {Object}
		 */
		RGBA: /^\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*(\.\d+|\d+(\.\d+)?)\s*\)\s*$/i,

		/**
		 * @static
		 * @constant
		 * @type {Object}
		 */
		HSL: /^\s*hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/i,

		/**
		 * @static
		 * @constant
		 * @type {Object}
		 */
		HSLA: /^\s*hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\,\s*(\.\d+|\d+(\.\d+)?)\s*\)\s*$/i,

		/**
		 * @static
		 * @constant
		 * @type {Object}
		 */
		all: /\s*(#[a-f0-9]{3,6}|rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)|rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*(\.\d+|\d+(\.\d+)?)\s*\)|hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)|hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\,\s*(\.\d+|\d+(\.\d+)?)\s*\))\s*/gi
	};

	/**
	 * @static
	 * @constant
	 * @type {Object.<String, String>}
	 */
	Color.webSafe = {
		'ffffff': 'white',
		'c0c0c0': 'silver',
		'808080': 'gray',
		'000000': 'black',
		'ff0000': 'red',
		'800000': 'maroon',
		'ffff00': 'yellow',
		'808000': 'olive',
		'00ff00': 'lime',
		'008000': 'green',
		'00ffff': 'aqua',
		'008080': 'teal',
		'0000ff': 'blue',
		'000080': 'navy',
		'ff00ff': 'fuchsia',
		'800080': 'purple'
	};

	/**
	 * @static
	 * @constant
	 * @type {Object.<String, String|Array>}
	 */
	Color.list = {
		'f0f8ff': 'aliceblue',
		'faebd7': 'antiquewhite',
		'7fffd4': 'aquamarine',
		'f0ffff': 'azure',
		'f5f5dc': 'beige',
		'ffe4c4': 'bisque',
		'ffebcd': 'blanchedalmond',
		'8a2be2': 'blueviolet',
		'a52a2a': 'brown',
		'deb887': 'burlywood',
		'5f9ea0': 'cadetblue',
		'7fff00': 'chartreuse',
		'd2691e': 'chocolate',
		'ff7f50': 'coral',
		'6495ed': 'cornflowerblue',
		'fff8dc': 'cornsilk',
		'dc143c': 'crimson',
		'00008b': 'darkblue',
		'008b8b': 'darkcyan',
		'b8860b': 'darkgoldenrod',
		'a9a9a9': ['darkgray', 'darkgrey'],
		'006400': 'darkgreen',
		'bdb76b': 'darkkhaki',
		'8b008b': 'darkmagenta',
		'556b2f': 'darkolivegreen',
		'ff8c00': 'darkorange',
		'9932cc': 'darkorchid',
		'8b0000': 'darkred',
		'e9967a': 'darksalmon',
		'8fbc8f': 'darkseagreen',
		'483d8b': 'darkslateblue',
		'2f4f4f': ['darkslategray', 'darkslategrey'],
		'00ced1': 'darkturquoise',
		'9400d3': 'darkviolet',
		'ff1493': 'deeppink',
		'00bfff': 'deepskyblue',
		'696969': ['dimgray', 'dimgrey'],
		'1e90ff': 'dodgerblue',
		'b22222': 'firebrick',
		'fffaf0': 'floralwhite',
		'228b22': 'forestgreen',
		'dcdcdc': 'gainsboro',
		'f8f8ff': 'ghostwhite',
		'ffd700': 'gold',
		'daa520': 'goldenrod',
		'adff2f': 'greenyellow',
		'f0fff0': 'honeydew',
		'ff69b4': 'hotpink',
		'cd5c5c': 'indianred ',
		'4b0082': 'indigo ',
		'fffff0': 'ivory',
		'f0e68c': 'khaki',
		'e6e6fa': 'lavender',
		'fff0f5': 'lavenderblush',
		'7cfc00': 'lawngreen',
		'fffacd': 'lemonchiffon',
		'add8e6': 'lightblue',
		'f08080': 'lightcoral',
		'e0ffff': 'lightcyan',
		'fafad2': 'lightgoldenrodyellow',
		'd3d3d3': ['lightgray', 'lightgrey'],
		'90ee90': 'lightgreen',
		'ffb6c1': 'lightpink',
		'ffa07a': 'lightsalmon',
		'20b2aa': 'lightseagreen',
		'87cefa': 'lightskyblue',
		'778899': ['lightslategray', 'lightslategrey'],
		'b0c4de': 'lightsteelblue',
		'ffffe0': 'lightyellow',
		'32cd32': 'limegreen',
		'faf0e6': 'linen',
		'66cdaa': 'mediumaquamarine',
		'0000cd': 'mediumblue',
		'ba55d3': 'mediumorchid',
		'9370d8': 'mediumpurple',
		'3cb371': 'mediumseagreen',
		'7b68ee': 'mediumslateblue',
		'00fa9a': 'mediumspringgreen',
		'48d1cc': 'mediumturquoise',
		'c71585': 'mediumvioletred',
		'191970': 'midnightblue',
		'f5fffa': 'mintcream',
		'ffe4e1': 'mistyrose',
		'ffe4b5': 'moccasin',
		'ffdead': 'navajowhite',
		'fdf5e6': 'oldlace',
		'6b8e23': 'olivedrab',
		'ffa500': 'orange',
		'ff4500': 'orangered',
		'da70d6': 'orchid',
		'eee8aa': 'palegoldenrod',
		'98fb98': 'palegreen',
		'afeeee': 'paleturquoise',
		'd87093': 'palevioletred',
		'ffefd5': 'papayawhip',
		'ffdab9': 'peachpuff',
		'cd853f': 'peru',
		'ffc0cb': 'pink',
		'dda0dd': 'plum',
		'b0e0e6': 'powderblue',
		'bc8f8f': 'rosybrown',
		'4169e1': 'royalblue',
		'8b4513': 'saddlebrown',
		'fa8072': 'salmon',
		'f4a460': 'sandybrown',
		'2e8b57': 'seagreen',
		'fff5ee': 'seashell',
		'a0522d': 'sienna',
		'87ceeb': 'skyblue',
		'6a5acd': 'slateblue',
		'708090': ['slategray', 'slategrey'],
		'fffafa': 'snow',
		'00ff7f': 'springgreen',
		'4682b4': 'steelblue',
		'd2b48c': 'tan',
		'd8bfd8': 'thistle',
		'ff6347': 'tomato',
		'40e0d0': 'turquoise',
		'ee82ee': 'violet',
		'f5deb3': 'wheat',
		'f5f5f5': 'whitesmoke',
		'9acd32': 'yellowgreen'
	}.extend(Color.webSafe);

	/**
	 * Get a list of colors with the HTML name as the key and hex as value
	 * @static
	 * @param {Boolean} websafe If true only use web safe colors
	 * @returns {Object.<String, String>}
	 */
	Color.getNamedList = function (websafe) {
		var list = !websafe ? this.list : this.webSafe;
		var out = {};
		var i = 0;
		var len;

		for (var hex in list) {
			if (Type.isString(list[hex])) {
				out[list[hex]] = hex;
			} else if (Type.isArray(list[hex])) {
				len = list[hex].length;

				for (i = 0; i < len; ++i) {
					out[list[hex][i]] = hex;
				}
			}
		}

		return out;
	};

	/**
	 * List of hex colors and their name equivalent
	 * @static
	 * @constant
	 * @type {Object.<String, String>}
	 */
	Color.listNamed = Color.getNamedList();

	/**
	 * List of web safe hex colors and their name equivalent
	 * @static
	 * @constant
	 * @type {Object.<String, String>}
	 */
	Color.webSafeNamed = Color.getNamedList(true);

	/**
	 * Attempts to get the color's type
	 * @static
	 * @param {Object|String} color
	 * @returns {String}
	 */
	Color.getType = function (color) {
		if (color) {
			if (Type.isString(color)) {
				if (!Util.empty(Color.listNamed[color.toLowerCase()])) {
					return this.NAMED;
				} else if (this.regex.hex.test(color)) {
					return this.HEX;
				} else if (this.regex.RGB.test(color)) {
					return this.RGB;
				} else if (this.regex.RGBA.test(color)) {
					return this.RGBA;
				} else if (this.regex.HSL.test(color)) {
					return this.HSL;
				} else if (this.regex.HSLA.test(color)) {
					return this.HSLA;
				}
			} else {
				var type = Type.getType(color);

				if (type && this[type.toUpperCase()]) {
					return type;
				}
			}
		}
	};

	/**
	 * Attempts to convert the color to a given type
	 * @static
	 * @param {Object|String} color
	 * @param {String} type The color type to return
	 * @returns {Object|String}
	 */
	Color.toType = function (color, type) {
		if (color && type) {
			switch (type) {
				case Color.NAMED:
					color = color.toLowerCase().substr(1);

					return !Util.empty(Color.list[color]) ? Color.list[color] : undefined;

				case Color.HEX:
				case Color.RGB:
				case Color.RGBA:
				case Color.HSL:
				case Color.HSLA:
				case Color.HSV:
				case Color.XYZ:
				case Color.CIELAB:
					return toColorSpace(color, type);
			}
		}
	};

	/**
	 * Checks if value passed is valid color
	 * @static
	 * @param {Object|String} color
	 * @returns {Boolean}
	 */
	Color.isValid = function (color) {
		return color && Color.getType(color) ? true : false;
	};

	/**
	 * Checks if value passed is valid CSS color
	 * @static
	 * @param {Object|String} color
	 * @returns {Boolean}
	 */
	Color.isValidCSS = function (color) {
		if (color) {
			color = Color.getType(color);

			if (color) {
				return CSS.colorTypes.contains(color);
			}
		}

		return false;
	};

	/**
	 * Global toCSS function to "compile" global Styles to CSS
	 * @returns {String}
	 */
	function toCSS() {
		var len = Styles.length;

		if (len > 0) {
			var CSS = branding ? '/**\n * Created by Style.js ' + Style.getVersion() + ', ' + new Date() + '\n */\n' : '';

			for (var i = 0; i < len; ++i) {
				CSS += Styles[i] + '\n\n';
			}

			return CSS.slice(0, -2);
		}

		return '';
	}

	$.toCSS = toCSS;

	/**
	 * Style class / wrapper, populates Styles array
	 * @constructor
	 * @param {Object|String} obj Style object / string
	 * @returns {Style}
	 */
	function Style(obj) {
		if (this === undefined) {
			return new Style(obj);
		}

		if (!Util.empty(obj)) {
			this.self = obj;

			Styles.push(this);
		}
	}

	$.Style = Style;

	/**
	 * Returns version of library
	 * @static
	 * @returns {String}
	 */
	Style.getVersion = function () {
		return VERSION_MAJOR + '.' + VERSION_MINOR + '.' + VERSION_PATCH;
	};

	/**
	 * Disable Style.js branding
	 * @static
	 */
	Style.disbaleBranding = function () {
		branding = false;
	};

	/**
	 * Enable Style.js branding
	 * @static
	 */
	Style.enableBranding = function () {
		branding = false;
	};

	/**
	 * Compile to a object with a single dimension of CSS properties
	 * @param {Object} obj Object to reduce to CSS properties
	 * @param {Object} output The current working output
	 * @param {String} parent Parent selector
	 * @param {String} child Child selector
	 * @returns {Object}
	 */
	Style.prototype.compile = function (obj, output, parent, child) {
		if (Type.isString(this.self)) {
			return this.self;
		}

		if (obj === undefined) {
			obj = this.self;
		}

		// Initiate output object if undefined
		if (output === undefined) {
			output = {};
		}

		// Top level definition
		if (parent === undefined) {
			for (var i in obj) {
				if (!Type.isFunction(obj[i])) {
					this.compileObject(obj[i], output, i);
				}
			}
		}

		// Child definition
		else {
			this.compileObject(obj, output, parent, child);
		}

		return output;
	};

	/**
	 * Compile to a object with a single dimension of CSS properties
	 * @param {Object} obj Object to reduce to CSS properties
	 * @param {Object} output The current working output
	 * @param {String} parent Parent selector
	 * @param {String} child Child selector
	 */
	Style.prototype.compileObject = function (obj, output, parent, child) {
		var compile = false;

		if (child !== undefined) {
			if (Type.isString(child)) {
				var len = child.length - 1;
				var firstChar = child.charAt(0);
				var lastChar = child.charAt(len);

				if (!(firstChar === '$' && lastChar === '$')) {
					if (lastChar !== '$') {
						// Add pseudo class
						child = firstChar === '$' ? ':' + child.substr(1) : ' ' + child;
						// Add hierarchy to CSS selectors
						parent = parent.replace(/\s*,\s*/g, child + ', ') + child.replace(/\s*,\s*/g, ', ' + parent + ' ');
					} else {
						child = child.substr(0, len);
						// Add hierarchy to CSS selectors
						parent = child + ' ' + parent.replace(/\s*,\s*/g, ', ' + child);
					}

					compile = true;
				}
			}
		} else {
			compile = true;
		}

		if (compile) {
			var type;

			for (var x in obj) {
				if ((type = typeof obj[x]) !== 'function') {
					if (!output[parent]) {
						output[parent] = [];
					}

					if (type === 'string' || type === 'number') {
						output[parent].push(x.replace(/\_/g, '-') + ": " + obj[x]);
					} else if (Type.isArray(obj[x])) {
						for (var y in obj[x]) {
							if (!Type.isFunction(obj[x][y])) {
								output[parent].push(x.replace(/\_/g, '-') + ": " + obj[x][y]);
							}
						}
					} else if (isProperty(obj[x])) {
						output[parent] = output[parent].concat(obj[x].compile(x.replace(/\_/g, '-')));
					} else if (Type.isObject(obj[x])) {
						this.compile(obj[x], output, parent, x);
					}
				}
			}
		}
	};

	/**
	 * Convert to CSS when cast to string
	 * @returns {String}
	 */
	Style.prototype.toString = function () {
		var CSS = '';

		// Compile
		var obj = this.compile();

		if (Type.isObject(obj)) {
			for (var definition in obj) {
				if (!Type.isFunction(obj[definition])) {
					// Must contain properties
					if (obj[definition].length > 0) {
						// Convert simple object to string
						CSS += "\n\n" + definition + " {\n\t" + obj[definition].join(";\n\t") + "\n}";
					}
				}
			}

			return CSS.length > 0 ? CSS.substr(2) : '';
		} else if (Type.isString(obj)) {
			return obj;
		}
	};

	/**
	 * Property class / wrapper
	 * @constructor
	 * @param {Object|String} obj Property object
	 * @returns {Property}
	 */
	function Property(obj) {
		if (this === undefined) {
			return new Property(obj);
		}

		if (!Util.empty(obj)) {
			this.self = obj;
		}
	}

	$.Property = Property;

	/**
	 * Returns the property as a CSS value
	 * @param {String} name Name of property
	 * @returns {Array.<String>}
	 */
	Property.prototype.compile = function (name) {
		var type;
		var out = [];

		if (!Util.empty(name) && Type.isObject(this.self)) {
			for (var x in this.self) {
				if (Type.isString(this.self[x])) {
					out.push(name + '-' + x + ': ' + this.self[x]);
				} else if (Type.isArray(this.self[x])) {
					for (var y in this.self[x]) {
						if ((type = typeof this.self[x][y]) === 'string' || type === 'number') {
							// Push CSS property
							out.push(name + '-' + x + ': ' + this.self[x][y]);
						}
					}
				}
			}
		}

		return out;
	};

	/**
	 * Checks if value is Poperty type
	 * @private
	 * @param {mixed} value
	 * @returns {Boolean}
	 */
	function isProperty(value) {
		return value instanceof Property;
	}

	/**
	 * RGB color class
	 * @constructor
	 * @param {Number} red
	 * @param {Number} green
	 * @param {Number} blue
	 */
	function RGB(red, green, blue) {
		if (red !== undefined && ((green === undefined && blue === undefined) || (Type.isNumber(green) && Type.isNumber(blue) && green.between(0, 255) && blue.between(0, 255)))) {
			if (green === undefined) {
				if (Type.isObject(red) && red instanceof this.constructor) {
					this.red = red.red;
					this.green = red.green;
					this.blue = red.blue;
				} else if (Type.isString(red)) {
					var parts = Color.regex.RGB.exec(red);

					if (parts) {
						parts[1] = Math.round(parts[1]);
						parts[2] = Math.round(parts[2]);
						parts[3] = Math.round(parts[3]);

						if (parts[1].between(0, 255) && parts[2].between(0, 255) && parts[3].between(0, 255)) {
							this.red = parts[1];
							this.green = parts[2];
							this.blue = parts[3];
						}
					} else {
						return toRGB(red);
					}
				} else {
					return toRGB(red);
				}
			} else if (Type.isNumber(red) && red.between(0, 255)) {
				this.red = red;
				this.green = green;
				this.blue = blue;
			}
		}
	}

	$.RGB = RGB;

	RGB.prototype.red = undefined;
	RGB.prototype.green = undefined;
	RGB.prototype.blue = undefined;

	/**
	 * Check whether the RGB object values are set
	 * @returns {Boolean}
	 */
	RGB.prototype.isSet = function () {
		return Type.isNumber(this.red) && Type.isNumber(this.green) && Type.isNumber(this.blue);
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	RGB.prototype.toRGBA = function () {
		if (this.isSet()) {
			return new RGBA(this.red, this.green, this.blue, 1);
		}
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	RGB.prototype.toHex = function () {
		if (this.isSet()) {
			return new Hex('#' + (1 << 24 | this.red << 16 | this.green << 8 | this.blue).toString(16).substr(1));
		}
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	RGB.prototype.toHSL = function () {
		if (this.isSet()) {
			var red = this.red / 255;
			var green = this.green / 255;
			var blue = this.blue / 255;
			var max = Math.max(red, green, blue), min = Math.min(red, green, blue);
			var hue = 0, saturation, lightness = (max + min) / 2;

			if (max === min) {
				hue = saturation = 0;
			} else {
				var d = max - min;

				saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);

				switch (max) {
					case red:
						hue = (green - blue) / d + (green < blue ? 6 : 0);

						break;

					case green:
						hue = (blue - red) / d + 2;

						break;

					case blue:
						hue = (red - green) / d + 4;
				}

				hue /= 6;
			}

			return new HSL(hue * 360, saturation * 100, lightness * 100);
		}
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	RGB.prototype.toHSLA = function () {
		if (this.isSet()) {
			return this.toHSL().toHSLA();
		}
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	RGB.prototype.toHSV = function () {
		if (this.isSet()) {
			var hue = null, saturation = null;
			var max = Math.max(this.red, this.green, this.blue);
			var diff = max - Math.min(this.red, this.green, this.blue);

			saturation = (max === 0) ? 0 : (100 * diff / max);

			if (saturation === 0) {
				hue = 0;
			} else if (this.red === max) {
				hue = 60 * (this.green - this.blue) / diff;
			} else if (this.green === max) {
				hue = 120 + 60 * (this.blue - this.red) / diff;
			} else if (this.blue === max) {
				hue = 240 + 60 * (this.red - this.green) / diff;
			}

			if (hue < 0) {
				hue += 360;
			}

			return new HSV(Math.round(hue), Math.round(saturation), Math.round(max * 100 / 255));
		}
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	RGB.prototype.toXYZ = function () {
		if (this.isSet()) {
			var X = this.red / 255;
			var Y = this.green / 255;
			var Z = this.blue / 255;

			X = (X > 0.04045 ? Math.pow((X + 0.055) / 1.055, 2.4) : X / 12.92) * 100;
			Y = (Y > 0.04045 ? Math.pow((Y + 0.055) / 1.055, 2.4) : Y / 12.92) * 100;
			Z = (Z > 0.04045 ? Math.pow((Z + 0.055) / 1.055, 2.4) : Z / 12.92) * 100;

			return new XYZ((X * 0.4124) + (Y * 0.3576) + (Z * 0.1805), (X * 0.2126) + (Y * 0.7152) + (Z * 0.0722), (X * 0.0193) + (Y * 0.1192) + (Z * 0.9505));
		}
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	RGB.prototype.toCIELab = function () {
		if (this.isSet()) {
			return this.toXYZ().toCIELab();
		}
	};

	/**
	 * Convert to string
	 * @returns {String}
	 */
	RGB.prototype.toString = function () {
		if (this.isSet()) {
			return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';
		}
	};

	/**
	 * Get a random RGB color
	 * @static
	 * @returns {RGB}
	 */
	RGB.random = function () {
		return new RGB(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
	};

	/**
	 * RGBA color class
	 * @constructor
	 * @param {Number} red
	 * @param {Number} green
	 * @param {Number} blue
	 * @param {Number} alpha
	 */
	function RGBA(red, green, blue, alpha) {
		if (red !== undefined && ((green === undefined && blue === undefined) || (Type.isNumber(green) && Type.isNumber(blue) && green.between(0, 255) && blue.between(0, 255)))) {
			if (green === undefined) {
				if (Type.isObject(red) && red instanceof this.constructor) {
					this.red = red.red;
					this.green = red.green;
					this.blue = red.blue;
					this.alpha = red.alpha;
				} else if (Type.isString(red)) {
					var parts = Color.regex.RGBA.exec(red);

					if (parts) {
						parts[1] = Math.round(parts[1]);
						parts[2] = Math.round(parts[2]);
						parts[3] = Math.round(parts[3]);
						parts[4] = parseFloat(parts[4]);

						if (parts[1].between(0, 255) && parts[2].between(0, 255) && parts[3].between(0, 255) && parts[4].between(0, 1)) {
							this.red = parts[1];
							this.green = parts[2];
							this.blue = parts[3];
							this.alpha = parts[4];
						}
					} else {
						return toRGBA(red);
					}
				} else {
					return toRGBA(red);
				}
			} else if (Type.isNumber(red) && red.between(0, 255)) {
				this.red = red;
				this.green = green;
				this.blue = blue;
				this.alpha = Type.isNumber(alpha) && alpha.between(0, 1) ? alpha : 1;
			}
		}
	}

	$.RGBA = RGBA;

	RGBA.prototype.red = undefined;
	RGBA.prototype.green = undefined;
	RGBA.prototype.blue = undefined;
	RGBA.prototype.alpha = undefined;

	/**
	 * Check whether the RGBA object values are set
	 * @returns {Boolean}
	 */
	RGBA.prototype.isSet = function () {
		return Type.isNumber(this.red) && Type.isNumber(this.green) && Type.isNumber(this.blue) && Type.isNumber(this.alpha);
	};

	/**
	 * Convert to RGB color
	 * @param {Object} background
	 * @returns {RGB}
	 */
	RGBA.prototype.toRGB = function (background) {
		if (this.isSet()) {
			if (this.alpha === 1) {
				return new RGB(this.red, this.green, this.blue);
			} else {
				// Must have a background color, assume white if none provided
				if (!background) {
					background = new RGB(255, 255, 255);
				} else {
					background = toRGB(background);

					if (!background) {
						background = new RGB(255, 255, 255);
					}
				}

				var alpha = 1 - this.alpha;
				var red = Math.round((this.alpha * (this.red / 255) + (alpha * (background.red / 255))) * 255);
				var green = Math.round((this.alpha * (this.green / 255) + (alpha * (background.green / 255))) * 255);
				var blue = Math.round((this.alpha * (this.blue / 255) + (alpha * (background.blue / 255))) * 255);

				return new RGB(red, green, blue);
			}
		}
	};

	/**
	 * Convert to Hex color
	 * @param {Object} background
	 * @returns {Hex}
	 */
	RGBA.prototype.toHex = function (background) {
		if (this.isSet()) {
			return this.toRGB(background).toHex();
		}
	};

	/**
	 * Convert to HSL color
	 * @param {Object} background
	 * @returns {HSL}
	 */
	RGBA.prototype.toHSL = function (background) {
		if (this.isSet()) {
			return this.toRGB(background).toHSL();
		}
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	RGBA.prototype.toHSLA = function () {
		if (this.isSet()) {
			var out = new RGB(this.red, this.green, this.blue).toHSLA();

			if (this.alpha !== 1) {
				out.alpha = this.alpha;
			}

			return out;
		}
	};

	/**
	 * Convert to HSV color
	 * @param {Object} background
	 * @returns {HSV}
	 */
	RGBA.prototype.toHSV = function (background) {
		if (this.isSet()) {
			return this.toRGB(background).toHSV();
		}
	};

	/**
	 * Convert to XYZ color
	 * @param {Object} background
	 * @returns {XYZ}
	 */
	RGBA.prototype.toXYZ = function (background) {
		if (this.isSet()) {
			return this.toRGB(background).toXYZ();
		}
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	RGBA.prototype.toCIELab = function (background) {
		if (this.isSet()) {
			return this.toRGB(background).toCIELab();
		}
	};

	/**
	 * Convert to string
	 * @returns {String}
	 */
	RGBA.prototype.toString = function () {
		if (this.isSet()) {
			return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
		}
	};

	/**
	 * Get a random RGBA color
	 * @static
	 * @param {Boolean} randomAlpha
	 * @returns {RGBA}
	 */
	RGBA.random = function (randomAlpha) {
		randomAlpha = randomAlpha ? Math.random().round(3) : 1;

		return new RGBA(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), randomAlpha);
	};

	/**
	 * Hex color class
	 * @constructor
	 */
	function Hex(value) {
		if (Type.isString(value)) {
			this.setValue(value);
		} else if (Type.getType(value) === 'Hex') {
			this.setValue(value.value);
		} else {
			return toHex(value);
		}
	}

	$.Hex = Hex;

	Hex.prototype.value = undefined;

	/**
	 * Check whether a valid value is set
	 * @returns {Boolean}
	 */
	Hex.prototype.isSet = function () {
		return !Util.empty(this.value) && Hex.isValid(this.value);
	};

	/**
	 * Set the Hex value
	 * @param {String} hex
	 */
	Hex.prototype.setValue = function (hex) {
		if (hex) {
			hex = hex.toLowerCase();

			if (Color.listNamed[hex]) {
				this.value = Color.listNamed[hex];
			} else if (Hex.isValid(hex)) {
				if (hex.charAt(0) === '#') {
					hex = hex.substring(1);
				}

				this.value = Hex.isTriplet(hex) ? Hex.expand(hex) : hex;
			}
		}
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	Hex.prototype.toRGB = function () {
		if (this.value) {
			return new RGB(parseInt(this.value.substring(0, 2), 16), parseInt(this.value.substring(2, 4), 16), parseInt(this.value.substring(4, 6), 16));
		}
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	Hex.prototype.toRGBA = function () {
		if (this.value) {
			return new RGBA(parseInt(this.value.substring(0, 2), 16), parseInt(this.value.substring(2, 4), 16), parseInt(this.value.substring(4, 6), 16), 1);
		}
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	Hex.prototype.toHSL = function () {
		if (this.value) {
			return this.toRGB().toHSL();
		}
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	Hex.prototype.toHSLA = function () {
		if (this.value) {
			return this.toRGB().toHSLA();
		}
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	Hex.prototype.toHSV = function () {
		if (this.value) {
			return this.toRGB().toHSV();
		}
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	Hex.prototype.toXYZ = function () {
		if (this.value) {
			return this.toRGB().toXYZ();
		}
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	Hex.prototype.toCIELab = function () {
		if (this.value) {
			return this.toRGB().toCIELab();
		}
	};

	/**
	 * Convert to CSS string
	 * @returns {String}
	 */
	Hex.prototype.toString = function () {
		if (!Util.empty(this.value)) {
			return '#' + this.value;
		}
	};

	/**
	 * Validate Hex color value
	 * @static
	 * @param {String} hex
	 * @returns {Boolean}
	 */
	Hex.isValid = function (hex) {
		if (hex) {
			if (hex.charAt(0) === '#') {
				hex = hex.substring(1);
			}

			return hex.isHex() && (hex.length === 3 || hex.length === 6);
		}

		return false;
	};

	/**
	 * Check if Hex value is triplet
	 * @static
	 * @param {String} hex
	 * @returns {Boolean}
	 */
	Hex.isTriplet = function (hex) {
		return hex && hex.length === 3;
	};

	/**
	 * Expand triplet value to 6 character value
	 * @static
	 * @param {String} hex
	 * @returns {String}
	 */
	Hex.expand = function (hex) {
		if (Hex.isTriplet(hex)) {
			var c = hex.split('');

			return c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
		}

		return hex;
	};

	/**
	 * Get a random Hex color
	 * @static
	 * @returns {Hex}
	 */
	Hex.random = function () {
		return RGB.random().toHex();
	};

	/**
	 * HSL color class
	 * @constructor
	 */
	function HSL(hue, saturation, lightness) {
		if (Type.isNumber(hue) && Type.isNumber(saturation) && Type.isNumber(lightness)) {
			this.hue = hue;
			this.saturation = saturation;
			this.lightness = lightness;
		} else if (Type.isObject(hue)) {
			if (hue instanceof this.constructor) {
				this.hue = hue.hue;
				this.saturation = hue.saturation;
				this.lightness = hue.lightness;
			} else {
				return toHSL(hue);
			}
		} else {
			return toHSL(hue);
		}
	}

	$.HSL = HSL;

	HSL.prototype.hue = undefined;
	HSL.prototype.saturation = undefined;
	HSL.prototype.lightness = undefined;

	/**
	 * Check whether the HSL object values are set
	 * @returns {Boolean}
	 */
	HSL.prototype.isSet = function () {
		return Type.isNumber(this.hue) && Type.isNumber(this.saturation) && Type.isNumber(this.lightness);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	HSL.prototype.toRGB = function () {
		if (this.isSet()) {
			var red, green, blue;
			var hue = this.hue / 360;
			var saturation = this.saturation / 100;
			var lightness = this.lightness / 100;

			if (saturation === 0) {
				// Achromatic
				red = green = blue = lightness;
			} else {
				var q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
				var p = 2 * lightness - q;

				red = Hue.toRGB(p, q, hue + 1 / 3);
				green = Hue.toRGB(p, q, hue);
				blue = Hue.toRGB(p, q, hue - 1 / 3);
			}

			return new RGB(Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255));
		}
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	HSL.prototype.toRGBA = function () {
		if (this.isSet()) {
			return this.toRGB().toRGBA();
		}
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	HSL.prototype.toHex = function () {
		if (this.isSet()) {
			return this.toRGB().toHex();
		}
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	HSL.prototype.toHSLA = function () {
		if (this.isSet()) {
			return new HSLA(this.hue, this.saturation, this.lightness, 1);
		}
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	HSL.prototype.toHSV = function () {
		if (this.isSet()) {
			return this.toRGB().toHSV();
		}
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	HSL.prototype.toXYZ = function () {
		if (this.isSet()) {
			return this.toRGB().toXYZ();
		}
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	HSL.prototype.toCIELab = function () {
		if (this.isSet()) {
			return this.toRGB().toCIELab();
		}
	};

	/**
	 * Convert to CSS string
	 * @returns {String}
	 */
	HSL.prototype.toString = function () {
		if (this.isSet()) {
			return 'hsl(' + Math.round(this.hue) + ', ' + Math.round(this.saturation) + '%, ' + Math.round(this.lightness) + '%)';
		}
	};

	/**
	 * Get a random HSL color
	 * @static
	 * @returns {HSL}
	 */
	HSL.random = function () {
		return RGB.random().toHSL();
	};

	/**
	 * HSLA color class
	 * @constructor
	 */
	function HSLA(hue, saturation, lightness, alpha) {
		if (Type.isNumber(hue) && Type.isNumber(saturation) && Type.isNumber(lightness)) {
			this.hue = hue;
			this.saturation = saturation;
			this.lightness = lightness;
			this.alpha = Type.isNumber(alpha) && alpha.between(0, 1) ? alpha : 1;
		} else if (Type.isObject(hue)) {
			if (hue instanceof this.constructor) {
				this.hue = hue.hue;
				this.saturation = hue.saturation;
				this.lightness = hue.lightness;
				this.alpha = hue.alpha;
			} else {
				return toHSLA(hue);
			}
		} else {
			return toHSLA(hue);
		}
	}

	$.HSLA = HSLA;

	HSLA.prototype.hue = undefined;
	HSLA.prototype.saturation = undefined;
	HSLA.prototype.lightness = undefined;
	HSLA.prototype.alpha = undefined;

	/**
	 * Check whether the HSLA object values are set
	 * @returns {Boolean}
	 */
	HSLA.prototype.isSet = function () {
		return Type.isNumber(this.hue) && Type.isNumber(this.saturation) && Type.isNumber(this.lightness) && Type.isNumber(this.alpha);
	};

	/**
	 * Convert to RGB color
	 * @param {Object} background
	 * @returns {RGB}
	 */
	HSLA.prototype.toRGB = function (background) {
		if (this.isSet()) {
			return this.toRGBA(background).toRGB();
		}
	};

	/**
	 * Convert to RGBA color
	 * @param {Object} background
	 * @returns {RGBA}
	 */
	HSLA.prototype.toRGBA = function (background) {
		if (this.isSet()) {
			var out = new HSL(this.hue, this.saturation, this.lightness);

			out = out.toRGBA();

			if (this.alpha !== 1) {
				out.alpha = this.alpha;
			}

			return out;
		}
	};

	/**
	 * Convert to Hex color
	 * @param {Object} background
	 * @returns {Hex}
	 */
	HSLA.prototype.toHex = function (background) {
		if (this.isSet()) {
			return this.toRGBA(background).toHex();
		}
	};

	/**
	 * Convert to HSL color
	 * @param {Object} background
	 * @returns {HSL}
	 */
	HSLA.prototype.toHSL = function (background) {
		if (this.isSet()) {
			var out = new HSL(this.hue, this.saturation, this.lightness);

			if (this.alpha === 1) {
				return out;
			} else {
				return this.toRGBA(background);
			}
		}
	};

	/**
	 * Convert to HSV color
	 * @param {Object} background
	 * @returns {HSV}
	 */
	HSLA.prototype.toHSV = function (background) {
		if (this.isSet()) {
			return this.toRGBA(background).toHSV();
		}
	};

	/**
	 * Convert to XYZ color
	 * @param {Object} background
	 * @returns {XYZ}
	 */
	HSLA.prototype.toXYZ = function (background) {
		if (this.isSet()) {
			return this.toRGBA(background).toXYZ();
		}
	};

	/**
	 * Convert to CIELab color
	 * @param {Object} background
	 * @returns {CIELab}
	 */
	HSLA.prototype.toCIELab = function (background) {
		if (this.isSet()) {
			return this.toRGBA(background).toCIELab();
		}
	};

	/**
	 * Convert to CSS string
	 * @returns {String}
	 */
	HSLA.prototype.toString = function () {
		if (this.isSet()) {
			return 'hsla(' + Math.round(this.hue) + ', ' + Math.round(this.saturation) + '%, ' + Math.round(this.lightness) + '%, ' + this.alpha + ')';
		}
	};

	/**
	 * Get a random HSLA color
	 * @static
	 * @param {Boolean} randomAlpha
	 * @returns {HSLA}
	 */
	HSLA.random = function (randomAlpha) {
		var out = HSL.random().toHSLA();

		if (randomAlpha) {
			out.alpha = Math.random().round(3);
		}

		return out;
	};

	/**
	 * HSV color class
	 * @constructor
	 */
	function HSV(hue, saturation, value) {
		if (Type.isNumber(hue) && Type.isNumber(saturation) && Type.isNumber(value)) {
			this.hue = hue;
			this.saturation = saturation;
			this.value = value;
		} else if (Type.isObject(hue)) {
			if (hue instanceof this.constructor) {
				this.hue = hue.hue;
				this.saturation = hue.saturation;
				this.value = hue.value;
			} else {
				return toHSV(hue);
			}
		} else {
			return toHSV(hue);
		}
	}

	$.HSV = HSV;

	HSV.prototype.hue = undefined;
	HSV.prototype.saturation = undefined;
	HSV.prototype.value = undefined;

	/**
	 * Check whether the HSV object values are set
	 * @returns {Boolean}
	 */
	HSV.prototype.isSet = function () {
		return Type.isNumber(this.hue) && Type.isNumber(this.saturation) && Type.isNumber(this.value);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	HSV.prototype.toRGB = function () {
		if (this.isSet()) {
			var hue = this.hue;
			var saturation = this.saturation;
			var value = this.value;
			var red = null;
			var green = null;
			var blue = null;

			if (saturation === 0) {
				red = Math.round(value * 2.55);

				return new RGB(red, red, red);
			} else {
				hue /= 60;
				saturation /= 100;
				value /= 100;

				var i = Math.floor(hue);
				var f = hue - i;
				var p = value * (1 - saturation);
				var q = value * (1 - saturation * f);
				var t = value * (1 - saturation * (1 - f));

				switch (i) {
					case 0:
						red = value;
						green = t;
						blue = p;

						break;

					case 1:
						red = q;
						green = value;
						blue = p;

						break;

					case 2:
						red = p;
						green = value;
						blue = t;

						break;

					case 3:
						red = p;
						green = q;
						blue = value;

						break;

					case 4:
						red = t;
						green = p;
						blue = value;

						break;

					default:
						red = value;
						green = p;
						blue = q;
				}

				return new RGB(Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255));
			}
		}
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	HSV.prototype.toRGBA = function () {
		if (this.isSet()) {
			return this.toRGB().toRGBA();
		}
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	HSV.prototype.toHex = function () {
		if (this.isSet()) {
			return this.toRGB().toHex();
		}
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	HSV.prototype.toHSL = function () {
		if (this.isSet()) {
			return this.toRGB().toHSL();
		}
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	HSV.prototype.toHSLA = function () {
		if (this.isSet()) {
			return this.toRGB().toHSLA();
		}
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	HSV.prototype.toXYZ = function () {
		if (this.isSet()) {
			return this.toRGB().toXYZ();
		}
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	HSV.prototype.toCIELab = function () {
		if (this.isSet()) {
			return this.toRGB().toCIELab();
		}
	};

	/**
	 * Get a random HSV color
	 * @static
	 * @returns {HSV}
	 */
	HSV.random = function () {
		return RGB.random().toHSV();
	};

	/**
	 * XYZ color class
	 * @constructor
	 */
	function XYZ(X, Y, Z) {
		if (Type.isNumber(X) && Type.isNumber(Y) && Type.isNumber(Z)) {
			this.X = X;
			this.Y = Y;
			this.Z = Z;
		} else if (Type.isObject(X)) {
			if (X instanceof this.constructor) {
				this.X = X.X;
				this.Y = X.Y;
				this.Z = X.Z;
			} else {
				return toXYZ(X);
			}
		} else {
			return toXYZ(X);
		}
	}

	$.XYZ = XYZ;

	XYZ.prototype.X = undefined;
	XYZ.prototype.Y = undefined;
	XYZ.prototype.Z = undefined;

	/**
	 * Check whether the XYZ object values are set
	 * @returns {Boolean}
	 */
	XYZ.prototype.isSet = function () {
		return Type.isNumber(this.X) && Type.isNumber(this.Y) && Type.isNumber(this.Z);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	XYZ.prototype.toRGB = function () {
		if (this.isSet()) {
			var X = this.X / 100;
			var Y = this.Y / 100;
			var Z = this.Z / 100;
			var red = (X * 3.2406) + (Y * -1.5372) + (Z * -0.4986);
			var green = (X * -0.9689) + (Y * 1.8758) + (Z * 0.0415);
			var blue = (X * 0.0557) + (Y * -0.2040) + (Z * 1.0570);

			red = Math.round((red > 0.0031308 ? (1.055 * Math.pow(red, 1 / 2.4)) - 0.055 : 12.92 * red) * 255);
			green = Math.round((green > 0.0031308 ? (1.055 * Math.pow(green, 1 / 2.4)) - 0.055 : 12.92 * green) * 255);
			blue = Math.round((blue > 0.0031308 ? (1.055 * Math.pow(blue, 1 / 2.4)) - 0.055 : 12.92 * blue) * 255);

			return new RGB(red, green, blue);
		}
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	XYZ.prototype.toRGBA = function () {
		if (this.isSet()) {
			return this.toRGB().toRGBA();
		}
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	XYZ.prototype.toHex = function () {
		if (this.isSet()) {
			return this.toRGB().toHex();
		}
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	XYZ.prototype.toHSL = function () {
		if (this.isSet()) {
			return this.toRGB().toHSL();
		}
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	XYZ.prototype.toHSLA = function () {
		if (this.isSet()) {
			return this.toRGB().toHSLA();
		}
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	XYZ.prototype.toHSV = function () {
		if (this.isSet()) {
			return this.toRGB().toHSV();
		}
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	XYZ.prototype.toCIELab = function () {
		if (this.isSet()) {
			var X = this.X / 95.047;
			var Y = this.Y / 100;
			var Z = this.Z / 108.883;

			X = X > 0.008856 ? Math.pow(X, 1 / 3) : (7.787 * X) + (16 / 116);
			Y = Y > 0.008856 ? Math.pow(Y, 1 / 3) : (7.787 * Y) + (16 / 116);
			Z = Z > 0.008856 ? Math.pow(Z, 1 / 3) : (7.787 * Z) + (16 / 116);

			var L = (116 * Y ) - 16;
			var a = 500 * (X - Y);
			var b = 200 * (Y - Z);

			return new CIELab(L, a, b);
		}
	};

	/**
	 * Get a random XYZ color
	 * @static
	 * @returns {XYZ}
	 */
	XYZ.random = function () {
		return RGB.random().toXYZ();
	};

	/**
	 * CIELab color class
	 * @constructor
	 */
	function CIELab(L, a, b) {
		if (Type.isNumber(L) && Type.isNumber(a) && Type.isNumber(b)) {
			this.L = L;
			this.a = a;
			this.b = b;
		} else if (Type.isObject(L)) {
			if (L instanceof this.constructor) {
				this.L = L.L;
				this.a = L.a;
				this.b = L.b;
			} else {
				return toCIELab(L);
			}
		} else {
			return toCIELab(L);
		}
	}

	$.CIELab = CIELab;

	CIELab.prototype.L = undefined;
	CIELab.prototype.a = undefined;
	CIELab.prototype.b = undefined;

	/**
	 * Check whether the CIELab object values are set
	 * @returns {Boolean}
	 */
	CIELab.prototype.isSet = function () {
		return Type.isNumber(this.L) && Type.isNumber(this.a) && Type.isNumber(this.b);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	CIELab.prototype.toRGB = function () {
		if (this.isSet()) {
			return this.toXYZ().toRGB();
		}
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	CIELab.prototype.toRGBA = function () {
		if (this.isSet()) {
			return this.toXYZ().toRGBA();
		}
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	CIELab.prototype.toHex = function () {
		if (this.isSet()) {
			return this.toXYZ().toHex();
		}
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	CIELab.prototype.toHSL = function () {
		if (this.isSet()) {
			return this.toXYZ().toHSL();
		}
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	CIELab.prototype.toHSLA = function () {
		if (this.isSet()) {
			return this.toXYZ().toHSLA();
		}
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	CIELab.prototype.toHSV = function () {
		if (this.isSet()) {
			return this.toXYZ().toHSV();
		}
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	CIELab.prototype.toXYZ = function () {
		var Y = (this.L + 16) / 116;
		var X = this.a / 500 + Y;
		var Z = Y - this.b / 200;
		var X3 = Math.pow(X, 3);
		var Y3 = Math.pow(Y, 3);
		var Z3 = Math.pow(Z, 3);

		X = (X3 > 0.008856 ? X3 : (X - 16 / 116) / 7.787) * 95.047;
		Y = (Y3 > 0.008856 ? Y3 : (Y - 16 / 116) / 7.787) * 100;
		Z = (Z3 > 0.008856 ? Z3 : (Z - 16 / 116) / 7.787) * 108.883;

		return new XYZ(X, Y, Z);
	};

	/**
	 * Get a random CIELab color
	 * @static
	 * @returns {CIELab}
	 */
	CIELab.random = function () {
		return XYZ.random().toCIELab();
	};

	/**
	 * Hue color class
	 * @constructor
	 */
	function Hue() {}

	$.Hue = Hue;

	/**
	 * Convert hue to RGB value
	 * @static
	 * @param {Number} p
	 * @param {Number} q
	 * @param {Number} t
	 * @returns {Number}
	 */
	Hue.toRGB = function (p, q, t) {
		if (t < 0) {
			t += 1;
		}

		if (t > 1) {
			t -= 1;
		}

		if (t < 1 / 6) {
			return p + (q - p) * 6 * t;
		}

		if (t < 1 / 2) {
			return q;
		}

		if (t < 2 / 3) {
			return p + (q - p) * (2 / 3 - t) * 6;
		}

		return p;
	};

	/**
	 * Shift hue value by number of degrees
	 * @static
	 * @param {Number} hue
	 * @param {Number} angle
	 * @returns {Number}
	 */
	Hue.shift = function (hue, angle) {
		hue += angle;

		while (hue >= 360) {
			hue -= 360;
		}

		while (hue < 0) {
			hue += 360;
		}

		return hue;
	};

	/**
	 * Calculate Euclidean distance between two colors
	 * @param {Object|String} color1
	 * @param {Object|String} color2
	 * @param {Boolean} disableBias If false include eye sensitivity bias
	 * @return {Number} Euclidean distance between the colors
	 */
	function distance(color1, color2, disableBias) {
		if (color1 && color2) {
			color1 = toRGB(color1);
			color2 = toRGB(color2);

			if (color1 !== undefined && color2 !== undefined && color1.isSet() && color2.isSet()) {
				var result = 0;

				// Euclidean distance
				if (disableBias !== true) {
					// Bias according to eye sensitivity
					result = (Math.pow(color2.red - color1.red, 2) * 0.3) + (Math.pow(color2.green - color1.green, 2) * 0.59) + (Math.pow(color2.blue - color1.blue, 2) * 0.11);
				} else {
					result = Math.pow(color2.red - color1.red, 2) + Math.pow(color2.green - color1.green, 2) + Math.pow(color2.blue - color1.blue, 2);
				}

				return Math.sqrt(result);
			}
		}
	}

	$.distance = distance;

	/**
	 * Basic color mix functionality
	 * @returns {Object} Mixed color result
	 */
	function mix() {
		var len = arguments.length;

		if (len > 0 && arguments[0]) {
			var type = Color.getType(arguments[0]);

			if (type) {
				if (len > 1) {
					var color = toRGB(arguments[0]);

					if (color !== undefined && color.isSet()) {
						var cur;
						var realLen = 1;

						while (len--) {
							if (arguments[len]) {
								cur = toRGB(arguments[len]);

								if (cur !== undefined && cur.isSet()) {
									color.red += cur.red;
									color.green += cur.green;
									color.blue += cur.blue;

									++realLen;
								}
							}
						}

						if (realLen > 1) {
							color.red = Math.round(color.red / realLen);
							color.green = Math.round(color.green / realLen);
							color.blue = Math.round(color.blue / realLen);

							return Color.toType(color, type);
						}
					}
				}

				return Color.toType(arguments[0], type);
			}
		}
	}

	$.mix = mix;

	/**
	 * Randomly mutate a color
	 * @param {Object|String} color Color to mutate
	 * @param {Number} change Rate of change
	 * @returns {Object}
	 */
	function mutate(color, change) {
		if (color && Type.isNumber(change) && change.between(0, 1)) {
			var type = Color.getType(color);

			if (type) {
				color = toRGB(color);
				change *= 255;

				if (color !== undefined && color.isSet()) {
					// Mutated red
					var red = Math.random() * 2 > 1 ? color.red + change : color.red - change;

					if (red > 255) {
						red = color.red - change;
					} else if (red < 0) {
						red = color.red + change;
					}

					// Mutated green
					var green = Math.random() * 2 > 1 ? color.green + change : color.green - change;

					if (green > 255) {
						green = color.green - change;
					} else if (green < 0) {
						green = color.green + change;
					}

					// Mutated blue
					var blue = Math.random() * 2 > 1 ? color.blue + change : color.blue - change;

					if (blue > 255) {
						blue = color.blue - change;
					} else if (blue < 0) {
						blue = color.blue + change;
					}

					return Color.toType(new RGB(red, green, blue), type);
				}
			}
		}
	}

	$.mutate = mutate;

	/**
	 * Adjust the saturation of a color
	 * @private
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @param {String} adjustment Option to either saturate or desaturate
	 * @returns {Object}
	 */
	function adjustSaturation(color, multiplier, adjustment) {
		if (color && Type.isNumber(multiplier) && ['saturate', 'desaturate'].contains(adjustment)) {
			var type = Color.getType(color);

			if (type) {
				color = toHSL(color);

				if (color !== undefined && color.isSet()) {
					var saturation = color.saturation;

					if (adjustment === 'saturate') {
						saturation += saturation * multiplier;
					} else {
						saturation -= saturation * multiplier;
					}

					if (saturation > 100) {
						color.saturation = 100;
					} else if (saturation < 0) {
						color.saturation = 0;
					} else {
						color.saturation = saturation;
					}

					return Color.toType(color, type);
				}
			}
		}
	}

	/**
	 * Saturate a color
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object}
	 */
	function saturate(color, multiplier) {
		return adjustSaturation(color, multiplier, 'saturate');
	}

	$.saturate = saturate;

	/**
	 * Desaturate a color
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object}
	 */
	function desaturate(color, multiplier) {
		return adjustSaturation(color, multiplier, 'desaturate');
	}

	$.desaturate = desaturate;

	/**
	 * Get the grayscale version of a color (fully desaturate)
	 * @param {Object|String} color
	 * @returns {Object}
	 */
	function grayscale(color) {
		return adjustSaturation(color, 1, 'desaturate');
	}

	$.grayscale = grayscale;

	/**
	 * Basic adjustment of the lightness of a color
	 * @private
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @param {String} adjustment Option to either darken or lighten
	 * @returns {Object}
	 */
	function adjustLightness(color, multiplier, adjustment) {
		if (color && Type.isNumber(multiplier) && ['darken', 'lighten'].contains(adjustment)) {
			var type = Color.getType(color);

			if (type) {
				color = toHSL(color);

				if (color !== undefined && color.isSet()) {
					var change = color.lightness * multiplier;

					if (adjustment === 'darken') {
						color.lightness -= change;
					} else {
						color.lightness += change;
					}

					if (color.lightness > 100) {
						color.lightness = 100;
					} else if (color.lightness < 0) {
						color.lightness = 0;
					}

					return Color.toType(color, type);
				}
			}
		}
	}

	/**
	 * Darkens a color by a multiplier value, e.g. 0.25 darkens by 25%
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object}
	 */
	function darken(color, multiplier) {
		return adjustLightness(color, multiplier, 'darken');
	}

	$.darken = darken;

	/**
	 * Lightens a color by a multiplier value, e.g. 0.25 lightens by 25%
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object}
	 */
	function lighten(color, multiplier) {
		return adjustLightness(color, multiplier, 'lighten');
	}

	$.lighten = lighten;

	/**
	 * Produce a gradient between 2 or more colors. If the last argument is a number it is assumed to be the number of steps between colors.
	 * @returns {Array.<Object>} Gradient colors in a array
	 */
	function gradient() {
		var len = arguments.length;

		if (len > 1) {
			var fromArray = Type.isArray(arguments[0]);
			var colors = fromArray ? arguments[0] : arguments;
			var colorsLen = colors.length;

			if (colorsLen > 1) {
				var type = Color.getType(colors[0]);

				if (type) {
					var steps = 4; // Original color + 4 = 5
					var count = len - 1;

					if (Type.isNumber(arguments[count])) {
						if ((colorsLen + len) < 3) {
							return undefined;
						} else {
							steps = arguments[count] - 1;

							if (!fromArray) {
								colorsLen--;
							}
						}
					}

					if (colorsLen > 1) {
						var last = toRGB(colors[0]);
						var out = [Color.toType(last, type)];
						var realLen = 1;
						var current, changeR, changeG, changeB;

						for (var i = 1; i < colorsLen; ++i) {
							current = toRGB(colors[i]);

							if (current !== undefined && current.isSet()) {
								changeR = (last.red - current.red) / steps;
								changeG = (last.green - current.green) / steps;
								changeB = (last.blue - current.blue) / steps;

								for (var x = 0; x < steps; ++x) {
									last.red -= changeR;
									last.green -= changeG;
									last.blue -= changeB;

									// Push to output array
									out.push(Color.toType(last, type));
								}

								last = current;

								++realLen;
							}
						}

						if (realLen > 1) {
							return out;
						}
					}
				}
			}
		}
	}

	$.gradient = gradient;

	/**
	 * Shift the color's hue by a give number of degrees
	 * @returns {Object}
	 */
	function shiftHue() {
		var len = arguments.length;

		if (len > 1) {
			var type = Color.getType(arguments[0]);

			if (type) {
				var color = toHSL(arguments[0]);

				if (color !== undefined && color.isSet()) {
					var out = [];

					for (var i = 1; i < len; ++i) {
						if (Type.isNumber(arguments[i])) {
							color.hue = Hue.shift(color.hue, arguments[i]);

							out.push(Color.toType(color, type));
						}
					}

					return out;
				}
			}
		}
	}

	$.shiftHue = shiftHue;

	/**
	 * Return the complement of the given color
	 * @param {Object|String} color
	 * @returns {Object} complementary color
	 */
	function complement(color) {
		if (color) {
			color = shiftHue(color, 180);

			if (!Util.empty(color)) {
				return color[0];
			}
		}
	}

	$.complement = complement;

	/**
	 * Return the analogous colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>}
	 */
	function analogous(color) {
		return shiftHue(color, -30, 60);
	}

	$.analogous = analogous;

	/**
	 * Return the split colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>}
	 */
	function split(color) {
		return shiftHue(color, -150, 300);
	}

	$.split = split;

	/**
	 * Return the triad colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>}
	 */
	function triad(color) {
		return shiftHue(color, -120, 240);
	}

	$.triad = triad;

	/**
	 * Return the square colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>}
	 */
	function square(color) {
		return shiftHue(color, 90, 90, 90);
	}

	$.square = square;

	/**
	 * Return the tetradic colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>}
	 */
	function tetradic(color) {
		return shiftHue(color, 60, 120, 60);
	}

	$.tetradic = tetradic;

	/**
	 * Perceieved brightness, if value is greater than 125 chose black foreground text, otherwise white
	 * @see http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
	 * @param {Object|String} color1 Color object / value
	 * @param {Object|String} color2 Color object / value
	 * @returns {Number} Range between 0-500
	 */
	function brightness(color) {
		if (color) {
			color = toRGB(color);

			if (color !== undefined && color.isSet()) {
				return ((color.red * 299) + (color.green * 587) + (color.blue * 114)) / 1000;
			}
		}
	}

	$.brightness = brightness;

	/**
	 * Perceieved brightness between two colors
	 * @see http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
	 * @param {Object|String} color1 Color object / value
	 * @param {Object|String} color2 Color object / value
	 * @returns {Number} Range between 0-500
	 */
	function brightnessDifference(color1, color2) {
		if (color1 && color2) {
			color1 = toRGB(color1);
			color2 = toRGB(color2);

			if (color1 !== undefined && color2 !== undefined && color1.isSet() && color2.isSet()) {
				return (Math.max(color1.red, color2.red) - Math.min(color1.red, color2.red)) + (Math.max(color1.green, color2.green) - Math.min(color1.green, color2.green)) + (Math.max(color1.blue, color2.blue) - Math.min(color1.blue, color2.blue));
			}
		}
	}

	$.brightnessDifference = brightnessDifference;

	/**
	 * Select a readable foreground color for the supplied background
	 * @param {Object|String} background Color object / value
	 * @param {Object|String} foreground Color object / value - optional, if not supplied a color complementary to the background will be used
	 * @returns {Object|String} Foreground color with high readability
	 */
	function selectForeground(background, foreground, difference) {
		if (background) {
			var type = Color.getType(background);

			if (type) {
				if (!foreground) {
					foreground = complement(background);
				}

				if (!difference) {
					difference = 45;
				}

				background = toHSL(background);
				foreground = toHSL(foreground);

				if (background !== undefined && foreground !== undefined && background.isSet() && foreground.isSet()) {
					foreground.lightness = background.lightness + (background.lightness < 50 ? difference : -difference);

					if (foreground.lightness < 0) {
						foreground.lightness = 0;
					} else if (foreground.lightness > 100) {
						foreground.lightness = 100;
					}

					return Color.toType(foreground, type);
				}
			}
		}
	}

	$.selectForeground = selectForeground;

	/**
	 * Set the default EM dimension (in pixels)
	 * @param {Number} value Dimension in pixels
	 */
	function setEmSize(value) {
		if (Type.isNumber(value)) {
			emSize = value;
		}
	}

	$.setEmSize = setEmSize;

	/**
	 * Calculate the result of a calculate() expression match
	 * @private
	 * @param {undefined} undefined
	 * @param {Number} contents
	 * @returns {Number}
	 */
	function expressionMatch(undefined, contents) {
		return contents * emSize;
	}

	/**
	 * CSS3-like calc() long form
	 * @param {String} expression
	 * @returns {String} Result of the given expression
	 */
	function calculate(expression) {
		if (Type.isNumber(emSize)) {
			var result = eval(expression.replace(/([0-9]+(\.[0-9]+)?)em/gi, expressionMatch).replace(/([0-9]+(\.[0-9]+)?)px/gi, '$1'));

			if (Type.isNumber(result)) {
				return Math.round(result) + 'px';
			}
		}
	}

	$.calculate = calculate;

	/**
	 * CSS3-like calc()
	 * @param {String} expression
	 * @returns {String} Result of the given expression
	 */
	function calc(expression) {
		return calculate(expression);
	}

	$.calc = calc;

	/**
	 * Convert color to a given color space
	 * @private
	 * @param {Object|String} color
	 * @param {String} space
	 * @returns {Object}
	 */
	function toColorSpace(color, space) {
		if (color && space) {
			space = 'to' + space;

			if (Type.isFunction($[space])) {
				var type = Color.getType(color);

				if (type) {
					color = new $[type](color);

					if (Type.isFunction(color[space])) {
						return color[space]();
					}
				}
			}
		}
	}

	/**
	 * Convert color to a Hex color
	 * @param {Object|String} color
	 * @returns {Hex}
	 */
	function toHex(color) {
		return toColorSpace(color, Color.HEX);
	}

	$.toHex = toHex;

	/**
	 * Convert color to RGB color space
	 * @param {Object|String} color
	 * @returns {RGB}
	 */
	function toRGB(color) {
		return toColorSpace(color, Color.RGB);
	}

	$.toRGB = toRGB;

	/**
	 * Convert color to RGBA color space
	 * @param {Object|String} color
	 * @returns {RGBA}
	 */
	function toRGBA(color) {
		return toColorSpace(color, Color.RGBA);
	}

	$.toRGBA = toRGBA;

	/**
	 * Convert color to HSL color space
	 * @param {Object|String} color
	 * @returns {HSL}
	 */
	function toHSL(color) {
		return toColorSpace(color, Color.HSL);
	}

	$.toHSL = toHSL;

	/**
	 * Convert color to HSLA color space
	 * @param {Object|String} color
	 * @returns {HSLA}
	 */
	function toHSLA(color) {
		return toColorSpace(color, Color.HSLA);
	}

	$.toHSLA = toHSLA;

	/**
	 * Convert color to HSV color space
	 * @param {Object|String} color
	 * @returns {HSV}
	 */
	function toHSV(color) {
		return toColorSpace(color, Color.HSV);
	}

	$.toHSV = toHSV;

	/**
	 * Convert color to XYZ color space
	 * @param {Object|String} color
	 * @returns {XYZ}
	 */
	function toXYZ(color) {
		return toColorSpace(color, Color.XYZ);
	}

	$.toXYZ = toXYZ;

	/**
	 * Convert color to CIELab color space
	 * @param {Object|String} color
	 * @returns {CIELab}
	 */
	function toCIELab(color) {
		return toColorSpace(color, Color.CIELAB);
	}

	$.toCIELab = toCIELab;

	/**
	 * Convert color to its nearest web safe equivalent
	 * @param {Object|String} color
	 * @param {Boolean} disableBias If false include eye sensitivity bias
	 * @returns {String}
	 */
	function toWebSafe(color, disableBias) {
		if (color) {
			var type = Color.getType(color);

			if (type) {
				var out = '', current = 0, last = null;

				if (type !== Color.NAMED) {
					color = new Hex(color);
				}

				if (Color.webSafe[color.value]) {
					return color;
				} else {
					for (var hex in Color.webSafe) {
						if (Type.isString(Color.webSafe[hex])) {
							hex = '#' + hex;
							current = distance(color, hex, disableBias);

							if (last === null || current < last) {
								out = hex;
								last = current;
							}
						}
					}

					return Color.toType(out, type);
				}
			}
		}
	}

	$.toWebSafe = toWebSafe;

	/**
	 * Convert color to its exact or nearest named equivalent
	 * @param {Object|String} color
	 * @param {Boolean} approximate If true return closest named color
	 * @param {Boolean} disableBias If false include eye sensitivity bias
	 * @returns {String}
	 */
	function toNamed(color, approximate, disableBias) {
		if (color) {
			color = toHex(color);

			if (color !== undefined && color.isSet()) {
				var value = '#' + color.getValue().toLowerCase();
				var current;
				var hex;

				if (approximate !== true) {
					for (hex in Color.list) {
						if (!Type.isFunction(Color.list[hex])) {
							current = Color.list[hex];

							if (Type.isArray(current)) {
								current = current[0];
							}

							if (Type.isString(current) && hex === value) {
								return current;
							}
						}
					}
				} else {
					var dist = 0;
					var out, last;

					for (hex in Color.list) {
						if (!Type.isFunction(Color.list[hex])) {
							current = Color.list[hex];

							if (Type.isArray(current)) {
								current = current[0];
							}

							if (Type.isString(current)) {
								if (hex === value) {
									return current;
								} else {
									dist = distance(color, hex, disableBias);

									if (!last || dist < last) {
										out = current;
										last = dist;
									}
								}
							}
						}
					}

					return out;
				}
			}
		}
	}

	$.toNamed = toNamed;

	/**
	 * Convert the matched colors in a string to the given color space
	 * @param {String} space
	 * @returns {String}
	 */
	String.prototype.toColorSpace = function (space) {
		if (space) {
			space = 'to' + space;

			if (Type.isFunction($[space])) {
				return this.replace(Color.regex.all, function (undefined, contents) {
					return $[space](contents);
				});
			}
		}
	};

	/**
	 * Convert the matched colors in a string to Hex
	 * @returns {String}
	 */
	String.prototype.toHex = function () {
		return this.toColorSpace(Color.HEX);
	};

	/**
	 * Convert the matched colors in a string to RGB
	 * @returns {String}
	 */
	String.prototype.toRGB = function () {
		return this.toColorSpace(Color.RGB);
	};

	/**
	 * Convert the matched colors in a string to HSL
	 * @returns {String}
	 */
	String.prototype.toHSL = function () {
		return this.toColorSpace(Color.HSL);
	};

	/**
	 * Convert the matched colors in a string to HSLA
	 * @returns {String}
	 */
	String.prototype.toHSLA = function () {
		return this.toColorSpace(Color.HSLA);
	};

	/**
	 * Convert the matched colors in the object's values to the given color space
	 * @param {String} space
	 * @returns {Object}
	 */
	Object.prototype.toColorSpace = function (space) {
		var out = {};
		var func = 'to' + space;

		for (var i in this) {
			out[i] = Type.isString(this[i]) || Type.isArray(this[i]) ? this[i][func]() : this[i];
		}

		return out;
	};

	/**
	 * Convert the matched colors in the object's values to Hex
	 * @returns {Object}
	 */
	Object.prototype.toHex = function () {
		return this.toColorSpace(Color.HEX);
	};

	/**
	 * Convert the matched colors in the object's values to RGB
	 * @returns {Object}
	 */
	Object.prototype.toRGB = function () {
		return this.toColorSpace(Color.RGB);
	};

	/**
	 * Convert the matched colors in the object's values to RGBA
	 * @returns {Object}
	 */
	Object.prototype.toRGBA = function () {
		return this.toColorSpace(Color.RGBA);
	};

	/**
	 * Convert the matched colors in the object's values to HSL
	 * @returns {Object}
	 */
	Object.prototype.toHSL = function () {
		return this.toColorSpace(Color.HSL);
	};

	/**
	 * Convert the matched colors in the object's values to HSLA
	 * @returns {Object}
	 */
	Object.prototype.toHSLA = function () {
		return this.toColorSpace(Color.HSLA);
	};

	/**
	 * Convert values in the array to the given color space
	 * @param {String} space
	 * @returns {Array}
	 */
	Array.prototype.toColorSpace = function (space) {
		var out = [];
		var func = 'to' + space;
		var len = this.length;

		for (var i = 0; i < len; ++i) {
			out.push(Type.isString(this[i]) ? this[i][func]() : this[i]);
		}

		return out;
	};

	/**
	 * Convert values in the array to Hex
	 * @returns {Array}
	 */
	Array.prototype.toHex = function () {
		return this.toColorSpace(Color.HEX);
	};

	/**
	 * Convert values in the array to RGB
	 * @returns {Array}
	 */
	Array.prototype.toRGB = function () {
		return this.toColorSpace(Color.RGB);
	};

	/**
	 * Convert values in the array to RGBA
	 * @returns {Array}
	 */
	Array.prototype.toRGBA = function () {
		return this.toColorSpace(Color.RGBA);
	};

	/**
	 * Convert values in the array to HSL
	 * @returns {Array}
	 */
	Array.prototype.toHSL = function () {
		return this.toColorSpace(Color.HSL);
	};

	/**
	 * Convert values in the array to HSLA
	 * @returns {Array}
	 */
	Array.prototype.toHSLA = function () {
		return this.toColorSpace(Color.HSLA);
	};

	/**
	 * CSS functionality
	 * @constructor
	 */
	function CSS() {}

	$.CSS = CSS;

	/**
	 * CSS properties list
	 * @type {Object.<String, Array.<String>}
	 */
	CSS.properties = {
		borderRadius: ['-webkit-border-radius', '-moz-border-radius', 'border-radius'],
		borderRadiusTopLeft: ['-webkit-border-top-left-radius', '-moz-border-radius-topleft', 'border-top-left-radius'],
		borderRadiusBottomLeft: ['-webkit-border-bottom-left-radius', '-moz-border-radius-bottomleft', 'border-bottom-left-radius'],
		borderRadiusBottomRight: ['-webkit-border-bottom-right-radius', '-moz-border-radius-bottomright', 'border-bottom-right-radius'],
		borderRadiusTopRight: ['-webkit-border-top-right-radius', '-moz-border-radius-topright', 'border-top-right-radius'],
		gradientLinear: ['-moz-linear-gradient', '-webkit-linear-gradient', '-o-linear-gradient', '-ms-linear-gradient', 'linear-gradient'],
		gradientRadial: ['-moz-radial-gradient', '-webkit-radial-gradient', '-o-radial-gradient', '-ms-radial-gradient', 'radial-gradient'],
		boxShadow: ['-moz-box-shadow', '-webkit-box-shadow', 'box-shadow']
	};

	/**
	 * Color values which have CSS representations, e.g. rgb(12, 34, 56)
	 * @constant
	 * @type {Array.<String>}
	 */
	CSS.colorTypes = ['Hex', 'RGB', 'HSL'];

	/**
	 * Return the named property with the supplied value
	 * @private
	 * @param {String} property Property name
	 * @param {String|Number} property Property value
	 * @returns {Object}
	 */
	CSS.getProperty = function (property, value) {
		if (property && value && CSS.properties.hasOwnProperty(property)) {
			var out = {};
			var len = CSS.properties[property].length;

			for (var i = 0; i < len; ++i) {
				out[CSS.properties[property][i]] = value;
			}

			return out;
		}
	};

	/**
	 * Returns cross browser border properties
	 * @param {String|Number} topLeft
	 * @param {String|Number} bottomLeft
	 * @param {String|Number} bottomRight
	 * @param {String|Number} topRight
	 * @returns {Object}
	 */
	CSS.borderRadius = function (topLeft, bottomLeft, bottomRight, topRight) {
		if (topLeft && (!bottomLeft && !bottomRight && !topRight)) {
			var len = CSS.properties.borderRadius.length;
			var out = {};

			if (Type.isNumber(topLeft)) {
				topLeft += 'px';
			}

			for (var i = 0; i < len; ++i) {
				out[CSS.properties.borderRadius[i]] = topLeft;
			}

			return out;
		} else if (topLeft || bottomLeft || bottomRight || topRight) {
			var out = {};

			if (topLeft) {
				if (Type.isNumber(topLeft)) {
					topLeft += 'px';
				}

				out.extend(CSS.getProperty('borderRadiusTopLeft', topLeft));
			}

			if (bottomLeft) {
				if (Type.isNumber(bottomLeft)) {
					bottomLeft += 'px';
				}

				out.extend(CSS.getProperty('borderRadiusBottomLeft', bottomLeft));
			}

			if (bottomRight) {
				if (Type.isNumber(bottomRight)) {
					bottomRight += 'px';
				}

				out.extend(CSS.getProperty('borderRadiusBottomRight', bottomRight));
			}

			if (topRight) {
				if (Type.isNumber(topRight)) {
					topRight += 'px';
				}

				out.extend(CSS.getProperty('borderRadiusTopRight', topRight));
			}

			return out;
		}
	};

	/**
	 * Get CSS gradient for specified argument values
	 * @returns {Object}
	 */
	CSS.gradient = function () {
		var len = arguments.length;

		if (len > 2) {
			var orientation = arguments[0].toLowerCase();

			if (orientation === 'linear' || orientation === 'radial') {
				var properties = CSS.properties['gradient' + orientation.upperCaseFirst()];
				var propertyValue = '';
				var position = arguments[1];
				var out = [];
				var i;

				if (orientation === 'linear') {
					for (i = 2; i < arguments.length; ++i) {
						if (Type.isScalar(arguments[i])) {
							propertyValue += ', ' + arguments[i];
						}
					}

					for (i = 0; i < properties.length; ++i) {
						out.push(properties[i] + '(' + position + propertyValue + ')');
					}
				} else {
					var shape = arguments[2];

					for (i = 3; i < arguments.length; ++i) {
						if (Type.isScalar(arguments[i])) {
							propertyValue += ', ' + arguments[i];
						}
					}

					for (i = 0; i < properties.length; ++i) {
						out.push(properties[i] + '(' + position + ', ' + shape + propertyValue + ')');
					}
				}

				if (!Util.empty(out)) {
					return {
						background: out
					};
				}
			}
		}
	};

	/**
	 * Get CSS linear gradient for specified argument values
	 * @returns {Object}
	 */
	CSS.linearGradient = function () {
		return CSS.gradient.apply(null, ['linear'].concat(arguments.toArray()));
	};

	/**
	 * Get CSS radial gradient for specified argument values
	 * @returns {Object}
	 */
	CSS.radialGradient = function () {
		return CSS.gradient.apply(null, ['radial'].concat(arguments.toArray()));
	};

	/**
	 * Get CSS text shadow for specified argument values
	 * @param {String|Number} horizontalLength
	 * @param {String|Number} verticalLength
	 * @param {String|Number} blurRadius
	 * @param {String|Object} color
	 * @returns {Object}
	 */
	CSS.textShadow = function (horizontalLength, verticalLength, blurRadius, color) {
		if (horizontalLength !== undefined && verticalLength !== undefined) {
			var value = [];

			if (!horizontalLength) {
				horizontalLength = 0;
			} else if (Type.isNumber(horizontalLength)) {
				horizontalLength += 'px';
			}

			value.push(horizontalLength);

			if (!verticalLength) {
				verticalLength = 0;
			} else if (Type.isNumber(verticalLength)) {
				verticalLength += 'px';
			}

			value.push(verticalLength);

			if (blurRadius) {
				if (Type.isNumber(blurRadius)) {
					blurRadius += 'px';
				}

				value.push(blurRadius);
			}

			if (color && Color.isValidCSS(color)) {
				value.push(color.toString());
			}

			return {
				text_shadow: value.join(' ')
			};
		}
	};

	/**
	 * Get CSS box shadow for specified argument values
	 * @param {String|Number} value
	 * @returns {Object}
	 */
	CSS.boxShadow = function (horizontalLength, verticalLength, blurRadius, spread, color, set) {
		if (horizontalLength !== undefined && verticalLength !== undefined) {
			var value = [];

			if (!horizontalLength) {
				horizontalLength = 0;
			} else if (Type.isNumber(horizontalLength)) {
				horizontalLength += 'px';
			}

			value.push(horizontalLength);

			if (!verticalLength) {
				verticalLength = 0;
			} else if (Type.isNumber(verticalLength)) {
				verticalLength += 'px';
			}

			value.push(verticalLength);

			if (blurRadius) {
				if (Type.isNumber(blurRadius)) {
					blurRadius += 'px';
				}

				value.push(blurRadius);
			}

			if (spread) {
				if (Type.isNumber(spread)) {
					spread += 'px';
				}

				value.push(spread);
			}

			if (color && Color.isValidCSS(color)) {
				value.push(color);
			}

			if (set && (set === 'inset' || set === 'outset')) {
				value.push(set);
			}

			value = value.join(' ');

			var out = {};

			for (var i = 0; i < CSS.properties.boxShadow.length; ++i) {
				out[CSS.properties.boxShadow[i]] = value;
			}

			return out;
		}
	};

	/**
	 * Very basic CSS "parsing", very easy to break...
	 * @returns {Object}
	 */
	String.prototype.toObject = function () {
		var out = {};
		// Remove comments
		var definitions = this.replace(/\/\*([\s\S]*?)\*\//g, '').split(/\s*\}\s*/m);
		var len = definitions.length;

		if (len > 0) {
			var parts;
			var property;
			var properties;
			var propertiesLen;

			for (var i = 0; i < len; ++i) {
				parts = /\s*([^\{]*?)\s*\{\s*([^\{]+)\s*/gm.exec(definitions[i]);

				if (parts !== null && !Util.empty(parts[1]) && !Util.empty(parts[2])) {
					properties = parts[2].split(/\s*;\s*/m);
					propertiesLen = properties.length;

					if (propertiesLen > 0) {
						for (var x = 0; x < propertiesLen; ++x) {
							if (!Util.empty(properties[x])) {
								property = properties[x].split(/\s*:\s*/m);

								//alert(properties[x].match(/([^:]+)\s*:\s*(.+)/gi));

								if (property.length === 2 && !Util.empty(property[0]) && !Util.empty(property[1])) {
									if (out[parts[1]] === undefined) {
										out[parts[1]] = {};
									}

									out[parts[1]][property[0]] = property[1];
								}
							}
						}
					}
				}
			}
		}

		return out;
	};

/*
	Image.prototype.toCanvas = function (obj) {
		if (obj && obj.nodeName == 'CANVAS') {
			obj.width = this.width;
			obj.height = this.height;

			var context = obj.getContext('2d');

			context.drawImage(this, 0, 0, this.width, this.height);
		}
	};

	function toCanvas(obj, canvas) {
		if (isElement(canvas) && canvas.nodeName == 'CANVAS') {
			if (Type.isString(obj)) {
				var src = obj;

				obj = new Image();
				obj.src = src;
			}

			if (isImage(obj)) {
				obj.onload = function () {
					obj.toCanvas(canvas);
				};
			}
		}
	}

	$.toCanvas = toCanvas;

	function Canvas() {}

	$.Canvas = Canvas;

	Canvas.getColors = function (canvas, type) {
		if (!type) {
			type = Color.HEX;
		}

		if (isElement(canvas) && canvas.nodeName == 'CANVAS') {
			var context = canvas.getContext('2d');
			var image = context.getImageData(0, 0, canvas.width, canvas.height);
			var imageData = image.data;
			var len = canvas.width * canvas.height;
			var tmp;

			while (--len) {
				tmp = new RGB(imageData[4 * len], imageData[4 * len + 1], imageData[4 * len + 2]);

				alert(tmp);

				break;
			}
		}
	};
	 */
})(this);
