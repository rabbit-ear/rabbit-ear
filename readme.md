# Origami Code

This is a Javascript library for creating origami crease patterns.

> Check out the [documentation](https://rabbitear.org/docs/) it's filled with interactive examples.

# Usage

Include `rabbit-ear.js`

This library is a math library, SVG library, [FOLD](https://github.com/edemaine/fold) graph manipulator, all wrapped into one.

A data model of a crease pattern is initialized like so

```javascript
var cp = new CreasePattern();
```
If you are in the browser, initialize an Origami object and you also get an SVG image of the Crease Pattern.

```javascript
var origami = new Origami();
```

There are methods for folding a sheet of paper, checking local flat-foldability, Kawasaki-Justin's theorem, Maekawa's theorem, exposing the planar graph data structure, support for .fold, .oripa, and .svg file formats for import and export.

# Developers

compile the source using [rollup](https://rollupjs.org/). In terminal type: `rollup -c`

# License

MIT open source software license