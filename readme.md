# Origami Code

[![Build Status](https://travis-ci.org/robbykraft/Origami.svg?branch=master)](https://travis-ci.org/robbykraft/Origami)

This is a Javascript library for creating origami crease patterns.

> Check out the [documentation](https://rabbitear.org/docs/) it's filled with interactive examples.

# Usage

Include `rabbit-ear.js`

This library is a math library, SVG library, [FOLD](https://github.com/edemaine/fold) graph manipulator, all wrapped into one.

```javascript
var origami = new Origami();
```

If you are in the browser you get an SVG rendering of the origami.

There are methods for folding a sheet of paper, checking local flat-foldability, Kawasaki-Justin's theorem, Maekawa's theorem, etc.., supports .fold, .oripa, and .svg files.

# Developers

compile the source using [rollup](https://rollupjs.org/). In terminal type: `rollup -c`

# License

MIT open source software license