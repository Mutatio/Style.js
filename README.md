# Style.js

An easy to use JavaScript library providing CSS preprocessing and a myriad of color manipulation functions.

## CSS Preprocessing

Style.js allows developers to utilize the full power of JavaScript to generate CSS.

### Example

    var color = '#06c';

    new Style({
        p: {
            background_color: color.toHSLA(),
            color: selectForeground(color).toHSLA()
        }.extend(
            CSS.borderRadius(Math.floor(Math.random() * 11) + 0)
        )
    });

*Alternative syntax*:

    var color = '#06c';

    ({
        p: {
            background_color: color.toHSLA(),
            color: selectForeground(color).toHSLA()
        }.extend(
            CSS.borderRadius(Math.floor(Math.random() * 11) + 0)
        )
    }.toStyle());

Result:

    p {
        background-color: hsla(210, 100%, 40%, 1);
        color: hsla(30, 100%, 85%, 1);
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px
    }

Any valid JavaScript code should work. It's easy to mix in your own functionality:

	// Returns a random color with a high red value, as a hex color code
    function getRandomRedColor() {
		// Generate random RGB color
		var out = RGB.random();

		// Minimum red value of 180
		while (out.red < 180) {
			out = RGB.random();
		}

		// Convert to HSL color space
		out = new HSL(out);

		// Adjust the lightness of the color, note: this might reduce the red value
		out.lightness = 45;

		// Return as hexidecimal
		return out.toHex();
	}

    new Style({
        '.randomRed': {
            background_color: getRandomRedColor(),
            color: '#fff'
        }
    });

Result:

    .randomRed {
        background-color: #bd4028;
        color: #fff
    }

### Nested Styles

Example:

    new Style({
        html: {
            body: {
                header: {
                    div: {
                        ul: {
                            li: {
                                p: {
                                    color: new RGBA(new Hex('#666')),

                                    'a, strong': {
                                        font_weight: 'bold'
                                    }
                                }
                            }
                        }
                    }
                },

                footer: {
                    'background-color': new HSL(new Hex('#ccc'))
                }
            }
        }
    });

Result:

    html body header div ul li p {
        color: rgba(102, 102, 102, 1)
    }

    html body header div ul li p a, html body header div ul li p strong {
        font-weight: bold
    }

    html body footer {
        background-color: hsl(0, 0%, 80%)
    }