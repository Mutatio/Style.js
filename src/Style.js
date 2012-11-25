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
	 * Default unit type for measurements
	 * @private
	 * @type {String}
	 */
	var defaultUnit = 'px';

	/**
	 * Valid unit types for measurements
	 * @private
	 * @type {Object.<String, Boolean>}
	 */
	var validUnits = {
		'px': true,
		'em': true,
		'ex': true,
		'pt': true,
		'pc': true,
		'mm': true,
		'cm': true,
		'in': true,
		'%': true
	};

	/**
	 * Push string value to Styles array
	 * @param {Array} styles
	 */
	String.prototype.toStyle = function (styles) {
		styles = styles === undefined ? Styles : styles;

		if (Type.isArray(styles)) {
			styles.push(this);
		}
	};

	/**
	 * Add values from an object to the current object
	 * @returns {Object}
	 */
	Object.prototype.extend = function () {
		var len = arguments.length;

		if (len > 0) {
			for (var i = 0; i < len; ++i) {
				if (Type.isObject(arguments[i])) {
					for (var property in arguments[i]) {
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
	 * @type {String}
	 */
	Color.NAMED = 'Named';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.RED = 'red';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.GREEN = 'green';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.BLUE = 'blue';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.RGB = 'RGB';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.RGBA = 'RGBA';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.RYB = 'RYB';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.HEX = 'Hex';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.HSL = 'HSL';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.HSLA = 'HSLA';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.HSV = 'HSV';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.XYZ = 'XYZ';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.XYY = 'xyY';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.CIELAB = 'CIELab';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.CIELUV = 'CIELuv';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.HUNTERLAB = 'HunterLab';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.CMYK = 'CMYK';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.YIQ = 'YIQ';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.YUV = 'YUV';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.YDBDR = 'YDbDr';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.YCBCR = 'YCbCr';

	/**
	 * @static
	 * @constant
	 * @type {String}
	 */
	Color.YPBPR = 'YPbPr';

	/**
	 * @static
	 * @constant
	 * @type {Object.<String, Boolean>}
	 */
	Color.types = {};

	// Populate Color.types object
	for (var i in Color) {
		if (Color.hasOwnProperty(i) && Type.isString(Color[i]) && Color[i] !== 'Named') {
			Color.types[Color[i]] = true;
		}
	}

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
		all: /(#[a-f0-9]{3,6}|rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)|rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*(\.\d+|\d+(\.\d+)?)\s*\)|hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)|hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\,\s*(\.\d+|\d+(\.\d+)?)\s*\))/gi
	};

	/**
	 * Color array comparators
	 * @static
	 * @constant
	 * @type {Object.<String, Function>}
	 */
	Color.Comparators = {};

	/**
	 * Sort color array by brightness
	 * @static
	 * @param {Object|String} a
	 * @param {Object|String} b
	 * @returns {Number}
	 */
	Color.Comparators.sortByBrightness = function (a, b) {
		a = new RGB(a);
		b = new RGB(b);

		var validA = a && a.isSet();
		var validB = b && b.isSet();

		if (validA) {
			if (validB) {
				a = brightness(a);
				b = brightness(b);

				return a === b ? 0 : (a < b ? 1 : -1);
			}

			return -1;
		}

		return validB ? 1 : 0;
	};

	/**
	 * Sort color array by absolute red value
	 * @static
	 * @param {Object|String} a
	 * @param {Object|String} b
	 * @returns {Number}
	 */
	Color.Comparators.sortByRed = function (a, b) {
		a = new RGB(a);
		b = new RGB(b);

		var validA = a && a.isSet();
		var validB = b && b.isSet();

		if (validA) {
			if (validB) {
				if (a.red === b.red) {
					var totalA = a.green + a.blue;
					var totalB = b.green + b.blue;

					if (totalA === totalB) {
						return 0;
					} else if (totalA < totalB) {
						return -1;
					} else {
						return 1;
					}
				} else {
					return a.red < b.red ? 1 : -1;
				}
			}

			return -1;
		}

		return validB ? 1 : 0;
	};

	/**
	 * Sort color array by absolute green value
	 * @static
	 * @param {Object|String} a
	 * @param {Object|String} b
	 * @returns {Number}
	 */
	Color.Comparators.sortByGreen = function (a, b) {
		a = new RGB(a);
		b = new RGB(b);

		var validA = a && a.isSet();
		var validB = b && b.isSet();

		if (validA) {
			if (validB) {
				if (a.green === b.green) {
					var totalA = a.red + a.blue;
					var totalB = b.red + b.blue;

					if (totalA === totalB) {
						return 0;
					} else if (totalA < totalB) {
						return -1;
					} else {
						return 1;
					}
				} else {
					return a.green < b.green ? 1 : -1;
				}
			}

			return -1;
		}

		return validB ? 1 : 0;
	};

	/**
	 * Sort color array by absolute blue value
	 * @static
	 * @param {Object|String} a
	 * @param {Object|String} b
	 * @returns {Number}
	 */
	Color.Comparators.sortByBlue = function (a, b) {
		a = new RGB(a);
		b = new RGB(b);

		var validA = a && a.isSet();
		var validB = b && b.isSet();

		if (validA) {
			if (validB) {
				if (a.blue === b.blue) {
					var totalA = a.red + a.green;
					var totalB = b.red + b.green;

					if (totalA === totalB) {
						return 0;
					} else if (totalA < totalB) {
						return -1;
					} else {
						return 1;
					}
				} else {
					return a.blue < b.blue ? 1 : -1;
				}
			}

			return -1;
		}

		return validB ? 1 : 0;
	};

	/**
	 * Sort color array by relative red value
	 * @static
	 * @param {Object|String} a
	 * @param {Object|String} b
	 * @returns {Number}
	 */
	Color.Comparators.sortByRedRelative = function (a, b) {
		a = new RGB(a);
		b = new RGB(b);

		var validA = a && a.isSet();
		var validB = b && b.isSet();

		if (validA) {
			if (validB) {
				var totalA = a.red - (a.green + a.blue);
				var totalB = b.red - (b.green + b.blue);

				if (totalA === totalB) {
					if (a.red === b.red) {
						return 0;
					} else {
						return a.red < b.red ? 1 : -1;
					}
				} else {
					return totalA < totalB ? 1 : -1;
				}
			}

			return -1;
		}

		return validB ? 1 : 0;
	};

	/**
	 * Sort color array by relative green value
	 * @static
	 * @param {Object|String} a
	 * @param {Object|String} b
	 * @returns {Number}
	 */
	Color.Comparators.sortByGreenRelative = function (a, b) {
		a = new RGB(a);
		b = new RGB(b);

		var validA = a && a.isSet();
		var validB = b && b.isSet();

		if (validA) {
			if (validB) {
				var totalA = a.green - (a.red + a.blue);
				var totalB = b.green - (b.red + b.blue);

				if (totalA === totalB) {
					if (a.green === b.green) {
						return 0;
					} else {
						return a.green < b.green ? 1 : -1;
					}
				} else {
					return totalA < totalB ? 1 : -1;
				}
			}

			return -1;
		}

		return validB ? 1 : 0;
	};

	/**
	 * Sort color array by relative blue value
	 * @static
	 * @param {Object|String} a
	 * @param {Object|String} b
	 * @returns {Number}
	 */
	Color.Comparators.sortByBlueRelative = function (a, b) {
		a = new RGB(a);
		b = new RGB(b);

		var validA = a && a.isSet();
		var validB = b && b.isSet();

		if (validA) {
			if (validB) {
				var totalA = a.blue - (a.red + a.green);
				var totalB = b.blue - (b.red + b.green);

				if (totalA === totalB) {
					if (a.blue === b.blue) {
						return 0;
					} else {
						return a.blue < b.blue ? 1 : -1;
					}
				} else {
					return totalA < totalB ? 1 : -1;
				}
			}

			return -1;
		}

		return validB ? 1 : 0;
	};

	/**
	 * Common color depths
	 * @static
	 * @constant
	 * @type {Object.<Number, Array>}
	 */
	Color.depth = {
		3: [1, 1, 1],
		6: [2, 2, 2],
		9: [3, 3, 3],
		12: [4, 4, 4],
		15: [5, 5, 5],
		16: [5, 6, 5],
		18: [6, 6, 6],
		21: [7, 7, 7],
		24: [8, 8, 8]
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
	 * @static
	 * @constant
	 * @type {Object.<String, String|Array>}
	 */
	Color.listExtended = {
		'c9ffe5': 'Aero blue',
		'5d8aa8': ['Air Force blue (RAF)', 'Rackley'],
		'00308f': 'Air Force blue (USAF)',
		'72a0c1': 'Air superiority blue',
		'a32638': 'Alabama Crimson',
		'f0f8ff': 'Alice blue',
		'e32636': ['Alizarin crimson', 'Rose madder'],
		'c46210': 'Alloy orange',
		'efdecd': 'Almond',
		'e52b50': 'Amaranth',
		'3b7a57': 'Amazon',
		'ffbf00': ['Amber', 'Fluorescent orange'],
		'ff7e00': 'SAE/ECE Amber',
		'ff033e': 'American rose',
		'9966cc': 'Amethyst',
		'a4c639': 'Android Green',
		'f2f3f4': 'Anti-flash white',
		'cd9575': 'Antique brass',
		'665d1e': 'Antique bronze',
		'915c83': 'Antique fuchsia',
		'841b2d': 'Antique ruby',
		'faebd7': ['Antique white', 'Moccasin'],
		'008000': ['Ao', 'Green', 'Office green'],
		'8db600': 'Apple green',
		'fbceb1': 'Apricot',
		'00ffff': ['Aqua', 'Cyan', 'Electric cyan'],
		'7fffd4': 'Aquamarine',
		'4b5320': 'Army green',
		'3b444b': 'Arsenic',
		'e9d66b': ['Arylide yellow', 'Hansa yellow'],
		'b2beb5': 'Ash grey',
		'87a96b': 'Asparagus',
		'ff9966': ['Atomic tangerine', 'Pink-orange'],
		'a52a2a': ['Auburn', 'Brown', 'Red-brown'],
		'fdee00': 'Aureolin',
		'6e7f80': 'AuroMetalSaurus',
		'568203': 'Avocado',
		'007fff': 'Azure',
		'f0ffff': 'Azure mist/web',
		'89cff0': 'Baby blue',
		'a1caf1': 'Baby blue eyes',
		'f4c2c2': ['Baby pink', 'Tea rose (rose)'],
		'fefefa': 'Baby powder',
		'ff91af': ['Baker-Miller pink', 'Schauss pink'],
		'21abcd': 'Ball Blue',
		'fae7b5': 'Banana Mania',
		'ffe135': 'Banana yellow',
		'7c0a02': 'Barn red',
		'848482': ['Battleship grey', 'Old silver'],
		'98777b': 'Bazaar',
		'bcd4e6': ['Beau blue', 'Pale aqua'],
		'9f8170': 'Beaver',
		'f5f5dc': 'Beige',
		'2e5894': 'B\'dazzled Blue',
		'9c2542': 'Big dip o’ruby',
		'ffe4c4': 'Bisque',
		'3d2b1f': 'Bistre',
		'967117': ['Bistre brown', 'Drab', 'Mode beige', 'Sand dune', 'Sandy taupe'],
		'cae00d': 'Bitter lemon',
		'bfff00': ['Bitter lime', 'Lime'],
		'fe6f5e': 'Bittersweet',
		'bf4f51': 'Bittersweet shimmer',
		'000000': 'Black',
		'3d0c02': 'Black bean',
		'253529': 'Black leather jacket',
		'3b3c36': 'Black olive',
		'ffebcd': 'Blanched Almond',
		'a57164': 'Blast-off bronze',
		'318ce7': 'Bleu de France',
		'ace5ee': 'Blizzard Blue',
		'faf0be': 'Blond',
		'0000ff': 'Blue',
		'1f75fe': 'Blue (Crayola)',
		'0093af': 'Blue (Munsell)',
		'0087bd': 'Blue (NCS)',
		'333399': 'Blue (pigment)',
		'0247fe': 'Blue (RYB)',
		'a2a2d0': 'Blue Bell',
		'6699cc': 'Blue-gray',
		'0d98ba': 'Blue-green',
		'126180': 'Blue sapphire',
		'8a2be2': 'Blue-violet',
		'4f86f7': 'Blueberry',
		'1c1cf0': 'Bluebonnet',
		'de5d83': 'Blush',
		'79443b': ['Bole', 'Medium Tuscan red'],
		'0095b6': 'Bondi blue',
		'e3dac9': 'Bone',
		'cc0000': 'Boston University Red',
		'006a4e': 'Bottle green',
		'873260': 'Boysenberry',
		'0070ff': 'Brandeis blue',
		'b5a642': 'Brass',
		'cb4154': 'Brick red',
		'1dacd6': 'Bright cerulean',
		'66ff00': 'Bright green',
		'bf94e4': 'Bright lavender',
		'c32148': ['Bright maroon', 'Maroon (Crayola)'],
		'ff007f': ['Bright pink', 'Rose'],
		'08e8de': 'Bright turquoise',
		'd19fe8': 'Bright ube',
		'f4bbff': ['Brilliant lavender', 'Electric lavender'],
		'ff55a3': ['Brilliant rose', 'Magenta (Crayola)'],
		'fb607f': 'Brink pink',
		'004225': 'British racing green',
		'cd7f32': 'Bronze',
		'737000': 'Bronze Yellow',
		'964b00': 'Brown (traditional)',
		'6b4423': ['Brown-nose', 'Flattery'],
		'1b4d3e': ['Brunswick green', 'English green'],
		'ffc1cc': 'Bubble gum',
		'e7feff': 'Bubbles',
		'f0dc82': 'Buff',
		'480607': 'Bulgarian rose',
		'800020': 'Burgundy',
		'deb887': 'Burlywood',
		'cc5500': 'Burnt orange',
		'e97451': ['Burnt sienna', 'Light red ochre'],
		'8a3324': 'Burnt umber',
		'bd33a4': 'Byzantine',
		'702963': 'Byzantium',
		'536872': 'Cadet',
		'5f9ea0': 'Cadet blue',
		'91a3b0': 'Cadet grey',
		'006b3c': 'Cadmium green',
		'ed872d': 'Cadmium orange',
		'e30022': 'Cadmium red',
		'fff600': 'Cadmium yellow',
		'a67b5b': ['Café au lait', 'French beige' ,'Tuscan tan'],
		'4b3621': 'Café noir',
		'1e4d2b': 'Cal Poly green',
		'a3c1ad': 'Cambridge Blue',
		'c19a6b': ['Camel', 'Desert', 'Fallow', 'Lion', 'Wood brown'],
		'efbbcc': 'Cameo pink',
		'78866b': 'Camouflage green',
		'ffef00': ['Canary yellow', 'Yellow (process)'],
		'ff0800': 'Candy apple red',
		'e4717a': ['Candy pink', 'Tango pink'],
		'00bfff': ['Capri', 'Deep sky blue'],
		'592720': 'Caput mortuum',
		'c41e3a': 'Cardinal',
		'00cc99': 'Caribbean green',
		'960018': 'Carmine',
		'd70040': ['Carmine (M&P)', 'Rich carmine'],
		'eb4c42': 'Carmine pink',
		'ff0038': 'Carmine red',
		'ffa6c9': 'Carnation pink',
		'b31b1b': ['Carnelian', 'Cornell Red'],
		'99badd': 'Carolina blue',
		'ed9121': 'Carrot orange',
		'00563f': ['Castleton green', 'Sacramento State green'],
		'062a78': 'Catalina blue',
		'c95a49': 'Cedar Chest',
		'92a1cf': 'Ceil',
		'ace1af': 'Celadon',
		'007ba7': ['Celadon Blue', 'Cerulean'],
		'2f847c': 'Celadon Green',
		'b2ffff': ['Celeste', 'Italian sky blue'],
		'4997d0': 'Celestial blue',
		'de3163': ['Cerise', 'Cherry'],
		'ec3b83': 'Cerise pink',
		'2a52be': 'Cerulean blue',
		'6d9bc3': 'Cerulean frost',
		'007aa5': 'CG Blue',
		'e03c31': 'CG Red',
		'a0785a': 'Chamoisee',
		'f7e7ce': 'Champagne',
		'36454f': 'Charcoal',
		'232b2b': 'Charleston green',
		'e68fac': ['Charm pink', 'Light Thulian pink'],
		'dfff00': 'Chartreuse (traditional)',
		'7fff00': 'Chartreuse',
		'ffb7c5': 'Cherry blossom pink',
		'954535': 'Chestnut',
		'de6fa1': ['China pink', 'Thulian pink'],
		'a8516e': 'China rose',
		'aa381e': 'Chinese red',
		'7b3f00': 'Chocolate (traditional)',
		'd2691e': ['Chocolate', 'Cinnamon', 'Cocoa brown'],
		'ffa700': 'Chrome yellow',
		'98817b': 'Cinereous',
		'e34234': ['Cinnabar', 'Vermilion (cinnabar)'],
		'e4d00a': 'Citrine',
		'9fa91f': 'Citron',
		'7f1734': 'Claret',
		'fbcce7': 'Classic rose',
		'0047ab': 'Cobalt',
		'965a3e': 'Coconut',
		'6f4e37': ['Coffee', 'Tuscan brown'],
		'9bddff': 'Columbia blue',
		'f88379': ['Congo pink', 'Coral pink', 'Tea rose (orange)'],
		'002e63': 'Cool black',
		'8c92ac': ['Cool grey', 'Gray-blue'],
		'b87333': 'Copper',
		'da8a67': ['Copper (Crayola)', 'Pale copper'],
		'ad6f69': 'Copper penny',
		'cb6d51': 'Copper red',
		'996666': 'Copper rose',
		'ff3800': 'Coquelicot',
		'ff7f50': 'Coral',
		'ff4040': 'Coral red',
		'893f45': 'Cordovan',
		'fbec5d': ['Corn', 'Maize'],
		'6495ed': 'Cornflower blue',
		'fff8dc': 'Cornsilk',
		'fff8e7': 'Cosmic latte',
		'ffbcd9': 'Cotton candy',
		'fffdd0': 'Cream',
		'dc143c': 'Crimson',
		'be0032': 'Crimson glory',
		'00b7eb': 'Cyan (process)',
		'58427c': 'Cyber Grape',
		'ffff31': 'Daffodil',
		'f0e130': 'Dandelion',
		'00008b': 'Dark blue',
		'666699': 'Dark blue-gray',
		'654321': ['Dark brown', 'Otter brown'],
		'5d3954': 'Dark byzantium',
		'a40000': 'Dark candy apple red',
		'08457e': 'Dark cerulean',
		'986960': 'Dark chestnut',
		'cd5b45': 'Dark coral',
		'008b8b': 'Dark cyan',
		'536878': ['Dark electric blue', 'Payne\'s grey'],
		'b8860b': 'Dark goldenrod',
		'a9a9a9': 'Dark gray',
		'013220': 'Dark green',
		'00416a': ['Dark imperial blue', 'Indigo (dye)'],
		'1a2421': 'Dark jungle green',
		'bdb76b': 'Dark khaki',
		'483c32': ['Dark lava', 'Dark taupe', 'Taupe'],
		'734f96': 'Dark lavender',
		'8b008b': 'Dark magenta',
		'003366': 'Dark midnight blue',
		'556b2f': 'Dark olive green',
		'ff8c00': 'Dark orange',
		'9932cc': 'Dark orchid',
		'779ecb': 'Dark pastel blue',
		'03c03c': 'Dark pastel green',
		'966fd6': 'Dark pastel purple',
		'c23b22': 'Dark pastel red',
		'e75480': 'Dark pink',
		'003399': ['Dark powder blue', 'Smalt (Dark powder blue)'],
		'872657': 'Dark raspberry',
		'8b0000': 'Dark red',
		'e9967a': 'Dark salmon',
		'560319': 'Dark scarlet',
		'8fbc8f': 'Dark sea green',
		'3c1414': 'Dark sienna',
		'8cbed6': 'Dark sky blue',
		'483d8b': 'Dark slate blue',
		'2f4f4f': 'Dark slate gray',
		'177245': 'Dark spring green',
		'918151': 'Dark tan',
		'ffa812': 'Dark tangerine',
		'cc4e5c': 'Dark terra cotta',
		'00ced1': 'Dark turquoise',
		'd1bea8': 'Dark vanilla',
		'9400d3': 'Dark violet',
		'9b870c': 'Dark yellow',
		'00703c': 'Dartmouth green',
		'555555': 'Davy\'s grey',
		'd70a53': 'Debian red',
		'a9203e': 'Deep carmine',
		'ef3038': 'Deep carmine pink',
		'e9692c': 'Deep carrot orange',
		'da3287': 'Deep cerise',
		'fad6a5': ['Deep champagne', 'Sunset', 'Tuscan'],
		'b94e48': 'Deep chestnut',
		'704241': 'Deep coffee',
		'c154c1': ['Deep fuchsia', 'Fuchsia (Crayola)'],
		'004b49': 'Deep jungle green',
		'f5c71a': 'Deep lemon',
		'9955bb': 'Deep lilac',
		'cc00cc': 'Deep magenta',
		'd473d4': ['Deep mauve', 'French mauve'],
		'ffcba4': ['Deep peach', 'Peach (Crayola)'],
		'ff1493': ['Deep pink', 'Fluorescent pink'],
		'843f5b': 'Deep ruby',
		'ff9933': 'Deep saffron',
		'4a646c': 'Deep Space Sparkle',
		'7e5e60': 'Deep Taupe',
		'66424d': 'Deep Tuscan red',
		'ba8759': 'Deer',
		'1560bd': 'Denim',
		'edc9af': 'Desert sand',
		'7d1242': 'Diamond',
		'696969': 'Dim gray',
		'9b7653': 'Dirt',
		'1e90ff': 'Dodger blue',
		'd71868': 'Dogwood rose',
		'85bb65': 'Dollar bill',
		'00009c': 'Duke blue',
		'e5ccc9': 'Dust storm',
		'e1a95f': 'Earth yellow',
		'555d50': 'Ebony',
		'c2b280': ['Ecru', 'Sand'],
		'614051': 'Eggplant',
		'f0ead6': 'Eggshell',
		'1034a6': 'Egyptian blue',
		'7df9ff': 'Electric blue',
		'ff003f': 'Electric crimson',
		'00ff00': ['Electric green', 'Green (X11 green)', 'Lime (X11 green)'],
		'6f00ff': ['Electric indigo', 'Indigo'],
		'ccff00': ['Electric lime', 'Fluorescent yellow'],
		'bf00ff': 'Electric purple',
		'3f00ff': 'Electric ultramarine',
		'8f00ff': ['Electric violet', 'Violet'],
		'ffff33': 'Electric yellow',
		'50c878': ['Emerald', 'Paris Green'],
		'b48395': 'English lavender',
		'ab4b52': 'English red',
		'96c8a2': 'Eton blue',
		'44d7a8': 'Eucalyptus',
		'801818': 'Falu red',
		'b53389': 'Fandango',
		'de5285': 'Fandango pink',
		'f400a1': ['Fashion fuchsia', 'Hollywood cerise'],
		'e5aa70': 'Fawn',
		'4d5d53': 'Feldgrau',
		'fdd5b1': ['Feldspar', 'Light apricot'],
		'4f7942': 'Fern green',
		'ff2800': 'Ferrari Red',
		'6c541e': 'Field drab',
		'b22222': 'Firebrick',
		'ce2029': 'Fire engine red',
		'e25822': 'Flame',
		'fc8eac': 'Flamingo pink',
		'f7e98e': 'Flavescent',
		'eedc82': 'Flax',
		'fffaf0': 'Floral white',
		'ff004f': 'Folly',
		'014421': ['Forest green (traditional)', 'UP Forest green'],
		'228b22': 'Forest green',
		'856d4d': 'French bistre',
		'0072bb': 'French blue',
		'86608e': ['French lilac', 'Pomp and Power'],
		'9efd38': 'French lime',
		'c72c48': 'French raspberry',
		'f64a8a': 'French rose',
		'77b5fe': 'French sky blue',
		'ac1e44': 'French wine',
		'a6e7ff': 'Fresh Air',
		'ff00ff': ['Fuchsia', 'Magenta'],
		'ff77ff': 'Fuchsia pink',
		'c74375': 'Fuchsia rose',
		'e48400': 'Fulvous',
		'cc6666': 'Fuzzy Wuzzy',
		'dcdcdc': 'Gainsboro',
		'e49b0f': 'Gamboge',
		'f8f8ff': 'Ghost white',
		'fe5a1d': 'Giants orange',
		'b06500': 'Ginger',
		'6082b6': 'Glaucous',
		'e6e8fa': 'Glitter',
		'00ab66': 'GO green',
		'd4af37': 'Gold (metallic)',
		'ffd700': 'Gold (Golden)',
		'85754e': 'Gold Fusion',
		'996515': 'Golden brown',
		'fcc200': 'Golden poppy',
		'ffdf00': 'Golden yellow',
		'daa520': 'Goldenrod',
		'a8e4a0': 'Granny Smith Apple',
		'6f2da8': 'Grape',
		'808080': ['Gray', 'Gray', 'Trolley Grey'],
		'bebebe': 'Gray (X11 gray)',
		'465945': 'Gray-asparagus',
		'1cac78': 'Green (Crayola)',
		'00a877': 'Green (Munsell)',
		'009f6b': 'Green (NCS)',
		'00a550': 'Green (pigment)',
		'66b032': 'Green (RYB)',
		'adff2f': 'Green-yellow',
		'a99a86': 'Grullo',
		'00ff7f': ['Guppie green', 'Spring green'],
		'663854': 'Halayà úbe',
		'446ccf': 'Han blue',
		'5218fa': 'Han purple',
		'3fff00': 'Harlequin',
		'c90016': 'Harvard crimson',
		'da9100': 'Harvest Gold',
		'808000': ['Heart Gold', 'Olive'],
		'df73ff': 'Heliotrope',
		'f0fff0': 'Honeydew',
		'006db0': 'Honolulu blue',
		'49796b': 'Hooker\'s green',
		'ff1dce': 'Hot magenta',
		'ff69b4': 'Hot pink',
		'355e3b': 'Hunter green',
		'71a6d2': 'Iceberg',
		'fcf75e': 'Icterine',
		'319177': 'Illuminating Emerald',
		'602f6b': 'Imperial',
		'002395': 'Imperial blue',
		'b2ec5d': 'Inchworm',
		'138808': 'India green',
		'cd5c5c': 'Indian red',
		'e3a857': 'Indian yellow',
		'4b0082': 'Indigo',
		'002fa7': 'International Klein Blue',
		'ff4f00': 'International orange (aerospace)',
		'ba160c': 'International orange (engineering)',
		'c0362c': 'International orange (Golden Gate Bridge)',
		'5a4fcf': 'Iris',
		'b3446c': ['Irresistible', 'Raspberry rose'],
		'f4f0ec': 'Isabelline',
		'009000': 'Islamic green',
		'fffff0': 'Ivory',
		'00a86b': 'Jade',
		'f8de7e': ['Jasmine', 'Mellow yellow'],
		'd73b3e': 'Jasper',
		'a50b5e': 'Jazzberry jam',
		'da614e': 'Jelly Bean',
		'343434': 'Jet',
		'f4ca16': 'Jonquil',
		'bdda57': 'June bud',
		'29ab87': 'Jungle green',
		'4cbb17': 'Kelly green',
		'7c1c05': 'Kenyan copper',
		'c3b091': 'Khaki',
		'f0e68c': ['Khaki (X11) (Light khaki)', 'Light khaki'],
		'882d17': ['Kobe', 'Sienna'],
		'e79fc4': 'Kobi',
		'e8000d': 'KU Crimson',
		'087830': 'La Salle Green',
		'd6cadd': 'Languid lavender',
		'26619c': 'Lapis lazuli',
		'ffff66': ['Laser Lemon', 'Unmellow Yellow'],
		'a9ba9d': 'Laurel green',
		'cf1020': 'Lava',
		'b57edc': 'Lavender (floral)',
		'e6e6fa': ['Lavender', 'Lavender mist'],
		'ccccff': ['Lavender blue', 'Periwinkle'],
		'fff0f5': 'Lavender blush',
		'c4c3d0': 'Lavender gray',
		'9457eb': ['Lavender indigo', 'Navy purple'],
		'ee82ee': ['Lavender magenta', 'Violet'],
		'fbaed2': 'Lavender pink',
		'967bb6': 'Lavender purple',
		'fba0e3': 'Lavender rose',
		'7cfc00': 'Lawn green',
		'fff700': 'Lemon',
		'fffacd': 'Lemon chiffon',
		'cca01d': 'Lemon curry',
		'e3ff00': 'Lemon lime',
		'f6eabe': 'Lemon meringue',
		'fff44f': 'Lemon yellow',
		'1a1110': 'Licorice',
		'add8e6': 'Light blue',
		'b5651d': 'Light brown',
		'e66771': 'Light carmine pink',
		'f08080': 'Light coral',
		'93ccea': 'Light cornflower blue',
		'f56991': 'Light crimson',
		'e0ffff': 'Light cyan',
		'f984ef': 'Light fuchsia pink',
		'fafad2': 'Light goldenrod yellow',
		'd3d3d3': 'Light gray',
		'90ee90': 'Light green',
		'd39bcb': 'Light medium orchid',
		'e6a8d7': 'Light orchid',
		'b19cd9': 'Light pastel purple',
		'ffb6c1': 'Light pink',
		'ffa07a': 'Light salmon',
		'ff9999': 'Light salmon pink',
		'20b2aa': 'Light sea green',
		'87cefa': 'Light sky blue',
		'778899': 'Light slate gray',
		'b0c4de': 'Light steel blue',
		'b38b6d': 'Light taupe',
		'ffffe0': 'Light yellow',
		'c8a2c8': 'Lilac',
		'32cd32': 'Lime green',
		'9dc209': 'Limerick',
		'195905': 'Lincoln green',
		'faf0e6': 'Linen',
		'6ca0dc': 'Little boy blue',
		'534b4f': 'Liver',
		'ffe4cd': 'Lumber',
		'e62020': 'Lust',
		'ca1f7b': 'Magenta (dye)',
		'd0417e': 'Magenta (Pantone)',
		'ff0090': 'Magenta (process)',
		'aaf0d1': 'Magic mint',
		'f8f4ff': 'Magnolia',
		'c04000': 'Mahogany',
		'6050dc': 'Majorelle Blue',
		'0bda51': 'Malachite',
		'979aaa': 'Manatee',
		'ff8243': 'Mango Tango',
		'74c365': 'Mantis',
		'880085': 'Mardi Gras',
		'800000': 'Maroon',
		'b03060': ['Maroon (X11)', 'Rich maroon'],
		'e0b0ff': 'Mauve',
		'915f6d': ['Mauve taupe', 'Raspberry glace'],
		'ef98aa': 'Mauvelous',
		'73c2fb': 'Maya blue',
		'e5b73b': 'Meat brown',
		'66ddaa': 'Medium aquamarine',
		'0000cd': 'Medium blue',
		'e2062c': 'Medium candy apple red',
		'af4035': ['Medium carmine', 'Pale carmine'],
		'f3e5ab': ['Medium champagne', 'Vanilla'],
		'035096': 'Medium electric blue',
		'1c352d': 'Medium jungle green',
		'dda0dd': ['Medium lavender magenta', 'Pale plum', 'Plum'],
		'ba55d3': 'Medium orchid',
		'0067a5': ['Medium Persian blue', 'Sapphire blue'],
		'9370db': 'Medium purple',
		'bb3385': 'Medium red-violet',
		'aa4069': 'Medium ruby',
		'3cb371': 'Medium sea green',
		'80daeb': 'Medium sky blue',
		'7b68ee': 'Medium slate blue',
		'c9dc87': 'Medium spring bud',
		'00fa9a': 'Medium spring green',
		'674c47': 'Medium taupe',
		'48d1cc': 'Medium turquoise',
		'd9603b': ['Medium vermilion', 'Vermilion (Plochere)'],
		'c71585': ['Medium violet-red', 'Red-violet'],
		'f8b878': 'Mellow apricot',
		'fdbcb4': 'Melon',
		'0a7e8c': 'Metallic Seaweed',
		'9c7c38': 'Metallic Sunburst',
		'e4007c': 'Mexican pink',
		'191970': 'Midnight blue',
		'004953': 'Midnight green (eagle green)',
		'e3f988': 'Midori',
		'ffc40c': 'Mikado yellow',
		'3eb489': 'Mint',
		'f5fffa': 'Mint cream',
		'98ff98': 'Mint green',
		'ffe4e1': 'Misty rose',
		'73a9c2': 'Moonstone blue',
		'ae0c00': 'Mordant red 19',
		'addfad': 'Moss green',
		'30ba8f': 'Mountain Meadow',
		'997a8d': 'Mountbatten pink',
		'18453b': 'MSU Green',
		'c54b8c': 'Mulberry',
		'ffdb58': 'Mustard',
		'21421e': 'Myrtle',
		'f6adc6': 'Nadeshiko pink',
		'2a8000': 'Napier green',
		'fada5e': ['Naples yellow', 'Royal yellow', 'Stil de grain yellow'],
		'ffdead': 'Navajo white',
		'000080': 'Navy blue',
		'ffa343': 'Neon Carrot',
		'fe4164': 'Neon fuchsia',
		'39ff14': 'Neon green',
		'214fc6': 'New Car',
		'd7837f': 'New York pink',
		'a4dded': 'Non-photo blue',
		'059033': 'North Texas Green',
		'e9ffdb': 'Nyanza',
		'0077be': 'Ocean Boat Blue',
		'cc7722': 'Ochre',
		'43302e': 'Old burgundy',
		'cfb53b': 'Old gold',
		'fdf5e6': 'Old lace',
		'796878': 'Old lavender',
		'673147': ['Old mauve', 'Wine dregs'],
		'c08081': 'Old rose',
		'6b8e23': 'Olive Drab #3',
		'3c341f': 'Olive Drab #7',
		'9ab973': 'Olivine',
		'353839': 'Onyx',
		'b784a7': 'Opera mauve',
		'ff7f00': 'Orange',
		'fb9902': 'Orange (RYB)',
		'ffa500': 'Orange (web color)',
		'ff9f00': 'Orange peel',
		'ff4500': 'Orange-red',
		'da70d6': 'Orchid',
		'f28dcd': 'Orchid pink',
		'fb4f14': 'Orioles orange',
		'414a4c': 'Outer Space',
		'ff6e4a': 'Outrageous Orange',
		'002147': 'Oxford Blue',
		'990000': ['OU Crimson Red', 'Stizza', 'USC Cardinal'],
		'006600': 'Pakistan green',
		'273be2': 'Palatinate blue',
		'682860': 'Palatinate purple',
		'afeeee': ['Pale blue', 'Pale turquoise'],
		'987654': 'Pale brown',
		'9bc4e2': 'Pale cerulean',
		'ddadaf': 'Pale chestnut',
		'abcdef': 'Pale cornflower blue',
		'e6be8a': 'Pale gold',
		'eee8aa': 'Pale goldenrod',
		'98fb98': 'Pale green',
		'dcd0ff': 'Pale lavender',
		'f984e5': 'Pale magenta',
		'fadadd': 'Pale pink',
		'db7093': ['Pale red-violet', 'Pale violet-red'],
		'96ded1': 'Pale robin egg blue',
		'c9c0bb': 'Pale silver',
		'ecebbd': 'Pale spring bud',
		'bc987e': 'Pale taupe',
		'78184a': 'Pansy purple',
		'ffefd5': 'Papaya whip',
		'aec6cf': 'Pastel blue',
		'836953': 'Pastel brown',
		'cfcfc4': 'Pastel gray',
		'77dd77': 'Pastel green',
		'f49ac2': 'Pastel magenta',
		'ffb347': 'Pastel orange',
		'dea5a4': 'Pastel pink',
		'b39eb5': 'Pastel purple',
		'ff6961': 'Pastel red',
		'cb99c9': 'Pastel violet',
		'fdfd96': 'Pastel yellow',
		'800080': ['Patriarch', 'Purple'],
		'ffe5b4': 'Peach',
		'ffcc99': 'Peach-orange',
		'ffdab9': 'Peach puff',
		'fadfad': 'Peach-yellow',
		'd1e231': 'Pear',
		'eae0c8': 'Pearl',
		'88d8c0': 'Pearl Aqua',
		'b768a2': 'Pearly purple',
		'e6e200': 'Peridot',
		'1c39bb': 'Persian blue',
		'00a693': 'Persian green',
		'32127a': 'Persian indigo',
		'd99058': 'Persian orange',
		'f77fbe': 'Persian pink',
		'701c1c': ['Persian plum', 'Prune'],
		'cc3333': 'Persian red',
		'fe28a2': 'Persian rose',
		'ec5800': 'Persimmon',
		'cd853f': 'Peru',
		'df00ff': ['Phlox', 'Psychedelic purple'],
		'000f89': 'Phthalo blue',
		'123524': 'Phthalo green',
		'c30b4e': 'Pictorial carmine',
		'fddde6': 'Piggy pink',
		'01796f': 'Pine green',
		'ffc0cb': 'Pink',
		'ffddf4': 'Pink lace',
		'e7accf': 'Pink pearl',
		'f78fa7': 'Pink Sherbet',
		'93c572': 'Pistachio',
		'e5e4e2': 'Platinum',
		'8e4585': 'Plum (traditional)',
		'ff5a36': 'Portland Orange',
		'b0e0e6': 'Powder blue',
		'ff8f00': 'Princeton orange',
		'003153': 'Prussian blue',
		'cc8899': 'Puce',
		'ff7518': 'Pumpkin',
		'9f00c5': 'Purple (Munsell)',
		'a020f0': ['Purple (X11)', 'Veronica'],
		'69359c': 'Purple Heart',
		'9678b6': 'Purple mountain majesty',
		'fe4eda': 'Purple pizzazz',
		'50404d': 'Purple taupe',
		'51484f': 'Quartz',
		'436b95': 'Queen blue',
		'e8ccd7': 'Queen pink',
		'ff355e': 'Radical Red',
		'fbab60': 'Rajah',
		'e30b5d': 'Raspberry',
		'e25098': 'Raspberry pink',
		'826644': 'Raw umber',
		'ff33cc': 'Razzle dazzle rose',
		'e3256b': 'Razzmatazz',
		'8d4e85': 'Razzmic Berry',
		'ff0000': 'Red',
		'f2003c': 'Red (Munsell)',
		'c40233': 'Red (NCS)',
		'ed1c24': 'Red (pigment)',
		'fe2712': 'Red (RYB)',
		'860111': 'Red devil',
		'ff5349': 'Red-orange',
		'ab4e52': ['Redwood', 'Rose vale'],
		'522d80': 'Regalia',
		'002387': 'Resolution blue',
		'777696': 'Rhythm',
		'004040': 'Rich black',
		'f1a7fe': 'Rich brilliant lavender',
		'0892d0': 'Rich electric blue',
		'a76bcf': 'Rich lavender',
		'b666d2': 'Rich lilac',
		'414833': 'Rifle green',
		'00cccc': 'Robin egg blue',
		'8a7f80': 'Rocket metallic',
		'838996': 'Roman silver',
		'f9429e': 'Rose bonbon',
		'674846': 'Rose ebony',
		'b76e79': 'Rose gold',
		'ff66cc': 'Rose pink',
		'aa98a9': 'Rose quartz',
		'905d5d': 'Rose taupe',
		'65000b': 'Rosewood',
		'd40000': 'Rosso corsa',
		'bc8f8f': 'Rosy brown',
		'0038a8': 'Royal azure',
		'002366': 'Royal blue (traditional)',
		'4169e1': 'Royal blue',
		'ca2c92': 'Royal fuchsia',
		'7851a9': 'Royal purple',
		'ce4676': 'Ruber',
		'd10056': 'Rubine red',
		'e0115f': 'Ruby',
		'9b111e': 'Ruby red',
		'ff0028': 'Ruddy',
		'bb6528': 'Ruddy brown',
		'e18e96': 'Ruddy pink',
		'a81c07': 'Rufous',
		'80461b': 'Russet',
		'b7410e': 'Rust',
		'da2c43': 'Rusty red',
		'8b4513': 'Saddle brown',
		'ff6700': 'Safety orange (blaze orange)',
		'f4c430': 'Saffron',
		'23297a': 'St. Patrick\'s blue',
		'ff8c69': 'Salmon',
		'ff91a4': 'Salmon pink',
		'ecd540': 'Sandstorm',
		'f4a460': 'Sandy brown',
		'92000a': 'Sangria',
		'507d2a': 'Sap green',
		'0f52ba': 'Sapphire',
		'cba135': 'Satin sheen gold',
		'ff2400': 'Scarlet',
		'fd0e35': ['Scarlet (Crayola)', 'Tractor red'],
		'ffd800': 'School bus yellow',
		'76ff7a': 'Screamin\' Green',
		'006994': 'Sea blue',
		'2e8b57': 'Sea green',
		'321414': 'Seal brown',
		'fff5ee': 'Seashell',
		'ffba00': 'Selective yellow',
		'704214': 'Sepia',
		'8a795d': 'Shadow',
		'ffcff1': 'Shampoo',
		'009e60': 'Shamrock green',
		'8fd400': 'Sheen Green',
		'd98695': 'Shimmering Blush',
		'fc0fc0': 'Shocking pink',
		'ff6fff': ['Shocking pink (Crayola)', 'Ultra pink'],
		'c0c0c0': 'Silver',
		'acacac': 'Silver chalice',
		'c4aead': 'Silver pink',
		'bfc1c2': 'Silver sand',
		'cb410b': 'Sinopia',
		'007474': 'Skobeloff',
		'87ceeb': 'Sky blue',
		'cf71af': 'Sky magenta',
		'6a5acd': 'Slate blue',
		'708090': 'Slate gray',
		'c84186': 'Smitten',
		'738276': 'Smoke',
		'933d41': 'Smokey topaz',
		'100c08': 'Smoky black',
		'fffafa': 'Snow',
		'cec8ef': 'Soap',
		'757575': 'Sonic silver',
		'1d2951': 'Space cadet',
		'80755a': 'Spanish bistre',
		'd10047': 'Spanish carmine',
		'e51a4c': 'Spanish crimson',
		'e86100': 'Spanish orange',
		'00aae4': 'Spanish sky blue',
		'0fc0fc': 'Spiro Disco Ball',
		'a7fc00': 'Spring bud',
		'007bbb': 'Star command blue',
		'4682b4': 'Steel blue',
		'cc3366': 'Steel pink',
		'4f666a': 'Stormcloud',
		'e4d96f': 'Straw',
		'fc5a8d': 'Strawberry',
		'ffcc33': 'Sunglow',
		'cf6ba9': 'Super pink',
		'd2b48c': 'Tan',
		'f94d00': 'Tangelo',
		'f28500': 'Tangerine',
		'ffcc00': ['Tangerine yellow', 'USC Gold'],
		'8b8589': 'Taupe gray',
		'd0f0c0': 'Tea green',
		'008080': 'Teal',
		'367588': 'Teal blue',
		'99e6b3': 'Teal deer',
		'00827f': 'Teal green',
		'cf3476': 'Telemagenta',
		'cd5700': 'Tenné (Tawny)',
		'e2725b': 'Terra cotta',
		'd8bfd8': 'Thistle',
		'fc89ac': 'Tickle Me Pink',
		'0abab5': 'Tiffany Blue',
		'e08d3c': 'Tiger\'s eye',
		'dbd7d2': 'Timberwolf',
		'eee600': 'Titanium yellow',
		'ff6347': 'Tomato',
		'746cc0': 'Toolbox',
		'ffc87c': 'Topaz',
		'00755e': 'Tropical rain forest',
		'0073cf': 'True Blue',
		'417dc1': 'Tufts Blue',
		'ff878d': 'Tulip',
		'deaa88': 'Tumbleweed',
		'b57281': 'Turkish rose',
		'30d5c8': 'Turquoise',
		'00ffef': 'Turquoise blue',
		'a0d6b4': 'Turquoise green',
		'7c4848': 'Tuscan red',
		'c09999': 'Tuscany',
		'8a496b': 'Twilight lavender',
		'66023c': 'Tyrian purple',
		'0033aa': 'UA blue',
		'd9004c': 'UA red',
		'8878c3': 'Ube',
		'536895': 'UCLA Blue',
		'ffb300': 'UCLA Gold',
		'3cd070': 'UFO Green',
		'120a8f': 'Ultramarine',
		'4166f5': 'Ultramarine blue',
		'635147': 'Umber',
		'ffddca': 'Unbleached silk',
		'5b92e5': 'United Nations blue',
		'b78727': 'University of California Gold',
		'7b1113': 'UP Maroon',
		'ae2029': 'Upsdell red',
		'e1ad21': 'Urobilin',
		'004f98': 'USAFA blue',
		'f77f00': 'University of Tennessee Orange',
		'd3003f': 'Utah Crimson',
		'f3d9df': 'Vanilla ice',
		'c5b358': 'Vegas gold',
		'c80815': 'Venetian red',
		'43b3ae': 'Verdigris',
		'7f00ff': 'Violet',
		'8601af': 'Violet (RYB)',
		'324ab2': 'Violet-blue',
		'f75394': 'Violet-red',
		'40826d': 'Viridian',
		'922724': 'Vivid auburn',
		'9f1d35': 'Vivid burgundy',
		'da1d81': 'Vivid cerise',
		'cc00ff': 'Vivid orchid',
		'00ccff': 'Vivid sky blue',
		'ffa089': 'Vivid tangerine',
		'9f00ff': 'Vivid violet',
		'004242': 'Warm black',
		'a4f4f9': 'Waterspout',
		'645452': 'Wenge',
		'f5deb3': 'Wheat',
		'ffffff': 'White',
		'f5f5f5': 'White smoke',
		'a2add0': 'Wild blue yonder',
		'd77a02': 'Wild orchid',
		'ff43a4': 'Wild Strawberry',
		'fc6c85': 'Wild Watermelon',
		'ae6838': 'Windsor tan',
		'722f37': 'Wine',
		'c9a0dc': 'Wisteria',
		'738678': 'Xanadu',
		'0f4d92': 'Yale Blue',
		'1c2841': 'Yankees blue',
		'ffff00': 'Yellow',
		'efcc00': 'Yellow (Munsell)',
		'ffd300': 'Yellow (NCS)',
		'fefe33': 'Yellow (RYB)',
		'9acd32': 'Yellow-green',
		'ffae42': 'Yellow Orange',
		'fff000': 'Yellow rose',
		'0014a8': 'Zaffre',
		'2c1608': 'Zinnwaldite brown'
	};

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
				if (!Util.empty(this.listNamed[color.toLowerCase()])) {
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
				// Long in the tooth, but "instanceof" is very quick vs. Type.getType()
				if (color instanceof RGB) {
					return this.RGB;
				} else if (color instanceof RGBA) {
					return this.RGBA;
				} else if (color instanceof RYB) {
					return this.RYB;
				} else if (color instanceof Hex) {
					return this.HEX;
				} else if (color instanceof HSL) {
					return this.HSL;
				} else if (color instanceof HSLA) {
					return this.HSLA;
				} else if (color instanceof HSV) {
					return this.HSV;
				} else if (color instanceof XYZ) {
					return this.XYZ;
				} else if (color instanceof xyY) {
					return this.XYY;
				} else if (color instanceof CIELab) {
					return this.CIELAB;
				} else if (color instanceof CIELuv) {
					return this.CIELUV;
				} else if (color instanceof HunterLab) {
					return this.HUNTERLAB;
				} else if (color instanceof CMYK) {
					return this.CMYK;
				} else if (color instanceof YIQ) {
					return this.YIQ;
				} else if (color instanceof YUV) {
					return this.YUV;
				} else if (color instanceof YDbDr) {
					return this.YDBDR;
				} else if (color instanceof YCbCr) {
					return this.YCBCR;
				} else if (color instanceof YPbPr) {
					return this.YPBPR;
				}
			}
		}

		return undefined;
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
				case this.NAMED:
					color = color.toLowerCase().substr(1);

					return !Util.empty(this.list[color]) ? this.list[color] : undefined;

				case this.HEX:
				case this.RGB:
				case this.RGBA:
				case this.RYB:
				case this.HSL:
				case this.HSLA:
				case this.HSV:
				case this.XYZ:
				case this.XYY:
				case this.CIELAB:
				case this.CIELUV:
				case this.HUNTERLAB:
				case this.YIQ:
				case this.YUV:
				case this.YDBDR:
				case this.YCBCR:
				case this.YPBPR:
					return toColorSpace(color, type);
			}
		}

		return null;
	};

	/**
	 * Checks if color passed is valid color
	 * @static
	 * @param {Object|String} color
	 * @returns {Boolean}
	 */
	Color.isValid = function (color) {
		return color && this.getType(color) ? true : false;
	};

	/**
	 * Checks if color passed is valid CSS color
	 * @static
	 * @param {Object|String} color
	 * @returns {Boolean}
	 */
	Color.isValidCSS = function (color) {
		if (color) {
			color = this.getType(color);

			if (color) {
				return CSS.colorTypes.hasOwnProperty(color);
			}
		}

		return false;
	};

	/**
	 * Checks if type passed is valid color type
	 * @static
	 * @param {String} type
	 * @returns {Boolean}
	 */
	Color.isValidType = function (type) {
		return type ? this.types.hasOwnProperty(type) : false;
	};

	/**
	 * Checks if type passed is valid CSS color type
	 * @static
	 * @param {String} type
	 * @returns {Boolean}
	 */
	Color.isValidCSSType = function (type) {
		return type ? CSS.colorTypes.hasOwnProperty(type) : false;
	};

	/**
	 * Checks if the color is grayscale
	 * @static
	 * @param {Object} color
	 * @returns {Boolean|Null} Null if invalid color
	 */
	Color.isGrayscale = function (color) {
		if (color) {
			color = new RGB(color);

			if (color && color.isSet()) {
				return color.red === color.green && color.red === color.blue;
			}
		}

		return null;
	};

	/**
	 * "Compile" Styles to CSS
	 * @param {Array} styles Style array
	 * @returns {String}
	 */
	function toCSS(styles) {
		styles = styles === undefined ? Styles : styles;

		if (Type.isArray(styles)) {
			var len = styles.length;

			if (len > 0) {
				var CSS = branding ? '/**\n * Generated by Style.js ' + Style.getVersion() + ', ' + new Date() + '\n */\n' : '';

				for (var i = 0; i < len; ++i) {
					CSS += styles[i] + '\n\n';
				}

				return CSS.slice(0, -2);
			}
		}

		return '';
	}

	$.toCSS = toCSS;

	/**
	 * Style class / wrapper, populates Styles array
	 * @constructor
	 * @param {Object|String} style Style object / string
	 * @param {Array} styles Array to bind style to (non-global)
	 */
	function Style(style, styles) {
		if (!Util.empty(style)) {
			this.self = style;

			if (styles === undefined) {
				Styles.push(this);
			} else if (Type.isArray(styles)) {
				styles.push(this);
			}
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
	 * Clear the Styles array
	 * @static
	 */
	Style.clear = function () {
		Styles = [];
	};

	/**
	 * Disable Style.js branding
	 * @static
	 */
	Style.disableBranding = function () {
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
				if ((type = Type.getType(obj[x])) !== 'function') {
					if (!output[parent]) {
						output[parent] = [];
					}

					if (type === 'string' || Color.isValidCSSType(type)) {
						output[parent].push(x.replace(/\_/g, '-') + ": " + obj[x]);
					} else if (type === 'number') {
						output[parent].push(x.replace(/\_/g, '-') + ": " + obj[x] + (obj[x] !== 0 ? defaultUnit : ''));
					} else if (type === 'array') {
						for (var y in obj[x]) {
							if ((type = Type.getType(obj[x][y])) !== 'function') {
								if (type === 'string' || Color.isValidCSSType(type)) {
									output[parent].push(x.replace(/\_/g, '-') + ": " + obj[x][y]);
								} else if (type === 'number') {
									output[parent].push(x.replace(/\_/g, '-') + ": " + obj[x][y] + (obj[x][y] !== 0 ? defaultUnit : ''));
								}
							}
						}
					} else if (type === 'Object') {
						this.compile(obj[x], output, parent, x);
					} else if (type === 'Property') {
						output[parent] = output[parent].concat(obj[x].compile(x.replace(/\_/g, '-')));
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

		return '';
	};

	/**
	 * Property class / wrapper
	 * @constructor
	 * @param {Object|String} obj Property object
	 */
	function Property(obj) {
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
				type = Type.getType(this.self[x]);

				if (type === 'string' || Color.isValidCSSType(type)) {
					out.push(name + '-' + x + ': ' + this.self[x]);
				} else if (type === 'number') {
					out.push(name + '-' + x + ': ' + this.self[x] + (this.self[x] !== 0 ? defaultUnit : ''));
				} else if (type === 'array') {
					for (var y in this.self[x]) {
						type = Type.getType(this.self[x][y]);

						if (type === 'string' || Color.isValidCSSType(type)) {
							out.push(name + '-' + x + ': ' + this.self[x][y]);
						} else if (type === 'number') {
							out.push(name + '-' + x + ': ' + this.self[x][y] + (this.self[x][y] !== 0 ? defaultUnit : ''));
						}
					}
				}
			}
		}

		return out;
	};

	/**
	 * RGB color class
	 * @constructor
	 * @param {Number|Object} red Red value / color object
	 * @param {Number} green
	 * @param {Number} blue
	 */
	function RGB(red, green, blue) {
		if (red !== undefined && ((green === undefined && blue === undefined) || (Type.isNumber(green) && Type.isNumber(blue) && green.between(0, 255) && blue.between(0, 255)))) {
			if (green === undefined) {
				if (red instanceof this.constructor) {
					this.red = red.red;
					this.green = red.green;
					this.blue = red.blue;
				} else if (Type.isString(red)) {
					var parts = Color.regex.RGB.exec(red);

					if (parts) {
						parts[1] = parseInt(parts[1], 10);
						parts[2] = parseInt(parts[2], 10);
						parts[3] = parseInt(parts[3], 10);

						if (parts[1].between(0, 255) && parts[2].between(0, 255) && parts[3].between(0, 255)) {
							this.red = parts[1];
							this.green = parts[2];
							this.blue = parts[3];
						}
					} else {
						return toColorSpace(red, Color.RGB);
					}
				} else {
					return toColorSpace(red, Color.RGB);
				}
			} else if (Type.isNumber(red) && red.between(0, 255)) {
				this.red = red;
				this.green = green;
				this.blue = blue;
			}
		}

		return this;
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
		return this.isSet() ? new RGBA(this.red, this.green, this.blue, 1) : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	RGB.prototype.toRYB = function () {
		if (this.isSet()) {
			var white = Math.min(this.red, this.green, this.blue);
			var red = this.red - white;
			var green = this.green - white;
			var blue = this.blue - white;
			var yellow = Math.min(red, green);
			var x = Math.max(red, green, blue);
			red -= yellow;
			green -= yellow;

			if (green && blue) {
				green /= 2;
				blue /= 2;
			}

			yellow += green;
			blue += green;
			var y = Math.max(red, yellow, blue);

			if (y) {
				var n = x / y;
				red *= n;
				yellow *= n;
				blue *= n;
			}

			red += white;
			yellow += white;
			blue += white;

			return new RYB(red, yellow, blue);
		}

		return null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	RGB.prototype.toHex = function () {
		return this.isSet() ? new Hex('#' + (1 << 24 | this.red << 16 | this.green << 8 | this.blue).toString(16).substr(1)) : null;
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

		return null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	RGB.prototype.toHSLA = function () {
		return this.isSet() ? this.toHSL().toHSLA() : null;
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

			return new HSV(hue, saturation, max * 100 / 255);
		}

		return null;
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

		return null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	RGB.prototype.toxyY = function () {
		return this.isSet() ? this.toXYZ().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	RGB.prototype.toCIELab = function () {
		return this.isSet() ? this.toXYZ().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	RGB.prototype.toCIELuv = function () {
		return this.isSet() ? this.toXYZ().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	RGB.prototype.toHunterLab = function () {
		return this.isSet() ? this.toXYZ().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	RGB.prototype.toCMYK = function () {
		if (this.isSet()) {
			if (this.red === 0 && this.green === 0 && this.blue === 0) {
				return new CMYK(0, 0, 0, 1);
			} else {
				var cyan = 1 - (this.red / 255);
				var magenta = 1 - (this.green / 255);
				var yellow = 1 - (this.blue / 255);
				var key = Math.min(cyan, magenta, yellow);
				var _key = 1 - key;

				cyan = (cyan - key) / _key;
				magenta = (magenta - key) / _key;
				yellow = (yellow - key) / _key;

				return new CMYK(cyan, magenta, yellow, key);
			}
		}

		return null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	RGB.prototype.toYIQ = function () {
		if (this.isSet()) {
			var Y = 0.299 * this.red + 0.587 * this.green + 0.114 * this.blue;
			var I = 0.595716 * this.red - 0.274453 * this.green - 0.321263 * this.blue;
			var Q = 0.211456 * this.red - 0.522591 * this.green + 0.311135 * this.blue;

			return new YIQ(Y, I, Q);
		}

		return null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	RGB.prototype.toYUV = function () {
		if (this.isSet()) {
			var Y = 0.299 * this.red + 0.587 * this.green + 0.114 * this.blue;
			var U = -0.14713 * this.red - 0.28886 * this.green + 0.436 * this.blue;
			var V = 0.615 * this.red - 0.51499 * this.green - 0.10001 * this.blue;

			return new YUV(Y, U, V);
		}

		return null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	RGB.prototype.toYDbDr = function () {
		if (this.isSet()) {
			var Y = 0.299 * this.red + 0.587 * this.green + 0.114 * this.blue;
			var Db = -0.45 * this.red - 0.883 * this.green + 1.333 * this.blue;
			var Dr = -1.333 * this.red + 1.116 * this.green + 0.217 * this.blue;

			return new YDbDr(Y, Db, Dr);
		}

		return null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	RGB.prototype.toYCbCr = function () {
		if (this.isSet()) {
			var Y = 16 + (0.257 * this.red + 0.504 * this.green + 0.098 * this.blue);
			var Cb = 128 + (-0.148 * this.red - 0.291 * this.green + 0.439 * this.blue);
			var Cr = 128 + (0.439 * this.red - 0.368 * this.green - 0.071 * this.blue);

			return new YCbCr(Y, Cb, Cr);
		}

		return null;
	};

	/**
	 * Convert to YPbPr color (HDTV)
	 * @returns {YPbPr}
	 */
	RGB.prototype.toYPbPr = function () {
		if (this.isSet()) {
			var Y = 0.213 * this.red + 0.715 * this.green + 0.072 * this.blue;
			var Pb = -0.115 * this.red - 0.385 * this.green + 0.5 * this.blue;
			var Pr = 0.5 * this.red - 0.454 * this.green - 0.046 * this.blue;

			return new YPbPr(Y, Pb, Pr);
		}

		return null;
	};

	/**
	 * Convert to string
	 * @returns {String}
	 */
	RGB.prototype.toString = function () {
		return this.isSet() ? 'rgb(' + Math.round(this.red) + ', ' + Math.round(this.green) + ', ' + Math.round(this.blue) + ')' : '';
	};

	/**
	 * Get a random RGB color
	 * @static
	 * @returns {RGB}
	 */
	RGB.random = function () {
		return new RGB(Math.random() * 255, Math.random() * 255, Math.random() * 255);
	};

	/**
	 * RGBA color class
	 * @constructor
	 * @param {Number|Object} red Red value / color object
	 * @param {Number} green
	 * @param {Number} blue
	 * @param {Number} alpha
	 */
	function RGBA(red, green, blue, alpha) {
		if (red !== undefined && ((green === undefined && blue === undefined) || (Type.isNumber(green) && Type.isNumber(blue) && green.between(0, 255) && blue.between(0, 255)))) {
			if (green === undefined) {
				if (red instanceof this.constructor) {
					this.red = red.red;
					this.green = red.green;
					this.blue = red.blue;
					this.alpha = red.alpha;
				} else if (Type.isString(red)) {
					var parts = Color.regex.RGBA.exec(red);

					if (parts) {
						parts[1] = parseInt(parts[1], 10);
						parts[2] = parseInt(parts[2], 10);
						parts[3] = parseInt(parts[3], 10);
						parts[4] = parseFloat(parts[4]);

						if (parts[1].between(0, 255) && parts[2].between(0, 255) && parts[3].between(0, 255) && parts[4].between(0, 1)) {
							this.red = parts[1];
							this.green = parts[2];
							this.blue = parts[3];
							this.alpha = parts[4];
						}
					} else {
						return toColorSpace(red, Color.RGBA);
					}
				} else {
					return toColorSpace(red, Color.RGBA);
				}
			} else if (Type.isNumber(red) && red.between(0, 255)) {
				this.red = red;
				this.green = green;
				this.blue = blue;
				this.alpha = Type.isNumber(alpha) && alpha.between(0, 1) ? alpha : 1;
			}
		}

		return this;
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
					background = new RGB(background);

					if (!background || !background.isSet()) {
						background = new RGB(255, 255, 255);
					}
				}

				var alpha = 1 - this.alpha;
				var red = (this.alpha * (this.red / 255) + (alpha * (background.red / 255))) * 255;
				var green = (this.alpha * (this.green / 255) + (alpha * (background.green / 255))) * 255;
				var blue = (this.alpha * (this.blue / 255) + (alpha * (background.blue / 255))) * 255;

				return new RGB(red, green, blue);
			}
		}

		return null;
	};

	/**
	 * Convert to RYB color
	 * @param {Object} background
	 * @returns {RYB}
	 */
	RGBA.prototype.toRYB = function (background) {
		return this.isSet() ? this.toRGB(background).toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @param {Object} background
	 * @returns {Hex}
	 */
	RGBA.prototype.toHex = function (background) {
		return this.isSet() ? this.toRGB(background).toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @param {Object} background
	 * @returns {HSL}
	 */
	RGBA.prototype.toHSL = function (background) {
		return this.isSet() ? this.toRGB(background).toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	RGBA.prototype.toHSLA = function () {
		var out = null;

		if (this.isSet()) {
			out = new RGB(this.red, this.green, this.blue).toHSLA();

			if (this.alpha !== 1) {
				out.alpha = this.alpha;
			}
		}

		return out;
	};

	/**
	 * Convert to HSV color
	 * @param {Object} background
	 * @returns {HSV}
	 */
	RGBA.prototype.toHSV = function (background) {
		return this.isSet() ? this.toRGB(background).toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @param {Object} background
	 * @returns {XYZ}
	 */
	RGBA.prototype.toXYZ = function (background) {
		return this.isSet() ? this.toRGB(background).toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @param {Object} background
	 * @returns {xyY}
	 */
	RGBA.prototype.toxyY = function (background) {
		return this.isSet() ? this.toRGB(background).toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @param {Object} background
	 * @returns {CIELab}
	 */
	RGBA.prototype.toCIELab = function (background) {
		return this.isSet() ? this.toRGB(background).toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @param {Object} background
	 * @returns {CIELuv}
	 */
	RGBA.prototype.toCIELuv = function (background) {
		return this.isSet() ? this.toRGB(background).toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @param {Object} background
	 * @returns {HunterLab}
	 */
	RGBA.prototype.toHunterLab = function (background) {
		return this.isSet() ? this.toRGB(background).toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @param {Object} background
	 * @returns {CMYK}
	 */
	RGBA.prototype.toCMYK = function (background) {
		return this.isSet() ? this.toRGB(background).toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @param {Object} background
	 * @returns {YIQ}
	 */
	RGBA.prototype.toYIQ = function (background) {
		return this.isSet() ? this.toRGB(background).toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @param {Object} background
	 * @returns {YUV}
	 */
	RGBA.prototype.toYUV = function (background) {
		return this.isSet() ? this.toRGB(background).toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @param {Object} background
	 * @returns {YDbDr}
	 */
	RGBA.prototype.toYDbDr = function (background) {
		return this.isSet() ? this.toRGB(background).toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @param {Object} background
	 * @returns {YCbCr}
	 */
	RGBA.prototype.toYCbCr = function (background) {
		return this.isSet() ? this.toRGB(background).toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @param {Object} background
	 * @returns {YPbPr}
	 */
	RGBA.prototype.toYPbPr = function (background) {
		return this.isSet() ? this.toRGB(background).toYPbPr() : null;
	};

	/**
	 * Convert to string
	 * @returns {String}
	 */
	RGBA.prototype.toString = function () {
		return this.isSet() ? 'rgba(' + Math.round(this.red) + ', ' + Math.round(this.green) + ', ' + Math.round(this.blue) + ', ' + (Type.isInteger(this.alpha) ? this.alpha + '.0' : this.alpha.round(2)) + ')' : null;
	};

	/**
	 * Get component color
	 * @param {String} component
	 * @param {Object} background
	 * @returns {Null|Number}
	 */
	RGBA.prototype.getComponent = function(component, background) {
		if (this.isSet()) {
			var color = background === false ? this : this.toRGB(background);

			switch (component) {
				case Color.RED:
					return Math.round(color.red);

				case Color.GREEN:
					return Math.round(color.green);

				case Color.BLUE:
					return Math.round(color.blue);
			}
		}

		return null;
	};

	/**
	 * Randomly mutate the RGB object
	 */
	RGBA.prototype.mutate = function (change) {
		if (change && Type.isNumber(change) && change.between(0, 1) && this.isSet()) {
			change *= 255;

			// Mutated red
			var red = Math.random() * 2 > 1 ? this.red + change : this.red - change;

			if (red > 255) {
				red = this.red - change;
			} else if (red < 0) {
				red = this.red + change;
			}

			// Mutated green
			var green = Math.random() * 2 > 1 ? this.green + change : this.green - change;

			if (green > 255) {
				green = this.green - change;
			} else if (green < 0) {
				green = this.green + change;
			}

			// Mutated blue
			var blue = Math.random() * 2 > 1 ? this.blue + change : this.blue - change;

			if (blue > 255) {
				blue = this.blue - change;
			} else if (blue < 0) {
				blue = this.blue + change;
			}

			this.red = red;
			this.green = green;
			this.blue = blue;
		}
	};

	/**
	 * Get a random RGBA color
	 * @static
	 * @param {Boolean} randomAlpha
	 * @returns {RGBA}
	 */
	RGBA.random = function (randomAlpha) {
		return new RGBA(Math.random() * 255, Math.random() * 255, Math.random() * 255, randomAlpha ? Math.random() : 1);
	};

	/**
	 * Get red component
	 * @param {Object} color
	 * @param {Object} background
	 * @returns {Number}
	 */
	function red(color, background) {
		color = new RGBA(color);

		if (color && (color = new RGBA(color)) !== undefined) {
			return color.getComponent(Color.RED, background);
		}

		return null;
	}

	$.red = red;

	/**
	 * Get green component
	 * @param {Object} color
	 * @param {Object} background
	 * @returns {Null|Number}
	 */
	function green(color, background) {
		if (color && (color = new RGBA(color)) !== undefined) {
			return color.getComponent(Color.GREEN, background);
		}

		return null;
	}

	$.green = green;

	/**
	 * Get blue component
	 * @param {Object} color
	 * @param {Object} background
	 * @returns {Null|Number}
	 */
	function blue(color, background) {
		if (color && (color = new RGBA(color)) !== undefined) {
			return color.getComponent(Color.BLUE, background);
		}

		return null;
	}

	$.blue = blue;

	/**
	 * RYB color class
	 * @constructor
	 * @param {Number|Object} red Red value / color object
	 * @param {Number} yellow
	 * @param {Number} blue
	 */
	function RYB(red, yellow, blue) {
		if (red !== undefined && ((yellow === undefined && blue === undefined) || (Type.isNumber(yellow) && Type.isNumber(blue) && yellow.between(0, 255) && blue.between(0, 255)))) {
			if (yellow === undefined) {
				if (red instanceof this.constructor) {
					this.red = red.red;
					this.yellow = red.yellow;
					this.blue = red.blue;
				} else {
					return toColorSpace(red, Color.RYB);
				}
			} else if (Type.isNumber(red) && red.between(0, 255)) {
				this.red = red;
				this.yellow = yellow;
				this.blue = blue;
			}
		}

		return this;
	}

	$.RYB = RYB;

	RYB.prototype.red = undefined;
	RYB.prototype.yellow = undefined;
	RYB.prototype.blue = undefined;

	/**
	 * Check whether the RGBA object values are set
	 * @returns {Boolean}
	 */
	RYB.prototype.isSet = function () {
		return Type.isNumber(this.red) && Type.isNumber(this.yellow) && Type.isNumber(this.blue);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	RYB.prototype.toRGB = function () {
		if (this.isSet()) {
			var white = Math.min(this.red, this.yellow, this.blue);
			var red = this.red - white;
			var yellow = this.yellow - white;
			var blue = this.blue - white;
			var green = Math.min(yellow, blue);
			var x = Math.max(red, yellow, blue);

			yellow -= green;
			blue -= green;

			if (blue && green) {
				blue *= 2;
				green *= 2;
			}

			red += yellow;
			green += yellow;
			var z = Math.max(red, green, blue);

			if (z) {
				var n = x / z;
				red *= n;
				green *= n;
				blue *= n;
			}

			red += white;
			green += white;
			blue += white;

			return new RGB(red, green, blue);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	RYB.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	RYB.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	RYB.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	RYB.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	RYB.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	RYB.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	RYB.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	RYB.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	RYB.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	RYB.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	RYB.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	RYB.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	RYB.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	RYB.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	RYB.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	RYB.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Get a random RYB color
	 * @static
	 * @returns {RYB}
	 */
	RYB.random = function () {
		return RGB.random().toRYB();
	};

	/**
	 * Hex color class
	 * @constructor
	 * @param {String|Object} value Hex valid / color object
	 */
	function Hex(value) {
		if (Type.isString(value)) {
			this.setValue(value);
		} else if (value instanceof this.constructor) {
			this.setValue(value.value);
		} else {
			return toColorSpace(value, Color.HEX);
		}

		return this;
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

				return true;
			} else if (Hex.isValid(hex)) {
				if (hex.charAt(0) === '#') {
					hex = hex.substring(1);
				}

				this.value = Hex.isTriplet(hex) ? Hex.expand(hex) : hex;

				return true;
			}
		}

		return false;
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	Hex.prototype.toRGB = function () {
		return this.isSet() ? new RGB(parseInt(this.value.substring(0, 2), 16), parseInt(this.value.substring(2, 4), 16), parseInt(this.value.substring(4, 6), 16)) : null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	Hex.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	Hex.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	Hex.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	Hex.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	Hex.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	Hex.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	Hex.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	Hex.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	Hex.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	Hex.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	Hex.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	Hex.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	Hex.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	Hex.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	Hex.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	Hex.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Convert to CSS string
	 * @returns {String}
	 */
	Hex.prototype.toString = function () {
		return this.isSet() ? '#' + this.value : '';
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
	 * @param {Number|Object} hue Hue value / color object
	 * @param {Number} saturation
	 * @param {Number} lightness
	 */
	function HSL(hue, saturation, lightness) {
		if (Type.isNumber(hue) && Type.isNumber(saturation) && Type.isNumber(lightness)) {
			this.hue = hue;
			this.saturation = saturation;
			this.lightness = lightness;
		} else if (hue instanceof this.constructor) {
			this.hue = hue.hue;
			this.saturation = hue.saturation;
			this.lightness = hue.lightness;
		} else {
			return toColorSpace(hue, Color.HSL);
		}

		return this;
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

			return new RGB(red * 255, green * 255, blue * 255);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	HSL.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	HSL.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	HSL.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	HSL.prototype.toHSLA = function () {
		if (this.isSet()) {
			return new HSLA(this.hue, this.saturation, this.lightness, 1);
		}

		return null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	HSL.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	HSL.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	HSL.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	HSL.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	HSL.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	HSL.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	HSL.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	HSL.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	HSL.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	HSL.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	HSL.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	HSL.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Convert to CSS string
	 * @returns {String}
	 */
	HSL.prototype.toString = function () {
		return this.isSet() ? 'hsl(' + Math.round(this.hue) + ', ' + Math.round(this.saturation) + '%, ' + Math.round(this.lightness) + '%)' : '';
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
	 * @param {Number|Object} hue Hue value / color object
	 * @param {Number} saturation
	 * @param {Number} lightness
	 * @param {Number} alpha
	 */
	function HSLA(hue, saturation, lightness, alpha) {
		if (Type.isNumber(hue) && Type.isNumber(saturation) && Type.isNumber(lightness)) {
			this.hue = hue;
			this.saturation = saturation;
			this.lightness = lightness;
			this.alpha = Type.isNumber(alpha) && alpha.between(0, 1) ? alpha : 1;
		} else if (hue instanceof this.constructor) {
			this.hue = hue.hue;
			this.saturation = hue.saturation;
			this.lightness = hue.lightness;
			this.alpha = hue.alpha;
		} else {
			return toColorSpace(hue, Color.HSLA);
		}

		return this;
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
		return this.isSet() ? this.toRGBA(background).toRGB() : null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	HSLA.prototype.toRGBA = function () {
		var out = null;

		if (this.isSet()) {
			out = new HSL(this.hue, this.saturation, this.lightness).toRGBA();

			if (this.alpha !== 1) {
				out.alpha = this.alpha;
			}
		}

		return out;
	};

	/**
	 * Convert to RYB color
	 * @param {Object} background
	 * @returns {RYB}
	 */
	HSLA.prototype.toRYB = function (background) {
		return this.isSet() ? this.toRGBA(background).toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @param {Object} background
	 * @returns {Hex}
	 */
	HSLA.prototype.toHex = function (background) {
		return this.isSet() ? this.toRGBA(background).toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @param {Object} background
	 * @returns {HSL}
	 */
	HSLA.prototype.toHSL = function (background) {
		var out = null;

		if (this.isSet()) {
			out = new HSL(this.hue, this.saturation, this.lightness);

			if (this.alpha !== 1) {
				out = this.toRGBA(background).toHSL();
			}
		}

		return out;
	};

	/**
	 * Convert to HSV color
	 * @param {Object} background
	 * @returns {HSV}
	 */
	HSLA.prototype.toHSV = function (background) {
		return this.isSet() ? this.toRGBA(background).toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @param {Object} background
	 * @returns {XYZ}
	 */
	HSLA.prototype.toXYZ = function (background) {
		return this.isSet() ? this.toRGBA(background).toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @param {Object} background
	 * @returns {xyY}
	 */
	HSLA.prototype.toxyY = function (background) {
		return this.isSet() ? this.toRGBA(background).toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @param {Object} background
	 * @returns {CIELab}
	 */
	HSLA.prototype.toCIELab = function (background) {
		return this.isSet() ? this.toRGBA(background).toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @param {Object} background
	 * @returns {CIELuv}
	 */
	HSLA.prototype.toCIELuv = function (background) {
		return this.isSet() ? this.toRGB(background).toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @param {Object} background
	 * @returns {HunterLab}
	 */
	HSLA.prototype.toHunterLab = function (background) {
		return this.isSet() ? this.toRGBA(background).toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @param {Object} background
	 * @returns {CMYK}
	 */
	HSLA.prototype.toCMYK = function (background) {
		return this.isSet() ? this.toRGBA(background).toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @param {Object} background
	 * @returns {YIQ}
	 */
	HSLA.prototype.toYIQ = function (background) {
		return this.isSet() ? this.toRGBA(background).toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @param {Object} background
	 * @returns {YUV}
	 */
	HSLA.prototype.toYUV = function (background) {
		return this.isSet() ? this.toRGBA(background).toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @param {Object} background
	 * @returns {YDbDr}
	 */
	HSLA.prototype.toYDbDr = function (background) {
		return this.isSet() ? this.toRGBA(background).toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @param {Object} background
	 * @returns {YCbCr}
	 */
	HSLA.prototype.toYCbCr = function (background) {
		return this.isSet() ? this.toRGBA(background).toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @param {Object} background
	 * @returns {YPbPr}
	 */
	HSLA.prototype.toYPbPr = function (background) {
		return this.isSet() ? this.toRGB(background).toYPbPr() : null;
	};

	/**
	 * Convert to CSS string
	 * @returns {String}
	 */
	HSLA.prototype.toString = function () {
		return this.isSet() ? 'hsla(' + Math.round(this.hue) + ', ' + Math.round(this.saturation) + '%, ' + Math.round(this.lightness) + '%, ' + this.alpha.round(2) + ')' : '';
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
			out.alpha = Math.random();
		}

		return out;
	};

	/**
	 * HSV color class
	 * @constructor
	 * @param {Number|Object} hue Hue value / color object
	 * @param {Number} saturation
	 * @param {Number} value
	 */
	function HSV(hue, saturation, value) {
		if (Type.isNumber(hue) && Type.isNumber(saturation) && Type.isNumber(value)) {
			this.hue = hue;
			this.saturation = saturation;
			this.value = value;
		} else if (hue instanceof this.constructor) {
			this.hue = hue.hue;
			this.saturation = hue.saturation;
			this.value = hue.value;
		} else {
			return toColorSpace(hue, Color.HSV);
		}

		return this;
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
				red = value * 2.55;

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

				return new RGB(red * 255, green * 255, blue * 255);
			}
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	HSV.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	HSV.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	HSV.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	HSV.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	HSV.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	HSV.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	HSV.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	HSV.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	HSV.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	HSV.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	HSV.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	HSV.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	HSV.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	HSV.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	HSV.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	HSV.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
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
	 * @param {Number|Object} X X value / color object
	 * @param {Number} Y
	 * @param {Number} Z
	 */
	function XYZ(X, Y, Z) {
		if (Type.isNumber(X) && Type.isNumber(Y) && Type.isNumber(Z)) {
			this.X = X;
			this.Y = Y;
			this.Z = Z;
		} else if (X instanceof this.constructor) {
			this.X = X.X;
			this.Y = X.Y;
			this.Z = X.Z;
		} else {
			return toColorSpace(X, Color.XYZ);
		}

		return this;
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

			red = (red > 0.0031308 ? (1.055 * Math.pow(red, 1 / 2.4)) - 0.055 : 12.92 * red) * 255;
			green = (green > 0.0031308 ? (1.055 * Math.pow(green, 1 / 2.4)) - 0.055 : 12.92 * green) * 255;
			blue = (blue > 0.0031308 ? (1.055 * Math.pow(blue, 1 / 2.4)) - 0.055 : 12.92 * blue) * 255;

			return new RGB(red, green, blue);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	XYZ.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	XYZ.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	XYZ.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	XYZ.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	XYZ.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	XYZ.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	XYZ.prototype.toxyY = function () {
		if (this.isSet()) {
			var sum = this.X + this.Y + this.Z;

			return new xyY(this.X / sum, this.Y / sum, this.Y);
		}

		return null;
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

		return null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	XYZ.prototype.toCIELuv = function () {
		if (this.isSet()) {
			var t = this.X + (15 * this.Y) + (3 * this.Z);
			var U = (4 * this.X) / t;
			var V = (9 * this.Y) / t;
			var Y = this.Y / 100;
			Y = Y > 0.008856 ? Math.pow(Y, 1 / 3) : (7.787 * Y) + (16 / 116);
			var rX = 95.047;
			var rY = 100;
			var r = rX + (15 * rY) + (3 * 108.883);
			var rU = (4 * rX) / r;
			var rV = (9 * rY) / r;
			var L = (116 * Y) - 16;
			var u = 13 * L * (U - rU);
			var v = 13 * L * (V - rV);

			return new CIELuv(L, u, v);
		}

		return null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	XYZ.prototype.toHunterLab = function () {
		if (this.isSet()) {
			var sqrtY = Math.sqrt(this.Y);
			var L = 10 * sqrtY;
			var a = 17.5 * ((1.02 * this.X - this.Y) / sqrtY);
			var b = 7 * ((this.Y - 0.847 * this.Z) / sqrtY);

			return new HunterLab(L, a, b);
		}

		return null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	XYZ.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	XYZ.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	XYZ.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	XYZ.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	XYZ.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	XYZ.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
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
	 * xyY color class
	 * @constructor
	 * @param {Number|Object} x x value / color object
	 * @param {Number} y
	 * @param {Number} Y
	 */
	function xyY(x, y, Y) {
		if (Type.isNumber(x) && Type.isNumber(y) && Type.isNumber(Y)) {
			this.x = x;
			this.y = y;
			this.Y = Y;
		} else if (x instanceof this.constructor) {
			this.x = x.x;
			this.y = x.y;
			this.Y = x.Y;
		} else {
			return toColorSpace(x, Color.XYY);
		}

		return this;
	}

	$.xyY = xyY;

	xyY.prototype.x = undefined;
	xyY.prototype.y = undefined;
	xyY.prototype.Y = undefined;

	/**
	 * Check whether the xyY object values are set
	 * @returns {Boolean}
	 */
	xyY.prototype.isSet = function () {
		return Type.isNumber(this.x) && Type.isNumber(this.y) && Type.isNumber(this.Y);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	xyY.prototype.toRGB = function () {
		return this.isSet() ? this.toXYZ().toRGB() : null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	xyY.prototype.toRGBA = function () {
		return this.isSet() ? this.toXYZ().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	xyY.prototype.toRYB = function () {
		return this.isSet() ? this.toXYZ().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	xyY.prototype.toHex = function () {
		return this.isSet() ? this.toXYZ().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	xyY.prototype.toHSL = function () {
		return this.isSet() ? this.toXYZ().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	xyY.prototype.toHSLA = function () {
		return this.isSet() ? this.toXYZ().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	xyY.prototype.toHSV = function () {
		return this.isSet() ? this.toXYZ().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	xyY.prototype.toXYZ = function () {
		if (this.isSet()) {
			if (this.y === 0) {
				return new XYZ(0, 0, 0);
			} else {
				var X = (this.x * this.Y) / this.y;
				var Z = ((1 - this.x - this.y) * this.Y) / this.y;

				return new XYZ(X, this.Y, Z);
			}
		}

		return null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	xyY.prototype.toCIELab = function () {
		return this.isSet() ? this.toXYZ().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	xyY.prototype.toCIELuv = function () {
		return this.isSet() ? this.toXYZ().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	xyY.prototype.toHunterLab = function () {
		return this.isSet() ? this.toXYZ().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	xyY.prototype.toCMYK = function () {
		return this.isSet() ? this.toXYZ().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	xyY.prototype.toYIQ = function () {
		return this.isSet() ? this.toXYZ().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	xyY.prototype.toYUV = function () {
		return this.isSet() ? this.toXYZ().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	xyY.prototype.toYDbDr = function () {
		return this.isSet() ? this.toXYZ().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	xyY.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	xyY.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Get a random xyY color
	 * @static
	 * @returns {xyY}
	 */
	xyY.random = function () {
		return XYZ.random().toxyY();
	};

	/**
	 * CIELab color class
	 * @constructor
	 * @param {Number|Object} L L value / color object
	 * @param {Number} a
	 * @param {Number} b
	 */
	function CIELab(L, a, b) {
		if (Type.isNumber(L) && Type.isNumber(a) && Type.isNumber(b)) {
			this.L = L;
			this.a = a;
			this.b = b;
		} else if (L instanceof this.constructor) {
			this.L = L.L;
			this.a = L.a;
			this.b = L.b;
		} else {
			return toColorSpace(L, Color.CIELAB);
		}

		return this;
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
		return this.isSet() ? this.toXYZ().toRGB() : null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	CIELab.prototype.toRGBA = function () {
		return this.isSet() ? this.toXYZ().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	CIELab.prototype.toRYB = function () {
		return this.isSet() ? this.toXYZ().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	CIELab.prototype.toHex = function () {
		return this.isSet() ? this.toXYZ().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	CIELab.prototype.toHSL = function () {
		return this.isSet() ? this.toXYZ().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	CIELab.prototype.toHSLA = function () {
		return this.isSet() ? this.toXYZ().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	CIELab.prototype.toHSV = function () {
		return this.isSet() ? this.toXYZ().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	CIELab.prototype.toXYZ = function () {
		if (this.isSet()) {
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
		}

		return null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	CIELab.prototype.toxyY = function () {
		return this.isSet() ? this.toXYZ().toxyY() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	CIELab.prototype.toCIELuv = function () {
		return this.isSet() ? this.toXYZ().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	CIELab.prototype.toHunterLab = function () {
		return this.isSet() ? this.toXYZ().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	CIELab.prototype.toCMYK = function () {
		return this.isSet() ? this.toXYZ().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	CIELab.prototype.toYIQ = function () {
		return this.isSet() ? this.toXYZ().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	CIELab.prototype.toYUV = function () {
		return this.isSet() ? this.toXYZ().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	CIELab.prototype.toYDbDr = function () {
		return this.isSet() ? this.toXYZ().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	CIELab.prototype.toYCbCr = function () {
		return this.isSet() ? this.toXYZ().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	CIELab.prototype.toYPbPr = function () {
		return this.isSet() ? this.toXYZ().toYPbPr() : null;
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
	 * CIELuv color class
	 * @constructor
	 * @param {Number|Object} L L value / color object
	 * @param {Number} u
	 * @param {Number} v
	 */
	function CIELuv(L, u, v) {
		if (Type.isNumber(L) && Type.isNumber(u) && Type.isNumber(v)) {
			this.L = L;
			this.u = u;
			this.v = v;
		} else if (L instanceof this.constructor) {
			this.L = L.L;
			this.u = L.u;
			this.v = L.v;
		} else {
			return toColorSpace(L, Color.CIELUV);
		}

		return this;
	}

	$.CIELuv = CIELuv;

	CIELuv.prototype.L = undefined;
	CIELuv.prototype.u = undefined;
	CIELuv.prototype.v = undefined;

	/**
	 * Check whether the CIELab object values are set
	 * @returns {Boolean}
	 */
	CIELuv.prototype.isSet = function () {
		return Type.isNumber(this.L) && Type.isNumber(this.u) && Type.isNumber(this.v);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	CIELuv.prototype.toRGB = function () {
		return this.isSet() ? this.toXYZ().toRGB() : null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	CIELuv.prototype.toRGBA = function () {
		return this.isSet() ? this.toXYZ().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	CIELuv.prototype.toRYB = function () {
		return this.isSet() ? this.toXYZ().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	CIELuv.prototype.toHex = function () {
		return this.isSet() ? this.toXYZ().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	CIELuv.prototype.toHSL = function () {
		return this.isSet() ? this.toXYZ().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	CIELuv.prototype.toHSLA = function () {
		return this.isSet() ? this.toXYZ().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	CIELuv.prototype.toHSV = function () {
		return this.isSet() ? this.toXYZ().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	CIELuv.prototype.toXYZ = function () {
		if (this.isSet()) {
			var Y = (this.L + 16) / 116;
			var Y3 = Math.pow(Y, 3);
			Y = Y3 > 0.008856 ? Y3 : (Y - 16 / 116) / 7.787;
			var rX = 95.047;
			var rY = 100;
			var r = rX + (15 * rY) + (3 * 108.883);
			var rU = (4 * rX) / r;
			var rV = (9 * rY) / r;
			var U = this.u / (13 * this.L) + rU;
			var V = this.v / (13 * this.L) + rV;
			Y *= 100;
			var X = -(9 * Y * U) / ((U - 4) * V - U * V);
			var Z = (9 * Y - (15 * V * Y) - (V * X)) / (3 * V);

			return new XYZ(X, Y, Z);
		}

		return null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	CIELuv.prototype.toxyY = function () {
		return this.isSet() ? this.toXYZ().toxyY() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	CIELuv.prototype.toHunterLab = function () {
		return this.isSet() ? this.toXYZ().toHunterLab() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	CIELuv.prototype.toCIELab = function () {
		return this.isSet() ? this.toXYZ().toCIELab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	CIELuv.prototype.toCMYK = function () {
		return this.isSet() ? this.toXYZ().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	CIELuv.prototype.toYIQ = function () {
		return this.isSet() ? this.toXYZ().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	CIELuv.prototype.toYUV = function () {
		return this.isSet() ? this.toXYZ().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	CIELuv.prototype.toYDbDr = function () {
		return this.isSet() ? this.toXYZ().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	CIELuv.prototype.toYCbCr = function () {
		return this.isSet() ? this.toXYZ().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	CIELuv.prototype.toYPbPr = function () {
		return this.isSet() ? this.toXYZ().toYPbPr() : null;
	};

	/**
	 * Get a random CIELuv color
	 * @static
	 * @returns {CIELuv}
	 */
	CIELuv.random = function () {
		return XYZ.random().toCIELab();
	};

	/**
	 * HunterLab color class
	 * @constructor
	 * @param {Number|Object} L L value / color object
	 * @param {Number} a
	 * @param {Number} b
	 */
	function HunterLab(L, a, b) {
		if (Type.isNumber(L) && Type.isNumber(a) && Type.isNumber(b)) {
			this.L = L;
			this.a = a;
			this.b = b;
		} else if (L instanceof this.constructor) {
			this.L = L.L;
			this.a = L.a;
			this.b = L.b;
		} else {
			return toColorSpace(L, Color.HUNTERLAB);
		}

		return this;
	}

	$.HunterLab = HunterLab;

	HunterLab.prototype.L = undefined;
	HunterLab.prototype.a = undefined;
	HunterLab.prototype.b = undefined;

	/**
	 * Check whether the object values are set
	 * @returns {Boolean}
	 */
	HunterLab.prototype.isSet = function () {
		return Type.isNumber(this.L) && Type.isNumber(this.a) && Type.isNumber(this.b);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	HunterLab.prototype.toRGB = function () {
		return this.isSet() ? this.toXYZ().toRGB() : null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	HunterLab.prototype.toRGBA = function () {
		return this.isSet() ? this.toXYZ().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	HunterLab.prototype.toRYB = function () {
		return this.isSet() ? this.toXYZ().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	HunterLab.prototype.toHex = function () {
		return this.isSet() ? this.toXYZ().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	HunterLab.prototype.toHSL = function () {
		return this.isSet() ? this.toXYZ().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	HunterLab.prototype.toHSLA = function () {
		return this.isSet() ? this.toXYZ().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	HunterLab.prototype.toHSV = function () {
		return this.isSet() ? this.toXYZ().toHSV() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	HunterLab.prototype.toCIELab = function () {
		return this.isSet() ? this.toXYZ().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	HunterLab.prototype.toCIELuv = function () {
		return this.isSet() ? this.toXYZ().toCIELuv() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	HunterLab.prototype.toXYZ = function () {
		if (this.isSet()) {
			var Y = Math.pow(this.L / 10, 2);
			var X = ((this.a / 17.5 * this.L / 10) + Y) / 1.02;
			var Z = -((this.b / 7 * this.L / 10) - Y) / 0.847;

			return new XYZ(X, Y, Z);
		}

		return null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	HunterLab.prototype.toxyY = function () {
		return this.isSet() ? this.toXYZ().toxyY() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	HunterLab.prototype.toCMYK = function () {
		return this.isSet() ? this.toXYZ().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	HunterLab.prototype.toYIQ = function () {
		return this.isSet() ? this.toXYZ().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	HunterLab.prototype.toYUV = function () {
		return this.isSet() ? this.toXYZ().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	HunterLab.prototype.toYDbDr = function () {
		return this.isSet() ? this.toXYZ().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	HunterLab.prototype.toYCbCr = function () {
		return this.isSet() ? this.toXYZ().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	HunterLab.prototype.toYPbPr = function () {
		return this.isSet() ? this.toXYZ().toYPbPr() : null;
	};

	/**
	 * Get a random HunterLab color
	 * @static
	 * @returns {HunterLab}
	 */
	HunterLab.random = function () {
		return XYZ.random().toHunterLab();
	};

	/**
	 * CMYK color class
	 * @constructor
	 * @param {Number|Object} cyan Cyan value / color object
	 * @param {Number} magenta
	 * @param {Number} yellow
	 * @param {Number} key
	 */
	function CMYK(cyan, magenta, yellow, key) {
		if (Type.isNumber(cyan) && Type.isNumber(magenta) && Type.isNumber(yellow) && Type.isNumber(key) && cyan.between(0, 1) && magenta.between(0, 1) && yellow.between(0, 1) && key.between(0, 1)) {
			this.cyan = cyan;
			this.magenta = magenta;
			this.yellow = yellow;
			this.key = key;
		} else if (cyan instanceof this.constructor) {
			this.cyan = cyan.cyan;
			this.magenta = cyan.magenta;
			this.yellow = cyan.yellow;
			this.key = cyan.key;
		} else {
			return toColorSpace(cyan, Color.CMYK);
		}

		return this;
	}

	$.CMYK = CMYK;

	CMYK.prototype.cyan = undefined;
	CMYK.prototype.magenta = undefined;
	CMYK.prototype.yellow = undefined;
	CMYK.prototype.key = undefined;

	/**
	 * Check whether the CMYK object values are set
	 * @returns {Boolean}
	 */
	CMYK.prototype.isSet = function () {
		return Type.isNumber(this.cyan) && Type.isNumber(this.magenta) && Type.isNumber(this.yellow) && Type.isNumber(this.key);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	CMYK.prototype.toRGB = function () {
		if (this.isSet()) {
			var _key = 1 - this.key;
			var red = (1 - Math.min(1, this.cyan * _key + this.key)) * 255;
			var green = (1 - Math.min(1, this.magenta * _key + this.key)) * 255;
			var blue = (1 - Math.min(1, this.yellow * _key + this.key)) * 255;

			return new RGB(red, green, blue);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	CMYK.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	CMYK.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	CMYK.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	CMYK.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	CMYK.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	CMYK.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	CMYK.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	CMYK.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	CMYK.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	CMYK.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	CMYK.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	CMYK.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	CMYK.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	CMYK.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	CMYK.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	CMYK.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Get a random CMYK color
	 * @static
	 * @returns {CMYK}
	 */
	CMYK.random = function () {
		return RGB.random().toCMYK();
	};

	/**
	 * YIQ color class
	 * @constructor
	 * @param {Number|Object} Y Y value / color object
	 * @param {Number} I
	 * @param {Number} Q
	 */
	function YIQ(Y, I, Q) {
		if (Type.isNumber(Y) && Type.isNumber(I) && Type.isNumber(Q)) {
			this.Y = Y;
			this.I = I;
			this.Q = Q;
		} else if (Y instanceof this.constructor) {
			this.Y = Y.Y;
			this.I = Y.I;
			this.Q = Y.Q;
		} else {
			return toColorSpace(Y, Color.YIQ);
		}

		return this;
	}

	$.YIQ = YIQ;

	YIQ.prototype.Y = undefined;
	YIQ.prototype.I = undefined;
	YIQ.prototype.Q = undefined;

	/**
	 * Check whether the YIQ object values are set
	 * @returns {Boolean}
	 */
	YIQ.prototype.isSet = function () {
		return Type.isNumber(this.Y) && Type.isNumber(this.I) && Type.isNumber(this.Q);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	YIQ.prototype.toRGB = function () {
		if (this.isSet()) {
			var red = this.Y + 0.9563 * this.I + 0.621 * this.Q;
			var green = this.Y - 0.2721 * this.I - 0.6474 * this.Q;
			var blue = this.Y - 1.107 * this.I + 1.7046 * this.Q;

			if (red < 0) {
				red = 0;
			} else if (red > 255) {
				red = 255;
			}

			if (green < 0) {
				green = 0;
			} else if (green > 255) {
				green = 255;
			}

			if (blue < 0) {
				blue = 0;
			} else if (blue > 255) {
				blue = 255;
			}

			return new RGB(red, green, blue);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	YIQ.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	YIQ.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	YIQ.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	YIQ.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	YIQ.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	YIQ.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	YIQ.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	YIQ.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	YIQ.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	YIQ.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	YIQ.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	YIQ.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	YIQ.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	YIQ.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	YIQ.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	YIQ.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Get a random YIQ color
	 * @static
	 * @returns {YIQ}
	 */
	YIQ.random = function () {
		return RGB.random().toYIQ();
	};

	/**
	 * YUV color class
	 * @constructor
	 * @param {Number|Object} Y Y value / color object
	 * @param {Number} U
	 * @param {Number} V
	 */
	function YUV(Y, U, V) {
		if (Type.isNumber(Y) && Type.isNumber(U) && Type.isNumber(V)) {
			this.Y = Y;
			this.U = U;
			this.V = V;
		} else if (Y instanceof this.constructor) {
			this.Y = Y.Y;
			this.U = Y.U;
			this.V = Y.V;
		} else {
			return toColorSpace(Y, Color.YUV);
		}

		return this;
	}

	$.YUV = YUV;

	YUV.prototype.Y = undefined;
	YUV.prototype.U = undefined;
	YUV.prototype.V = undefined;

	/**
	 * Check whether the YUV object values are set
	 * @returns {Boolean}
	 */
	YUV.prototype.isSet = function () {
		return Type.isNumber(this.Y) && Type.isNumber(this.U) && Type.isNumber(this.V);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	YUV.prototype.toRGB = function () {
		if (this.isSet()) {
			var red = this.Y + 1.13983 * this.V;
			var green = this.Y - 0.39456 * this.U - 0.58060 * this.V;
			var blue = this.Y + 2.03211 * this.U;

			if (red < 0) {
				red = 0;
			}

			if (green < 0) {
				green = 0;
			}

			if (blue < 0) {
				blue = 0;
			}

			return new RGB(red, green, blue);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	YUV.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	YUV.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	YUV.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	YUV.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	YUV.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	YUV.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	YUV.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	YUV.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	YUV.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	YUV.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	YUV.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	YUV.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	YUV.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YDbDr color
	 * @returns {YDbDr}
	 */
	YUV.prototype.toYDbDr = function () {
		if (this.isSet()) {
			var Db = 3.059 * this.U;
			var Dr = -2.169 * this.V;

			return new YDbDr(this.Y, Db, Dr);
		}

		return null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	YUV.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	YUV.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Get a random YUV color
	 * @static
	 * @returns {YUV}
	 */
	YUV.random = function () {
		return RGB.random().toYUV();
	};

	/**
	 * YDbDr color class
	 * @constructor
	 * @param {Number|Object} Y Y value / color object
	 * @param {Number} Db
	 * @param {Number} Dr
	 */
	function YDbDr(Y, Db, Dr) {
		if (Type.isNumber(Y) && Type.isNumber(Db) && Type.isNumber(Dr)) {
			this.Y = Y;
			this.Db = Db;
			this.Dr = Dr;
		} else if (Y instanceof this.constructor) {
			this.Y = Y.Y;
			this.Db = Y.Db;
			this.Dr = Y.Dr;
		} else {
			return toColorSpace(Y, Color.YDBDR);
		}

		return this;
	}

	$.YDbDr = YDbDr;

	YDbDr.prototype.Y = undefined;
	YDbDr.prototype.Db = undefined;
	YDbDr.prototype.Dr = undefined;

	/**
	 * Check whether the YDbDr object values are set
	 * @returns {Boolean}
	 */
	YDbDr.prototype.isSet = function () {
		return Type.isNumber(this.Y) && Type.isNumber(this.Db) && Type.isNumber(this.Dr);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	YDbDr.prototype.toRGB = function () {
		if (this.isSet()) {
			var red = this.Y + 0.000092303716148 * this.Db - 0.525912630661865 * this.Dr;
			var green = this.Y - 0.129132898890509 * this.Db + 0.267899328207599 * this.Dr;
			var blue = this.Y + 0.664679059978955 * this.Db - 0.000079202543533 * this.Dr;

			if (red < 0) {
				red = 0;
			}

			if (green < 0) {
				green = 0;
			}

			if (blue < 0) {
				blue = 0;
			}

			return new RGB(red, green, blue);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	YDbDr.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	YDbDr.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	YDbDr.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	YDbDr.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	YDbDr.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	YDbDr.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	YDbDr.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	YDbDr.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	YDbDr.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	YDbDr.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	YDbDr.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	YDbDr.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	YDbDr.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	YDbDr.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	YDbDr.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	YDbDr.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Get a random YDbDr color
	 * @static
	 * @returns {YDbDr}
	 */
	YDbDr.random = function () {
		return RGB.random().toYDbDr();
	};

	/**
	 * YCbCr color class
	 * @constructor
	 * @param {Number|Object} Y Y value / color object
	 * @param {Number} Cb
	 * @param {Number} Cr
	 */
	function YCbCr(Y, Cb, Cr) {
		if (Type.isNumber(Y) && Type.isNumber(Cb) && Type.isNumber(Cr)) {
			this.Y = Y;
			this.Cb = Cb;
			this.Cr = Cr;
		} else if (Y instanceof this.constructor) {
			this.Y = Y.Y;
			this.Cb = Y.Cb;
			this.Cr = Y.Cr;
		} else {
			return toColorSpace(Y, Color.YCBCR);
		}

		return this;
	}

	$.YCbCr = YCbCr;

	YCbCr.prototype.Y = undefined;
	YCbCr.prototype.Cb = undefined;
	YCbCr.prototype.Cr = undefined;

	/**
	 * Check whether the object values are set
	 * @returns {Boolean}
	 */
	YCbCr.prototype.isSet = function () {
		return Type.isNumber(this.Y) && Type.isNumber(this.Cb) && Type.isNumber(this.Cr);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	YCbCr.prototype.toRGB = function () {
		if (this.isSet()) {
			var Y = 1.164 * (this.Y - 16);
			var Cb = this.Cb - 128;
			var Cr = this.Cr - 128;
			var red = Y + 1.596 * Cr;
			var green = Y - 0.392 * Cb - 0.813 * Cr;
			var blue = Y + 2.017 * Cb;

			if (red < 0) {
				red = 0;
			}

			if (green < 0) {
				green = 0;
			}

			if (blue < 0) {
				blue = 0;
			}

			return new RGB(red, green, blue);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	YCbCr.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	YCbCr.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	YCbCr.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	YCbCr.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	YCbCr.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	YCbCr.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	YCbCr.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	YCbCr.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	YCbCr.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	YCbCr.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	YCbCr.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	YCbCr.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	YCbCr.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	YCbCr.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	YCbCr.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YPbPr color
	 * @returns {YPbPr}
	 */
	YCbCr.prototype.toYPbPr = function () {
		return this.isSet() ? this.toRGB().toYPbPr() : null;
	};

	/**
	 * Get a random YDbDr color
	 * @static
	 * @returns {YDbDr}
	 */
	YCbCr.random = function () {
		return RGB.random().toYDbDr();
	};

	/**
	 * YPbPr color class
	 * @constructor
	 * @param {Number|Object} Y Y value / color object
	 * @param {Number} Pb
	 * @param {Number} Pr
	 */
	function YPbPr(Y, Pb, Pr) {
		if (Type.isNumber(Y) && Type.isNumber(Pb) && Type.isNumber(Pr)) {
			this.Y = Y;
			this.Pb = Pb;
			this.Pr = Pr;
		} else if (Y instanceof this.constructor) {
			this.Y = Y.Y;
			this.Pb = Y.Pb;
			this.Pr = Y.Pr;
		} else {
			return toColorSpace(Y, Color.YPBPR);
		}

		return this;
	}

	$.YPbPr = YPbPr;

	YPbPr.prototype.Y = undefined;
	YPbPr.prototype.Pb = undefined;
	YPbPr.prototype.Pr = undefined;

	/**
	 * Check whether the object values are set
	 * @returns {Boolean}
	 */
	YPbPr.prototype.isSet = function () {
		return Type.isNumber(this.Y) && Type.isNumber(this.Pb) && Type.isNumber(this.Pr);
	};

	/**
	 * Convert to RGB color
	 * @returns {RGB}
	 */
	YPbPr.prototype.toRGB = function () {
		if (this.isSet()) {
			var red = this.Y + 1.575 * this.Pr;
			var green = this.Y - 0.187 * this.Pb - 0.468 * this.Pr;
			var blue = this.Y + 1.856 * this.Pb;

			if (red < 0) {
				red = 0;
			}

			if (green < 0) {
				green = 0;
			}

			if (blue < 0) {
				blue = 0;
			}

			return new RGB(red, green, blue);
		}

		return null;
	};

	/**
	 * Convert to RGBA color
	 * @returns {RGBA}
	 */
	YPbPr.prototype.toRGBA = function () {
		return this.isSet() ? this.toRGB().toRGBA() : null;
	};

	/**
	 * Convert to RYB color
	 * @returns {RYB}
	 */
	YPbPr.prototype.toRYB = function () {
		return this.isSet() ? this.toRGB().toRYB() : null;
	};

	/**
	 * Convert to Hex color
	 * @returns {Hex}
	 */
	YPbPr.prototype.toHex = function () {
		return this.isSet() ? this.toRGB().toHex() : null;
	};

	/**
	 * Convert to HSL color
	 * @returns {HSL}
	 */
	YPbPr.prototype.toHSL = function () {
		return this.isSet() ? this.toRGB().toHSL() : null;
	};

	/**
	 * Convert to HSLA color
	 * @returns {HSLA}
	 */
	YPbPr.prototype.toHSLA = function () {
		return this.isSet() ? this.toRGB().toHSLA() : null;
	};

	/**
	 * Convert to HSV color
	 * @returns {HSV}
	 */
	YPbPr.prototype.toHSV = function () {
		return this.isSet() ? this.toRGB().toHSV() : null;
	};

	/**
	 * Convert to XYZ color
	 * @returns {XYZ}
	 */
	YPbPr.prototype.toXYZ = function () {
		return this.isSet() ? this.toRGB().toXYZ() : null;
	};

	/**
	 * Convert to xyY color
	 * @returns {xyY}
	 */
	YPbPr.prototype.toxyY = function () {
		return this.isSet() ? this.toRGB().toxyY() : null;
	};

	/**
	 * Convert to CIELab color
	 * @returns {CIELab}
	 */
	YPbPr.prototype.toCIELab = function () {
		return this.isSet() ? this.toRGB().toCIELab() : null;
	};

	/**
	 * Convert to CIELuv color
	 * @returns {CIELuv}
	 */
	YPbPr.prototype.toCIELuv = function () {
		return this.isSet() ? this.toRGB().toCIELuv() : null;
	};

	/**
	 * Convert to HunterLab color
	 * @returns {HunterLab}
	 */
	YPbPr.prototype.toHunterLab = function () {
		return this.isSet() ? this.toRGB().toHunterLab() : null;
	};

	/**
	 * Convert to CMYK color
	 * @returns {CMYK}
	 */
	YPbPr.prototype.toCMYK = function () {
		return this.isSet() ? this.toRGB().toCMYK() : null;
	};

	/**
	 * Convert to YIQ color
	 * @returns {YIQ}
	 */
	YPbPr.prototype.toYIQ = function () {
		return this.isSet() ? this.toRGB().toYIQ() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	YPbPr.prototype.toYUV = function () {
		return this.isSet() ? this.toRGB().toYUV() : null;
	};

	/**
	 * Convert to YUV color
	 * @returns {YUV}
	 */
	YPbPr.prototype.toYDbDr = function () {
		return this.isSet() ? this.toRGB().toYDbDr() : null;
	};

	/**
	 * Convert to YCbCr color
	 * @returns {YCbCr}
	 */
	YPbPr.prototype.toYCbCr = function () {
		return this.isSet() ? this.toRGB().toYCbCr() : null;
	};

	/**
	 * Get a random YPbPr color
	 * @static
	 * @returns {YPbPr}
	 */
	YPbPr.random = function () {
		return RGB.random().toYPbPr();
	};

	/**
	 * Hue color class
	 * @constructor
	 */
	function Hue() {}

	$.Hue = Hue;

	var _2_3rd = 2 / 3;
	var _1_6th = 1 / 6;

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

		if (t < _1_6th) {
			return p + (q - p) * 6 * t;
		}

		if (t < 0.5) {
			return q;
		}

		if (t < _2_3rd) {
			return p + (q - p) * (_2_3rd - t) * 6;
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
			color1 = new RGB(color1);
			color2 = new RGB(color2);

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

		return undefined;
	}

	$.distance = distance;

	/**
	 * Basic color mix functionality
	 * @returns {Object|Null} Mixed color result
	 */
	function mix() {
		var len = arguments.length;

		if (len > 0 && arguments[0]) {
			var type = Color.getType(arguments[0]);

			if (type) {
				if (len > 1) {
					var color = new RGB(arguments[0]);

					if (color !== undefined && color.isSet()) {
						var cur;
						var realLen = 1;

						while (len--) {
							if (arguments[len]) {
								cur = new RGB(arguments[len]);

								if (cur !== undefined && cur.isSet()) {
									color.red += cur.red;
									color.green += cur.green;
									color.blue += cur.blue;

									++realLen;
								}
							}
						}

						if (realLen > 1) {
							color.red = color.red / realLen;
							color.green = color.green / realLen;
							color.blue = color.blue / realLen;

							return Color.toType(color, type);
						}
					}
				}

				return Color.toType(arguments[0], type);
			}
		}

		return null;
	}

	$.mix = mix;

	/**
	 * Randomly mutate a color
	 * @param {Object|String} color Color to mutate
	 * @param {Number} change Rate of change
	 * @returns {Object|Null}
	 */
	function mutate(color, change) {
		if (color && Type.isNumber(change) && change.between(0, 1)) {
			var type = Color.getType(color);

			if (type) {
				color = new RGBA(color);

				// Mutate RGB
				color.mutate(change);

				return Color.toType(color, type);
			}
		}

		return null;
	}

	$.mutate = mutate;

	/**
	 * Alter the "temperature" of a color
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object|Null}
	 */
	function temperature(color, multiplier) {
		if (color && Type.isNumber(multiplier)) {
			var type = Color.getType(color);

			if (type) {
				color = new YIQ(color);
				var temperature = (multiplier * 20000) / 2000;

				if (temperature > 0) {
					temperature *= 2;
				}

				color.I += temperature;
				color.Q -= temperature;

				return Color.toType(color, type);
			}
		}

		return null;
	}

	$.temperature = temperature;

	/**
	 * Alter the "black point" of a color
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object|Null}
	 */
	function blackPoint(color, multiplier) {
		if (color && Type.isNumber(multiplier)) {
			var type = Color.getType(color);

			if (type) {
				color = new YIQ(color);
				color.Y = (1 + multiplier) * color.Y - multiplier;

				return Color.toType(color, type);
			}
		}

		return null;
	}

	$.blackPoint = blackPoint;

	/**
	 * Adjust the saturation of a color
	 * @private
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @param {String} adjustment Option to either saturate or desaturate
	 * @returns {Object|Null}
	 */
	function adjustSaturation(color, multiplier, adjustment) {
		if (color && Type.isNumber(multiplier) && multiplier > 0 && (adjustment === 'saturate' || adjustment === 'desaturate')) {
			var type = Color.getType(color);

			if (type) {
				color = new HSL(color);

				if (color !== undefined && color.isSet()) {
					var saturation = color.saturation;

					saturation += (adjustment === 'saturate' ? 1 : -1) * saturation * multiplier;

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

		return null;
	}

	/**
	 * Saturate a color
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object|Null}
	 */
	function saturate(color, multiplier) {
		return adjustSaturation(color, multiplier, 'saturate');
	}

	$.saturate = saturate;

	/**
	 * Desaturate a color
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object|Null}
	 */
	function desaturate(color, multiplier) {
		return adjustSaturation(color, multiplier, 'desaturate');
	}

	$.desaturate = desaturate;

	/**
	 * Get the grayscale version of a color (fully desaturate)
	 * @param {Object|String} color
	 * @returns {Object|Null}
	 */
	function grayscale(color) {
		return adjustSaturation(color, 1, 'desaturate');
	}

	$.grayscale = grayscale;

	/**
	 * Set the bit depth of the color relative to 24bit
	 * @param {Object|String} color
	 * @param {Number} red
	 * @param {Number} green
	 * @param {Number} blue
	 * @returns {Array|Null}
	 */
	function setColorDepth(color, red, green, blue) {
		if (color && red && Type.isInteger(red) && red > 0) {
			// Get defined color depth
			if (green === undefined && blue === undefined) {
				var depth = Color.depth[red];

				if (depth) {
					red = depth[0];
					green = depth[1];
					blue = depth[2];
				}
			}

			if (Type.isInteger(green) && Type.isInteger(blue) && green > 0 && blue > 0) {
				color = new RGB(color);

				if (color !== undefined && color.isSet()) {
					red = (Math.pow(2, red) - 1) / 255;
					green = (Math.pow(2, green) - 1) / 255;
					blue = (Math.pow(2, blue) - 1) / 255;

					return [Math.round(color.red * red), Math.round(color.green * green), Math.round(color.blue * blue)];
				}
			}
		}

		return null;
	}

	$.setColorDepth = setColorDepth;

	/**
	 * Invert color
	 * @param {Object|String} color
	 * @returns {Object|Null}
	 */
	function invert(color) {
		if (color) {
			var type = Color.getType(color);

			if (type) {
				color = new RGBA(color);

				return Color.toType(new RGBA(255 - color.red, 255 - color.green, 255 - color.blue, color.alpha), type);
			}
		}

		return null;
	}

	$.invert = invert;

	/**
	 * Set color opacity.
	 * @param {Object|String} color
	 * @param {Number} opacity
	 * @param {Object|String} background
	 * @returns {Object|Null}
	 */
	function setOpacity(color, opacity, background) {
		if (color) {
			var type = Color.getType(color);

			if (type) {
				if (opacity && Type.isNumber(opacity) && opacity < 1 && opacity >= 0) {
					if (color instanceof RGBA || color instanceof HSLA) {
						color.alpha = opacity;

						return color;
					} else {
						color = color.toRGBA();
						color.alpha = opacity;
						color = color.toRGB(background);

						return Color.toType(color, type);
					}
				} else if (opacity === 1) {
					return color;
				}
			}
		}

		return null;
	}

	$.setOpacity = setOpacity;

	/**
	 * Adjust color opacity via a multiplier
	 * @private
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @param {Object|String} background
	 * @param {String} adjustment
	 * @returns {Object|Null}
	 */
	function adjustOpacity(color, multiplier, background, adjustment) {
		if (color) {
			var type = Color.getType(color);

			if (type) {
				if ((adjustment === 'increase' || adjustment === 'decrease') && multiplier && Type.isNumber(multiplier) && multiplier > 0) {
					var change;

					if (color instanceof RGBA || color instanceof HSLA) {
						change = color.alpha * multiplier;
						color.alpha += adjustment === 'increase' ? change : -change;

						if (color.alpha > 1) {
							color.alpha = 1;
						} else if (color.alpha < 0) {
							color.alpha = 0;
						}

						return color;
					} else {
						color = new RGBA(color);
						change = color.alpha * multiplier;
						color.alpha += adjustment === 'increase' ? change : -change;

						if (color.alpha > 1) {
							color.alpha = 1;
						} else if (color.alpha < 0) {
							color.alpha = 0;
						}

						color = color.toRGB(background);

						return Color.toType(color, type);
					}
				} else {
					return color;
				}
			}
		}

		return null;
	}

	/**
	 * Increase color opacity via a multiplier
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @param {Object|String} background
	 * @returns {Object|Null}
	 */
	function increaseOpacity(color, multiplier, background) {
		return adjustOpacity(color, multiplier, background, 'increase');
	}

	/**
	 * Decrease color opacity via a multiplier
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @param {Object|String} background
	 * @returns {Object|Null}
	 */
	$.increaseOpacity = increaseOpacity;

	function decreaseOpacity(color, multiplier, background) {
		return adjustOpacity(color, multiplier, background, 'decrease');
	}

	$.decreaseOpacity = decreaseOpacity;

	/**
	 * Basic adjustment of the lightness of a color
	 * @private
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @param {String} adjustment Option to either darken or lighten
	 * @returns {Object|Null}
	 */
	function adjustLightness(color, multiplier, adjustment) {
		if (color && Type.isNumber(multiplier) && (adjustment === 'darken' || adjustment === 'lighten')) {
			var type = Color.getType(color);

			if (type) {
				color = new HSL(color);

				if (color !== undefined && color.isSet()) {
					var change = color.lightness * multiplier;

					color.lightness += adjustment === 'darken' ? -change : change;

					if (color.lightness > 100) {
						color.lightness = 100;
					} else if (color.lightness < 0) {
						color.lightness = 0;
					}

					return Color.toType(color, type);
				}
			}
		}

		return null;
	}

	/**
	 * Darkens a color by a multiplier value, e.g. 0.25 darkens by 25%
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object|Null}
	 */
	function darken(color, multiplier) {
		return adjustLightness(color, multiplier, 'darken');
	}

	$.darken = darken;

	/**
	 * Lightens a color by a multiplier value, e.g. 0.25 lightens by 25%
	 * @param {Object|String} color
	 * @param {Number} multiplier
	 * @returns {Object|Null}
	 */
	function lighten(color, multiplier) {
		return adjustLightness(color, multiplier, 'lighten');
	}

	$.lighten = lighten;

	/**
	 * Produce a gradient between 2 or more colors. If the last argument is a number it is assumed to be the number of steps between colors.
	 * @returns {Array.<Object>|Null} Gradient colors in a array
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
						var last = new RGB(colors[0]);
						var out = [Color.toType(last, type)];
						var realLen = 1;
						var current, changeR, changeG, changeB;

						for (var i = 1; i < colorsLen; ++i) {
							current = new RGB(colors[i]);

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

		return null;
	}

	$.gradient = gradient;

	/**
	 * Shift the color's hue by a give number of degrees
	 * @returns {Object|Array|Null}
	 */
	function shiftHue() {
		var len = arguments.length;

		if (len > 1) {
			var type = Color.getType(arguments[0]);

			if (type) {
				var color = new HSL(arguments[0]);

				if (color !== undefined && color.isSet()) {
					if (len === 2) {
						color.hue = Hue.shift(color.hue, arguments[1]);

						return Color.toType(color, type);
					} else {
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

		return null;
	}

	$.shiftHue = shiftHue;

	/**
	 * Return the complement of the given color
	 * @param {Object|String} color
	 * @returns {Object|Null} complementary color
	 */
	function complement(color) {
		return shiftHue(color, 180);
	}

	$.complement = complement;

	/**
	 * Return the analogous colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function analogous(color) {
		return shiftHue(color, -30, 60);
	}

	$.analogous = analogous;

	/**
	 * Return the split colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function split(color) {
		return shiftHue(color, -150, 300);
	}

	$.split = split;

	/**
	 * Return the triad colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function triad(color) {
		return shiftHue(color, -120, 240);
	}

	$.triad = triad;

	/**
	 * Return the square colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function square(color) {
		return shiftHue(color, 90, 90, 90);
	}

	$.square = square;

	/**
	 * Return the tetradic colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function tetradic(color) {
		return shiftHue(color, 60, 120, 60);
	}

	$.tetradic = tetradic;

	/**
	 * Return the pentadic colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function pentadic(color) {
		return shiftHue(color, 72, 72, 72, 72);
	}

	$.pentadic = pentadic;

	/**
	 * Return the hexadic colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function hexadic(color) {
		return shiftHue(color, 60, 60, 60, 60, 60);
	}

	$.hexadic = hexadic;

	/**
	 * Return the octadic colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function octadic(color) {
		return shiftHue(color, 45, 45, 45, 45, 45, 45, 45);
	}

	$.octadic = octadic;

	/**
	 * Return the decadic colors of the given color
	 * @param {Object|String} color
	 * @returns {Array.<Object>|Null}
	 */
	function decadic(color) {
		return shiftHue(color, 36, 36, 36, 36, 36, 36, 36, 36, 36);
	}

	$.decadic = decadic;

	/**
	 * Perceieved brightness, if value is greater than 125 chose black foreground text, otherwise white
	 * @see http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
	 * @param {Object|String} color
	 * @returns {Number} Range between 0-500
	 */
	function brightness(color) {
		if (color) {
			color = new RGB(color);

			if (color !== undefined && color.isSet()) {
				return (color.red * 299 + color.green * 587 + color.blue * 114) / 1000;
			}
		}

		return undefined;
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
			color1 = new RGB(color1);
			color2 = new RGB(color2);

			if (color1 !== undefined && color2 !== undefined && color1.isSet() && color2.isSet()) {
				return (Math.max(color1.red, color2.red) - Math.min(color1.red, color2.red)) + (Math.max(color1.green, color2.green) - Math.min(color1.green, color2.green)) + (Math.max(color1.blue, color2.blue) - Math.min(color1.blue, color2.blue));
			}
		}

		return undefined;
	}

	$.brightnessDifference = brightnessDifference;

	/**
	 * Select a readable foreground color for the supplied background
	 * @param {Object|String} background Color object / value
	 * @param {Object|String} foreground Color object / value - optional, if not supplied a color complementary to the background will be used
	 * @param {Number} difference
	 * @returns {Object|Null} Foreground color with high readability
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

				background = new HSL(background);
				foreground = new HSL(foreground);

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

		return null;
	}

	$.selectForeground = selectForeground;

	/**
	 * Set the default EM dimension (in pixels)
	 * @param {Number} value Dimension in pixels
	 * @returns {Boolean}
	 */
	function setEmSize(value) {
		if (Type.isNumber(value)) {
			emSize = value;

			return true;
		}

		return false;
	}

	$.setEmSize = setEmSize;

	/**
	 * Set the default unit type
	 * @param {String} unit
	 * @returns {Boolean}
	 */
	function setDefaultUnit(unit) {
		if (unit && validUnits.hasOwnProperty(unit)) {
			defaultUnit = unit;

			return true;
		}

		return false;
	}

	$.setDefaultUnit = setDefaultUnit;

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

		return '';
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
			var type = Color.getType(color);

			if (type && Type.isFunction($[type])) {
				color = new $[type](color);

				var func = 'to' + space;

				if (color[func] !== undefined) {
					return color[func]();
				}
			}
		}

		return null;
	}

	/**
	 * Get the root shade for the given color
	 * @param {Object|String} color
	 * @returns {String}
	 */
	function getShade(color) {
		if (color) {
			color = new HSL(color);

			if (color && color.isSet()) {
				if (Color.isGrayscale(color)) {
					return 'gray';
				} else {
					if (color.hue.between(340, 360) || color.hue.between(0, 10)) {
						return 'red';
					} else if (color.hue.between(10, 30)) {
						return 'orange';
					} else if (color.hue.between(31, 40)) {
						return 'brown';
					} else if (color.hue.between(41, 65)) {
						return 'yellow';
					} else if (color.hue.between(66, 160)) {
						return 'green';
					} else if (color.hue.between(161, 255)) {
						return 'blue';
					} else {
						return 'magenta / purple';
					}
				}
			}
		}

		return null;
	}

	$.getShade = getShade;

	/**
	 * Convert color to its nearest web safe equivalent
	 * @param {Object|String} color
	 * @param {Boolean} disableBias If false include eye sensitivity bias
	 * @returns {Object|String}
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

		return null;
	}

	$.toWebSafe = toWebSafe;

	/**
	 * Convert color to its exact or nearest named equivalent
	 * @param {Object|String} color
	 * @param {Boolean} approximate If true return closest named color
	 * @param {Boolean} disableBias If false include eye sensitivity bias
	 * @returns {String|Object}
	 */
	function toNamed(color, approximate, disableBias) {
		var type = Color.getType(color);

		if (type) {
			color = new Hex(color);

			if (color !== undefined && color.isSet()) {
				var value = color.value.toLowerCase();
				var current, hex;

				if (approximate !== true) {
					for (hex in Color.list) {
						if (!Type.isFunction(Color.list[hex])) {
							current = Color.list[hex];

							if (Type.isArray(current)) {
								current = current[0];
							}

							if (Type.isString(current) && hex === value) {
								return Color.toType('#' + value, type);
							}
						}
					}
				} else {
					var dist = 0;
					var out = null, last = null;

					for (hex in Color.list) {
						if (!Type.isFunction(Color.list[hex])) {
							current = Color.list[hex];

							if (Type.isArray(current)) {
								current = current[0];
							}

							if (Type.isString(current)) {
								if (hex === value) {
									out = '#' + value;

									break;
								} else {
									hex = '#' + hex;
									dist = distance(color, hex, disableBias);

									if (!last || dist < last) {
										out = hex;
										last = dist;
									}
								}
							}
						}
					}

					return Color.toType(out, type);
				}
			}
		}

		return null;
	}

	$.toNamed = toNamed;

	/**
	 * Get array of closely matching colors
	 * @param {Object|String} color
	 * @param {Number} limit
	 * @param {Object<String, String>} colors Color list, e.g. Color.websafe
	 * @param {Boolean} disableBias If false include eye sensitivity bias
	 * @returns {Array<String>}
	 */
	function nearest(color, limit, colors, disableBias) {
		var out = [];

		if (color) {
			color = new Hex(color);

			if (color && color.isSet()) {
				if (limit !== null && !Type.isInteger(limit)) {
					limit = 10;
				}

				if (!colors || !Type.isObject(colors)) {
					colors = Color.listExtended;
				}

				for (var hex in colors) {
					if (colors.hasOwnProperty(hex) && hex !== color.value) {
						out.push(hex);
					}
				}

				out = out.sort(function (a, b) {
					var distA = distance('#' + a, color, disableBias);
					var distB = distance('#' + b, color, disableBias);

					if (distA === distB) {
						return 0;
					}

					return distA - distB;
				});

				if (limit !== null) {
					out = out.slice(0, limit);
				}
			}
		}

		return out;
	}

	$.nearest = nearest;

	/**
	 * Get array of most remotely matching colors
	 * @param {Object|String} color
	 * @param {Number} limit
	 * @param {Object<String, String>} colors Color list, e.g. Color.websafe
	 * @param {Boolean} disableBias If false include eye sensitivity bias
	 * @returns {Array<String>}
	 */
	function distant(color, limit, colors, disableBias) {
		var out = [];
		var _nearest = nearest(color, null, colors, disableBias);

		if (_nearest) {
			out = _nearest.reverse();
		}

		if (limit !== null) {
			out = out.slice(0, limit);
		}

		return out;
	}

	$.distant = distant;

	/**
	 * Convert the matched colors in a string to the given color space
	 * @param {String} space
	 * @returns {String}
	 */
	String.prototype.toColorSpace = function (space) {
		if (space) {
			if (Type.isFunction($[space])) {
				return this.replace(Color.regex.all, function (undefined, contents) {
					return toColorSpace(contents, space);
				});
			}
		}

		return this;
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
		boxShadow: ['-moz-box-shadow', '-webkit-box-shadow', 'box-shadow'],
		transition: ['-webkit-transition', '-moz-transition', '-o-transition', 'transition'],
		transform: ['-webkit-transform', '-moz-transform', '-o-transform', 'transform'],
		transformOrigin: ['-webkit-transform-origin', '-moz-transform-origin', '-o-transform-origin', 'transform-origin'],
		boxSizing: ['-webkit-box-sizing', '-moz-box-sizing']
	};

	/**
	 * Color values which have CSS representations, e.g. rgb(12, 34, 56)
	 * @constant
	 * @type {Object.<String, Boolean>}
	 */
	CSS.colorTypes = {
		RGB: true,
		RGBA: true,
		Hex: true,
		HSL: true,
		HSLA: true
	};

	/**
	 * Return the named property with the supplied value
	 * @private
	 * @param {String} property
	 * @param {String|Number} value
	 * @returns {Object}
	 */
	function getProperty(property, value) {
		var out = {};

		if (property && value && CSS.properties.hasOwnProperty(property)) {
			var len = CSS.properties[property].length;

			for (var i = 0; i < len; ++i) {
				out[CSS.properties[property][i]] = value;
			}
		}

		return out;
	}

	/**
	 * Returns cross browser transition properties
	 * @param {String} transition
	 * @returns {Object|Null}
	 */
	CSS.transition = function (transition) {
		return getProperty('transition', transition);
	};

	/**
	 * Returns cross browser transform properties
	 * @param {String} transform
	 * @returns {Object|Null}
	 */
	CSS.transform = function (transform) {
		return getProperty('transform', transform);
	};

	/**
	 * Returns cross browser transform-origin properties
	 * @param {String} transformOrigin
	 * @returns {Object|Null}
	 */
	CSS.transformOrigin = function (transformOrigin) {
		return getProperty('transformOrigin', transformOrigin);
	};

	/**
	 * Returns cross browser box-sizing properties
	 * @param {String} boxSizing
	 * @returns {Object|Null}
	 */
	CSS.boxSizing = function (boxSizing) {
		return getProperty('boxSizing', boxSizing);
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
		var out = {};

		if (topLeft && (!bottomLeft && !bottomRight && !topRight)) {
			var len = CSS.properties.borderRadius.length;

			if (Type.isNumber(topLeft)) {
				topLeft += defaultUnit;
			}

			for (var i = 0; i < len; ++i) {
				out[CSS.properties.borderRadius[i]] = topLeft;
			}
		} else if (topLeft || bottomLeft || bottomRight || topRight) {
			if (topLeft) {
				if (Type.isNumber(topLeft)) {
					topLeft += defaultUnit;
				}

				out.extend(getProperty('borderRadiusTopLeft', topLeft));
			}

			if (bottomLeft) {
				if (Type.isNumber(bottomLeft)) {
					bottomLeft += defaultUnit;
				}

				out.extend(getProperty('borderRadiusBottomLeft', bottomLeft));
			}

			if (bottomRight) {
				if (Type.isNumber(bottomRight)) {
					bottomRight += defaultUnit;
				}

				out.extend(getProperty('borderRadiusBottomRight', bottomRight));
			}

			if (topRight) {
				if (Type.isNumber(topRight)) {
					topRight += defaultUnit;
				}

				out.extend(getProperty('borderRadiusTopRight', topRight));
			}
		}

		return out;
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
						if (Type.isScalar(arguments[i]) || Color.isValidCSS(arguments[i])) {
							propertyValue += ', ' + arguments[i];
						}
					}

					for (i = 0; i < properties.length; ++i) {
						out.push(properties[i] + '(' + position + propertyValue + ')');
					}
				} else {
					var shape = arguments[2];

					for (i = 3; i < arguments.length; ++i) {
						if (Type.isScalar(arguments[i]) || Color.isValidCSS(arguments[i])) {
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

		return {};
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
				horizontalLength += defaultUnit;
			}

			value.push(horizontalLength);

			if (!verticalLength) {
				verticalLength = 0;
			} else if (Type.isNumber(verticalLength)) {
				verticalLength += defaultUnit;
			}

			value.push(verticalLength);

			if (blurRadius) {
				if (Type.isNumber(blurRadius)) {
					blurRadius += defaultUnit;
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

		return {};
	};

	/**
	 * Get CSS box shadow for specified argument values
	 * @param {String|Number} horizontalLength
	 * @param {String|Number} verticalLength
	 * @param {String|Number} blurRadius
	 * @param {String|Number} spread
	 * @param {Object|Number} color
	 * @param {String} set
	 * @returns {Object}
	 */
	CSS.boxShadow = function (horizontalLength, verticalLength, blurRadius, spread, color, set) {
		var out = {};

		if (horizontalLength !== undefined && verticalLength !== undefined) {
			var value = [];

			if (!horizontalLength) {
				horizontalLength = 0;
			} else if (Type.isNumber(horizontalLength)) {
				horizontalLength += defaultUnit;
			}

			value.push(horizontalLength);

			if (!verticalLength) {
				verticalLength = 0;
			} else if (Type.isNumber(verticalLength)) {
				verticalLength += defaultUnit;
			}

			value.push(verticalLength);

			if (blurRadius) {
				if (Type.isNumber(blurRadius)) {
					blurRadius += defaultUnit;
				}

				value.push(blurRadius);
			}

			if (spread) {
				if (Type.isNumber(spread)) {
					spread += defaultUnit;
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

			for (var i = 0; i < CSS.properties.boxShadow.length; ++i) {
				out[CSS.properties.boxShadow[i]] = value;
			}
		}

		return out;
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
})(this);