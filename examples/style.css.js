var pageStyle = (function () {
	var bg = HSL.random();

	bg.lightness = 35;

	var bgHex = bg.toHex();
	var bgDark = darken(bgHex, .2).toString();
	var colors = square(bgHex);
	var bgComp = complement(bgHex);
	var border = CSS.borderRadius('5px');
	var center = {
		margin: '0 auto',
		width: '900px'
	};

	bg.lightness = 85;
	bg = bg.toHex();

	function button(backgroundColor, foregroundColor) {
		backgroundColor = new Hex(backgroundColor);
		foregroundColor = new Hex(foregroundColor);

		var dark = darken(backgroundColor, .35).toString();

		return {
			font_size: '36px',
			font_family: 'Sans',
			background_color: backgroundColor,
			//border: dark + ' 1px solid',
			color: selectForeground(backgroundColor, foregroundColor, 45).toString(),
			padding: '5px 10px 7px'
		}.extend(
			CSS.borderRadius('20px'),
			CSS.radialGradient('top', dark, backgroundColor.toString()),
			CSS.boxShadow(1, 1, 1, 2, darken(dark, .3)),
			CSS.textShadow(2, 2, 1, darken(dark, .5))
		);
	}

	var mutatioBlue = complement('#fa6900');
	var white = new Hex('#fff');

	Style({
		'.aBtn': {
		    'span': {
				color: '#fa6900'
		    }
		}.extend(
			button(mutatioBlue, white)
		)
	});

	/**
	 * Top header
	 */
	Style({
		header: {
			h1: {
				padding: '5px 10px 10px',
				margin: '5px 0',
				font_size: '40px',
				color: 'white',
				background_color: bgDark
			}.extend(
				border,
				CSS.textShadow(-2, 2, 1, darken(bg, .9)),
				CSS.boxShadow(1, 1, 1, 2, darken(bgDark, .3)),
				CSS.radialGradient('top', lighten(bgDark, 2).toString(), bgDark)
			)
		}.extend(center)
	});

	/**
	 * Body
	 */
	Style({
		'#code': {
			display: 'table',
			border: darken(bg, .2) + ' 2px solid',
			background_color: 'white',
			font_size: '11px',
			white_space: 'pre',
			padding: '5px',
			font_weight: 'normal',
			width: '100%',

			ul: {
				display: 'table-row',

				li: {
					display: 'table-cell',
					width: '50%',

					'$first-child': {
						color: colors[2].toString()
					},

					'$last-child': {
						color: colors[0].toString()
					}
				}
			}
		}.extend(border),

		body: {
			color: bgDark,
			background_color: bg.toString(),

			font: Property({
				weight: 'bold',
				family: "'Helvetica Neue', Helvetica, Arial, sans-serif",
				size: '12px/14px'
			}),

			'> div': {
				'> h2': {
					margin: '10px 0 5px 0',
					font_size: '14px'
				}
			}.extend(center)
		}
	});

	/**
	 * Footer
	 */
	Style({
		footer: {

		}.extend(center)
	});
});

pageStyle();
