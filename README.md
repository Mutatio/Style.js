Style.js
========

An easy to use JavaScript library providing CSS preprocessing and a myriad of color manipulation functions.

CSS Preprocessing
-----------------

Style.js allows developers to utilize the full power of JavaScript to generate CSS.

Example:

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