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

	var Styles = [];
	var emSize = 16;
	var CSSColorTypes = ['Hex', 'RGB', 'HSL'];
	var Properties = {
		borderRadius: ['-webkit-border-radius', '-moz-border-radius', 'border-radius'],
		borderTopLeft: ['-webkit-border-top-left-radius', '-moz-border-radius-topleft', 'border-top-left-radius'],
		borderBottomLeft: ['-webkit-border-bottom-left-radius', '-moz-border-radius-bottomleft', 'border-bottom-left-radius'],
		borderBottomRight: ['-webkit-border-bottom-right-radius', '-moz-border-radius-bottomright', 'border-bottom-right-radius'],
		borderTopRight: ['-webkit-border-top-right-radius', '-moz-border-radius-topright', 'border-top-right-radius']
	};

	/**
	* Type checking functionality
	*/
	function isString(value) {
		return typeof value === 'string';
	}

	function isNumber(value, disableTypesafe) {
		return typeof value === 'number' || (disableTypesafe === true && !isNaN(value));
	}

	function isObject(value) {
		return value instanceof Object;
	}

	function isArray(value) {
		return value instanceof Array;
	}

	function isFunction(value) {
		return typeof value === 'function';
	}

	function empty(value) {
		return (value === undefined || value === null) || (isString(value) && value === '') || (isArray(value) && value.length === 0);
	}

	/**
	* Number Prototypes
	*/
	Number.prototype.between = function (min, max) {
		return this >= min && this <= max;
	};

	Number.prototype.round = function (decimalPlaces) {
		var multiplier = parseInt('1'.padRight('0', decimalPlaces + 1), 10);

		return Math.round(this * multiplier) / multiplier;
	};

	/**
	* String Prototypes
	*/
	String.prototype.toStyle = function () {
		Styles.push(this);
	};

	String.prototype.trim = function () {
		return this.replace(/^[\s]+|[\s]+$/, '');
	};

	String.prototype.pad = function (character, length, direction) {
		var out = this;

		if (this.length < length && character.length === 1 && (direction === undefined || direction === 'left' || direction === 'right')) {
			var count = length - this.length;

			if (!direction || direction === 'right') {
				while (count--) {
					out += character;
				}
			} else {
				while (count--) {
					out = character + out;
				}
			}
		}

		return out;
	};

	String.prototype.padRight = function (character, length) {
		return this.pad(character, length, 'right');
	};

	String.prototype.padLeft = function (character, length) {
		return this.pad(character, length, 'left');
	};

	String.prototype.isHex = function () {
		return /^([0-9a-f]+)$/i.test(this);
	};

	/**
	* Array Prototypes
	*/
	Array.prototype.unique = function () {
		var assoc = {}, out = [], len = this.length;

		while (len--) {
			if (this[len] in assoc) {
				continue;
			}

			out.push(this[len]);

			assoc[this[len]] = true;
		}

		return out;
	};

	Array.prototype.max = function () {
		return Math.max.apply(Math, this);
	};

	Array.prototype.min = function () {
		return Math.min.apply(Math, this);
	};

	Array.prototype.sum = function (disableTypeSafe) {
		var total = 0;

		if (this.length > 0) {
			for (var i in this) {
				if (isNumber(this[i], disableTypeSafe)) {
					total += this[i];
				}
			}
		}

		return total;
	};

	Array.prototype.contains = function (value, disableTypeSafe) {
		var i = this.length;

		if (disableTypeSafe !== true) {
			while (i--) {
				if (this[i] === value) {
					return true;
				}
			}
		} else {
			while (i--) {
				if (this[i] == value) {
					return true;
				}
			}
		}

		return false;
	};

	/**
	* Object Prototypes
	*/
	Object.prototype.extend = function (obj, override) {
		if (obj) {
			var property;

			if (override) {
				for (property in obj) {
					this[property] = obj[property];
				}
			} else {
				for (property in obj) {
					if (this[property]) {
						if (isArray(this[property])) {
							this[property].push(obj[property]);

							this[property] = this[property].unique();
						} else if (!isFunction(this[property])) {
							if (isArray(obj[property])) {
								this[property] = [this[property]].concat(obj[property]).unique();
							} else {
								this[property] = obj[property];
							}
						}
					} else {
						this[property] = obj[property];
					}
				}
			}
		}

		return this;
	};

	Object.prototype.sum = function (multidimensional) {
		var total = 0;

		for (var i in this) {
			if (isNumber(this[i])) {
				total += this[i];
			} else if (isArray(this[i]) || (multidimensional === true && isObject(this[i]))) {
				total += this[i].sum();
			}
		}

		return total;
	};

	/**
	* Retain the JSS object, but disable in CSS output
	*/
	Object.prototype.disable = function () {
		return null;
	};

	/**
	* Wraps object in Style class
	*/
	Object.prototype.toStyle = function () {
		return new Style(this);
	};

	Object.prototype.stringify = function () {
		var out = [];

		for (var i in this) {
			if (!isFunction(this[i])) {
				out.push(i + ': ' + this[i]);
			}
		}

		if (out.length > 0) {
			return out.join("\n");
		}

		return '';
	};

	Object.prototype.getType = function () {
		var result = /function (.+)\(/.exec(this.constructor);

		if (result && result.length > 1) {
			return result[1];
		}
	};

	function getType(value, disableTypesafe) {
		if (value !== undefined && value !== null) {
			if (isNumber(value, disableTypesafe)) {
				return 'number';
			} else if (isString(value)) {
				return 'string';
			} else if (isArray(value)) {
				return 'array';
			} else if (isFunction(value)) {
				return 'function';
			} else if (typeof value === 'object') {
				return value.getType() || 'object';
			}
		}
	}

	$.Color = {};
	Color.NAMED = 'Named';
	Color.HEX = 'Hex';
	Color.RGB = 'RGB';
	Color.RGBA = 'RGBA';
	Color.HSL = 'HSL';
	Color.HSV = 'HSV';
	Color.XYZ = 'XYZ';
	Color.CIELAB = 'CIELab';
	Color.types = [];

	for (var i in Color) {
		if (isString(Color[i])) {
			Color.types.push(Color[i]);
		}
	}

	Color.regex = {};
	Color.regex.hex = /^\s*#[a-f0-9]{3,6}\s*$/i;
	Color.regex.RGB = /^\s*rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i;
	Color.regex.RGBA = /^\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*(\d+)\s*\)\s*$/i;
	Color.regex.HSL = /^\s*hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/i;
	Color.regex.all = /(#[a-f0-9]{3,6}|rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)|rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*(\d+)\s*\)|hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\))/gi;
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

	Color.getNamedList = function (websafe) {
		var list = !websafe ? this.list : this.webSafe;
		var out = {};
		var i = 0
		var len;

		for (var hex in list) {
			if (isString(list[hex])) {
				out[list[hex]] = hex;
			} else if (isArray(list[hex])) {
				len = list[hex].length;

				for (i = 0; i < len; ++i) {
					out[list[hex][i]] = hex;
				}
			}
		}

		return out;
	};

	Color.listNamed = Color.getNamedList();
	Color.webSafeNamed = Color.getNamedList(true);

	Color.getType = function (color) {
		if (isString(color)) {
			switch (true) {
				case !empty(Color.listNamed[color.toLowerCase()]):
					return this.NAMED;

				case this.regex.hex.test(color):
					return this.HEX;

				case this.regex.RGB.test(color):
					return this.RGB;

				case this.regex.RGBA.test(color):
					return this.RGBA;

				case this.regex.HSL.test(color):
					return this.HSL;
			}
		} else {
			var type = getType(color);

			if (type !== undefined && this[type.toUpperCase()]) {
				return type;
			}
		}
	};

	Color.toType = function (value, type) {
		switch (type) {
			case Color.NAMED:
				value = value.toLowerCase().substr(1);

				return !empty(Color.list[value]) ? Color.list[value] : undefined;

			case Color.HEX:
			case Color.RGB:
			case Color.RGBA:
			case Color.HSL:
			case Color.HSV:
			case Color.XYZ:
			case Color.CIELAB:
				return $['to' + type](value);
		}
	};

	Color.equals = function (color1, color2) {
		color1 = toHex(color1);
		color2 = toHex(color2);

		if (color1 !== undefined && color2 !== undefined && color1.isSet() && color2.isSet()) {
			return color1.value === color2.value;
		}
	};

	/**
	* Global toCSS function to "compile" global Styles to CSS
	*/
	$.toCSS = function () {
		var len = Styles.length, CSS = '';

		if (len > 0) {
			for (var i = 0; i < len; ++i) {
				CSS += '\n\n' + Styles[i];
			}

			return CSS.substr(2);
		}

		return '';
	};

	/**
	* Style class
	*/
	$.Style = function (obj) {
		if (this === undefined) {
			return new Style(obj);
		}

		this.self = obj;

		Styles.push(this);
	}

	Style.prototype.compile = function (obj, output, parent, child) {
		if (isString(this.self)) {
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
				this.compileObject(obj[i], output, i);
			}
		}

		// Child definition
		else {
			this.compileObject(obj, output, parent, child);
		}

		return output;
	};

	Style.prototype.compileObject = function (obj, output, parent, child) {
		var compile = false;

		if (child !== undefined) {
			if (isString(child)) {
				var len = child.length - 1;
				var firstChar = child.charAt(0);
				var lastChar = child.charAt(len);

				if (!(firstChar === '$' && lastChar === '$')) {
					if (lastChar != '$') {
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
			for (var x in obj) {
				if (!output[parent]) {
					output[parent] = [];
				}

				var type = typeof obj[x];

				if (type !== 'function') {
					if (type === 'string' || type === 'number') {
						output[parent].push(x.replace(/\_/g, '-') + ": " + obj[x]);
					}

					else if (isArray(obj[x])) {
						for (var y in obj[x]) {
							if (!isFunction(obj[x][y])) {
								output[parent].push(x.replace(/\_/g, '-') + ": " + obj[x][y]);
							}
						}
					}

					else if (isProperty(obj[x])) {
						output[parent] = output[parent].concat(obj[x].compile(x.replace(/\_/g, '-')));
					}

					else if (isObject(obj[x])) {
						this.compile(obj[x], output, parent, x);
					}
				}
			}
		}
	};

	/**
	* Convert this style object to CSS
	*/
	Style.prototype.toCSS = function () {
		var CSS = '';

		// Compile
		var obj = this.compile();

		if (isObject(obj)) {
			for (var definition in obj) {
				if (!isFunction(obj[definition])) {
					// Must contain properties
					if (obj[definition].length > 0) {
						// Convert simple object to string
						CSS += "\n\n" + definition + " {\n\t" + obj[definition].join(";\n\t") + "\n}";
					}
				}
			}

			return CSS.length > 0 ? CSS.substr(2) : '';
		} else if (isString(obj)) {
			return obj;
		}
	};

	Style.prototype.toString = function () {
		return this.toCSS();
	};

	function Property(obj) {
		if (this === undefined) {
			return new Property(obj);
		}

		this.self = obj;
	}

	Property.prototype.compile = function (name) {
		var type;
		var out = [];

		if (!empty(name) && isObject(this.self)) {
			for (var x in this.self) {
				if (isString(this.self[x])) {
					out.push(name + '-' + x + ': ' + this.self[x]);
				} else if (isArray(this.self[x])) {
					for (var y in this.self[x]) {
						type = typeof this.self[x][y];

						if (type === 'string' || type === 'number') {
							// Push CSS property
							out.push(name + '-' + x + ': ' + this.self[x][y]);
						}
					}
				}
			}
		}

		return out;
	};

	$.Property = Property;

	function isProperty(value) {
		return value instanceof Property;
	}

	/**
	* RGB color functionality
	*/
	function RGB(red, green, blue) {
		this.red = null;
		this.green = null;
		this.blue = null;

		if (red !== undefined && ((green === undefined && blue === undefined) || (isNumber(green) && isNumber(blue)))) {
			if (green === undefined) {
				if (isObject(red) && red instanceof this.constructor) {
					this.red = red.red;
					this.green = red.green;
					this.blue = red.blue;
				} else if (isString(red)) {
					var parts = Color.regex.RGB.exec(red);

					if (parts) {
						this.red = Math.round(parts[1]);
						this.green = Math.round(parts[2]);
						this.blue = Math.round(parts[3]);
					}
				} else {
					return toRGB(red);
				}
			} else if (isNumber(red)) {
				this.red = red;
				this.green = green;
				this.blue = blue;
			}
		}
	}

	RGB.prototype.isSet = function () {
		return isNumber(this.red) && isNumber(this.green) && isNumber(this.blue);
	};

	RGB.prototype.toHex = function () {
		if (this.isSet()) {
			return new Hex('#' + (1 << 24 | this.red << 16 | this.green << 8 | this.blue).toString(16).substr(1));
		}
	};

	RGB.prototype.toRGBA = function () {
		if (this.isSet()) {
			return new RGBA(this.red, this.green, this.blue, 1);
		}
	};

	RGB.prototype.toHSL = function () {
		if (this.isSet()) {
			var red = this.red / 255;
			var green = this.green / 255;
			var blue = this.blue / 255;

			var max = Math.max(red, green, blue), min = Math.min(red, green, blue);
			var hue = 0, saturation, lightness = (max + min) / 2;

			if (max == min) {
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

	RGB.prototype.toHSV = function () {
		if (this.isSet()) {
			var hue = null, saturation = null;
			var max = Math.max(this.red, this.green, this.blue);
			var diff = max - Math.min(this.red, this.green, this.blue);

			saturation = (max == 0) ? 0 : (100 * diff / max);

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

	RGB.prototype.toCSS = function () {
		if (this.isSet()) {
			return 'rgb(' + Math.round(this.red) + ', ' + Math.round(this.green) + ', ' + Math.round(this.blue) + ')';
		}
	};

	RGB.prototype.toString = function () {
		return this.toCSS();
	};

	RGB.random = function () {
		return new RGB(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
	};

	$.RGB = RGB;

	/**
	* Hex color functionality
	*/
	function Hex(hex) {
		this.value = null;

		if (isString(hex)) {
			this.setValue(hex);
		} else if (getType(hex) === 'Hex') {
			this.setValue(hex.value);
		}
	}

	Hex.prototype.isSet = function () {
		return !empty(this.value);
	};

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

	Hex.prototype.toRGB = function () {
		if (this.value) {
			return new RGB(parseInt(this.value.substring(0, 2), 16), parseInt(this.value.substring(2, 4), 16), parseInt(this.value.substring(4, 6), 16));
		}
	};

	Hex.prototype.toHSL = function () {
		if (this.value) {
			return this.toRGB().toHSL();
		}
	};

	Hex.prototype.toHSV = function () {
		if (this.value) {
			return this.toRGB().toHSV();
		}
	};

	Hex.prototype.toCSS = function () {
		if (!empty(this.value)) {
			return '#' + this.value;
		}
	};

	Hex.prototype.toString = function () {
		return this.toCSS();
	};

	Hex.isValid = function (hex) {
		if (hex) {
			if (hex.charAt(0) === '#') {
				hex = hex.substring(1);
			}

			return hex.isHex() && (hex.length === 3 || hex.length === 6);
		}

		return false;
	};

	Hex.isTriplet = function (hex) {
		return hex && hex.length === 3;
	};

	Hex.expand = function (hex) {
		if (Hex.isTriplet(hex)) {
			var c = hex.split('');

			return c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
		}

		return hex;
	};

	Hex.random = function () {
		return RGB.random().toHex();
	};

	$.Hex = Hex;

	function HSL(hue, saturation, lightness) {
		this.hue = null;
		this.saturation = null;
		this.lightness = null;

		if (isNumber(hue) && isNumber(saturation) && isNumber(lightness)) {
			this.hue = hue;
			this.saturation = saturation;
			this.lightness = lightness;
		} else if (isObject(hue)) {
			if (hue instanceof this.constructor) {
				this.hue = hue.hue;
				this.saturation = hue.saturation;
				this.lightness = hue.lightness;
			} else {
				return toHSL(hue);
			}
		}
	}

	HSL.prototype.isSet = function () {
		return isNumber(this.hue) && isNumber(this.saturation) && isNumber(this.lightness);
	};

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
	};

	HSL.prototype.toHex = function () {
		if (this.isSet()) {
			return this.toRGB().toHex();
		}
	};

	HSL.prototype.toHSV = function () {
		if (this.isSet()) {
			return this.toRGB().toHSV();
		}
	};

	HSL.prototype.toCSS = function () {
		if (this.isSet()) {
			return 'hsl(' + Math.round(this.hue) + ', ' + Math.round(this.saturation) + '%, ' + Math.round(this.lightness) + '%)';
		}
	};

	HSL.prototype.toString = function () {
		return this.toCSS();
	};

	HSL.random = function () {
		return RGB.random().toHSL();
	};

	$.HSL = HSL;

	function HSV(hue, saturation, value) {
		this.hue = null;
		this.saturation = null;
		this.value = null;

		if (isNumber(hue) && isNumber(saturation) && isNumber(value)) {
			this.hue = hue;
			this.saturation = saturation;
			this.value = value;
		} else if (isObject(hue)) {
			if (hue instanceof this.constructor) {
				this.hue = hue.hue;
				this.saturation = hue.saturation;
				this.value = hue.value;
			} else {
				return toHSV(hue);
			}
		}
	}

	HSV.prototype.isSet = function () {
		return isNumber(this.hue) && isNumber(this.saturation) && isNumber(this.value);
	};

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

	HSV.prototype.toHex = function () {
		if (this.isSet()) {
			return this.toRGB().toHex();
		}
	};

	HSV.prototype.toHSL = function () {
		if (this.isSet()) {
			return this.toRGB().toHSL();
		}
	};

	HSV.random = function () {
		return RGB.random().toHSV();
	};

	$.HSV = HSV;

	function XYZ(X, Y, Z) {
		this.X = null;
		this.Y = null;
		this.Z = null;

		if (isNumber(X) && isNumber(Y) && isNumber(Z)) {
			this.X = X;
			this.Y = Y;
			this.Z = Z;
		} else if (isObject(X)) {
			if (X instanceof this.constructor) {
				this.X = X.X;
				this.Y = X.Y;
				this.Z = X.Z;
			} else {
				return toXYZ(X);
			}
		}
	}

	XYZ.prototype.isSet = function () {
		return isNumber(this.X) && isNumber(this.Y) && isNumber(this.Z);
	};

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

	XYZ.prototype.toHex = function () {
		if (this.isSet()) {
			return this.toRGB().toHex();
		}
	};

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

	$.XYZ = XYZ;

	function CIELab(L, a, b) {
		this.L = null;
		this.a = null;
		this.b = null;

		if (isNumber(L) && isNumber(a) && isNumber(b)) {
			this.L = L;
			this.a = a;
			this.b = b;
		} else if (isObject(L)) {
			if (L instanceof this.constructor) {
				this.L = L.L;
				this.a = L.a;
				this.b = L.b;
			} else {
				return toCIELab(L);
			}
		}
	}

	CIELab.prototype.isSet = function () {
		return isNumber(this.L) && isNumber(this.a) && isNumber(this.b);
	};

	CIELab.prototype.toRBG = function () {
		if (this.isSet()) {
			return this.toXYZ().toRBG();
		}
	};

	CIELab.prototype.toHex = function () {
		if (this.isSet()) {
			return this.toXYZ().toRBG().toHex();
		}
	};

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

	$.CIELab = CIELab;

	$.Hue = function () {
	}

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
	*/
	$.distance = function (color1, color2, disableBias) {
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
	};

	$.mix = function () {
		var len = arguments.length;

		if (len > 0) {
			var type = Color.getType(arguments[0]);

			if (type) {
				if (len > 1) {
					var color = toRGB(arguments[0]);

					if (color !== undefined && color.isSet()) {
						var cur;
						var realLen = 1;

						while (len--) {
							cur = toRGB(arguments[len]);

							if (cur !== undefined && cur.isSet()) {
								color.red += cur.red;
								color.green += cur.green;
								color.blue += cur.blue;

								++realLen;
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
	};

	$.mutate = function (color, change) {
		var type = Color.getType(color);

		if (type && isNumber(change) && change.between(0, 1)) {
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
	};

	$.adjustSaturation = function (color, multiplier, adjustment) {
		var type = Color.getType(color);

		if (type && isNumber(multiplier) && ['saturate', 'desaturate'].contains(adjustment)) {
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
	};

	$.saturate = function (color, multiplier) {
		return adjustSaturation(color, multiplier, 'saturate');
	};

	$.desaturate = function (color, multiplier) {
		return adjustSaturation(color, multiplier, 'desaturate');
	};

	$.grayscale = function (color) {
		return adjustSaturation(color, 1, 'desaturate');
	};

	/**
	* Basic adjustment of the lightness of a color
	*/
	function adjustLightness(color, multiplier, adjustment) {
		var type = Color.getType(color);

		if (type && isNumber(multiplier) && ['darken', 'lighten'].contains(adjustment)) {
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

	/**
	* Darkens a color by a multiplier value, e.g. 0.25 darkens by 25%
	*/
	$.darken = function (color, multiplier) {
		return adjustLightness(color, multiplier, 'darken');
	};

	/**
	* Lightens a color by a multiplier value, e.g. 0.25 lightens by 25%
	*/
	$.lighten = function (color, multiplier) {
		return adjustLightness(color, multiplier, 'lighten');
	};

	$.gradient = function () {
		var len = arguments.length;

		if (len > 1) {
			var fromArray = isArray(arguments[0]);
			var colors = fromArray ? arguments[0] : arguments;
			var colorsLen = colors.length;

			if (colorsLen > 1) {
				var type = Color.getType(colors[0]);

				if (type) {
					var steps = 4; // Original color + 4 = 5
					var count = len - 1;

					if (isNumber(arguments[count])) {
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
	};

	$.shiftHue = function () {
		var len = arguments.length;

		if (len > 1) {
			var color = arguments[0];
			var type = Color.getType(color);

			if (type) {
				color = toHSL(color);

				if (color !== undefined && color.isSet()) {
					var out = [];

					for (var i = 1; i < len; ++i) {
						if (isNumber(arguments[i])) {
							color.hue = Hue.shift(color.hue, arguments[i]);

							out.push(Color.toType(color, type));
						}
					}

					return out;
				}
			}
		}
	};

	$.complement = function (color) {
		color = shiftHue(color, 180);

		if (!empty(color)) {
			return color[0];
		}
	};

	$.analogous = function (color) {
		return shiftHue(color, -30, 60);
	};

	$.split = function (color) {
		return shiftHue(color, -150, 300);
	};

	$.triad = function (color) {
		return shiftHue(color, -120, 240);
	};

	$.square = function (color) {
		return shiftHue(color, 90, 90, 90);
	};

	$.tetradic = function (color) {
		return shiftHue(color, 60, 120, 60);
	};

	$.setEmSize = function (value) {
		if (isNumber(value)) {
			emSize = value;
		}
	};

	function expressionMatch(match, contents, offset, s) {
		return contents * emSize;
	}

	$.calculate = function (expression) {
		if (isNumber(emSize)) {
			var result = eval(expression.replace(/([0-9]+(\.[0-9]+)?)em/gi, expressionMatch).replace(/([0-9]+(\.[0-9]+)?)px/gi, '$1'));

			if (isNumber(result)) {
				return Math.round(result) + 'px';
			}
		}
	};

	/**
	* CSS3-like calc()
	*/
	$.calc = function (expression) {
		return calculate(expression);
	};

	function getProperty(property, value) {
		var out = {};
		var len = Properties[property].length;

		for (var i = 0; i < len; ++i) {
			out[Properties[property][i]] = value;
		}

		return out;
	}

	$.borderRadius = function (topLeft, bottomLeft, bottomRight, topRight) {
		if (topLeft && (!bottomLeft && !bottomRight && !topRight)) {
			var len = Properties.borderRadius.length;
			var out = {};

			for (var i = 0; i < len; ++i) {
				out[Properties.borderRadius[i]] = topLeft;
			}

			return out;
		} else if (topLeft || bottomLeft || bottomRight || topRight) {
			var out = {};

			if (topLeft) {
				out.extend(getProperty('borderTopLeft', topLeft));
			}

			if (bottomLeft) {
				out.extend(getProperty('borderBottomLeft', bottomLeft));
			}

			if (bottomRight) {
				out.extend(getProperty('borderBottomRight', bottomRight));
			}

			if (topRight) {
				out.extend(getProperty('borderTopRight', topRight));
			}

			return out;
		}
	};

	$.toColorSpace = function (color, space) {
		var type = Color.getType(color);

		if (type && space) {
			var func = 'to' + space;

			color = new $[type](color);

			if (isFunction(color[func])) {
				return color[func]();
			}
		}
	};

	/**
	 * Dynamically add 'toSpace' methods
	 */
	for (var i in Color.types) {
		var type = Color.types[i];

		if (isString(type)) {
			$['to' + type] = new Function('color', 'return toColorSpace(color, \'' + type + '\');');
		}
	}

	/**
	* Convert color to its nearest web safe equivalent
	*/
	$.toWebSafe = function (color, disableBias) {
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
					if (isString(Color.webSafe[hex])) {
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
	};

	/**
	* Convert color to its exact or nearest named equivalent
	*/
	$.toNamed = function (color, approximate, disableBias) {
		color = toHex(color);

		if (color !== undefined && color.isSet()) {
			var value = '#' + color.getValue().toLowerCase();
			var current;
			var hex

			if (approximate !== true) {
				for (hex in Color.list) {
					current = Color.list[hex];

					if (isArray(current)) {
						current = current[0];
					}

					if (isString(current) && hex === value) {
						return current;
					}
				}
			} else {
				var dist = 0;
				var out = undefined, last = null;

				for (hex in Color.list) {
					current = Color.list[hex];

					if (isArray(current)) {
						current = current[0];
					}

					if (isString(current)) {
						if (hex === value) {
							return current;
						} else {
							dist = distance(color, hex, disableBias);

							if (last === null || dist < last) {
								out = current;
								last = dist;
							}
						}
					}
				}

				return out;
			}
		}
	};

	/**
	 * Functionality to extract CSS color values from strings / arrays / objects and convert them as desired
	 */
	String.prototype.toColorSpace = function (space) {
		return this.replace(Color.regex.all, function (undefined, contents) {
			return $['to' + space](contents);
		});
	};

	Object.prototype.toColorSpace = function (space) {
		var out = {};
		var func = 'to' + space;

		for (var i in this) {
			out[i] = isString(this[i]) || isArray(this[i]) ? this[i][func]() : this[i];
		}

		return out;
	};

	Array.prototype.toColorSpace = function (space) {
		var out = [];
		var func = 'to' + space;

		for (var i in this) {
			out.push(isString(this[i]) ? this[i][func]() : this[i]);
		}

		return out;
	};

	/**
	 * Dynamically add String.prototype.'toSpace' methods
	 */
	for (var i in CSSColorTypes) {
		var type = CSSColorTypes[i];
		var content = 'return this.toColorSpace(\'' + type + '\');';

		if (isString(type)) {
			var func = 'to' + type;

			String.prototype[func] = new Function(content);
			Array.prototype[func] = new Function(content);
			Object.prototype[func] = new Function(content);
		}
	}

	/**
	* TODO: IMPROVE
	* Very basic CSS "parsing", very easy to break...
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

				if (parts !== null && !empty(parts[1]) && !empty(parts[2])) {
					properties = parts[2].split(/\s*;\s*/m);
					propertiesLen = properties.length;

					if (propertiesLen > 0) {
						for (var x = 0; x < propertiesLen; ++x) {
							if (!empty(properties[x])) {
								property = properties[x].split(/\s*:\s*/m);

								if (property.length === 2 && !empty(property[0]) && !empty(property[1])) {
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