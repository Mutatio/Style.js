var bg = {
	background: ["#E0E4CC", "-webkit-gradient(linear, left top, left bottom, color-stop(0%,#fff), color-stop(100%,#E0E4CC))".toRGB()]
};

var backgroundsTest = {
	background: []
};

for (var i = 0; i < 10; ++i) {
	backgroundsTest.background.push(Hex.random());
}

var CSS = '#myTestCSS {\n\
	background: red;\n\
	font-family: Arial;\n\
	border: red 1px solid;\n\
	margin: 3em;\n\
	}\n\n\
	\n\n\
	/*Comment*/\n\
	.testing h2 {\n\
	background: red;\n\
	font-family: Arial\n\
}'.toObject();

/**
 * Links
 */
Style({
	a: {
		font_weight: 'bold',
		text_decoration: 'none',
		$hover: {
			text_decoration: 'underline'
		}
	}
});

var bgProp = Property({
	color: ['red','green','blue'],
	image: 'url(myPicture.png)'
});

var font = Property({
	weight: 'bold',
	family: "'Helvetica Neue', Helvetica, Arial, sans-serif",
	size: '12px/14px'
});

/**
 * Base
 */
Style({
	body: {
		font: font,
		cursor: "default",
		margin: 0,
		padding: 0,
		text_align: "center",
		background: bgProp,

		a: {
			font: font,
			color: 'red',

			$hover: {
				color: 'black'
			},

			strong$: {
				font_weight: "bold"
			}
		}
	}
});

/*
 * Main header
 */
Style({
	header: {
		margin: "10px auto 0 auto",
		width: "800px",
		text_align: "left",

		h1: {
			margin: 0
		}.extend(bg),

		ul: {
			margin: "10px 0 0 0",
			padding: "5px 4px 5px 4px",
			list_style: "none",
			background_color: "#fff",
			display: "block",
			width: "800px",
			_webkit_border_radius: "5px",
			_moz_border_radius: "5px",
			border_radius: "5px",
			_moz_box_shadow: "0 0 5px " + new RGB("#E0E4CC"),
			_webkit_box_shadow: "0 0 5px " + new RGB("#E0E4CC"),
			box_shadow: "0 0 5px #E0E4CC",
			color: "#635f53",

			"li:last-child": {
				margin_right: 0
			}.extend(bg),

			"strong, a": {
				padding: "2px 5px 3px 5px",
				font_size: "12px",
				margin: 0,
				border: "transparent 1px solid"
			},

			"strong, a:hover": {
				font_weight: "normal",
				background_color: "#fff",
				_webkit_border_radius: "5px",
				_moz_border_radius: "5px",
				border_radius: "5px",
				_moz_box_shadow: "inset 0 0 10px #E0E4CC",
				_webkit_box_shadow: "inset 0 0 10px #E0E4CC",
				boxshadow: "inset 0 0 10px #E0E4CC",
				border: "#E0E4CC 1px solid"
			}.toRGB(),

			a: {
				text_decoration: "none"
			}
		}.extend(bg).toHex(),

		li: {
			display: "inline-block",
			padding: "3px 0 4px 0",
			margin_right: "5px",
			height: calc('2em + 2px')
		}.extend(backgroundsTest).toRGB()
	}.extend(backgroundsTest)
});