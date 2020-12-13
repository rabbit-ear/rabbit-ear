# Rabbit Ear

[![Build Status](https://travis-ci.org/robbykraft/Origami.svg?branch=master)](https://travis-ci.org/robbykraft/Origami)

This is a Javascript library for designing origami.

> Check out the [documentation](https://rabbitear.org/docs/) it's filled with interactive examples.

# Usage

Include `rabbit-ear.js`

```html
<script src="rabbit-ear.js"></script>
```

node.js

```javascript
var RabbitEar = require("rabbit-ear")
```

# API

if you are in the browser, this gives you an SVG rendering of an origami.

```javascript
var origami = RabbitEar.origami()
```

that creates an origami object (a piece of paper). it is a [FOLD object](https://github.com/edemaine/fold). put creases into it:

```javascript
var origami = RabbitEar.origami()
origami.crease([0.5, 0.5], [0.707, 0.707])
```

fold and unfold to look at the crease pattern:

```javascript
origami.fold()
origami.unfold()
```

many of the objects at the top level are math primitives:

```javascript
RabbitEar.graph
RabbitEar.vector
RabbitEar.matrix
RabbitEar.line
RabbitEar.ray
RabbitEar.segment
RabbitEar.circle
RabbitEar.polygon
RabbitEar.convexPolygon
```

all of the internal methods are made available. the origami related methods are in core:

```javascript
RabbitEar.core
RabbitEar.math
```

There are methods for folding a sheet of paper, checking local flat-foldability, Kawasaki-Justin's theorem, Maekawa's theorem, etc...

this library supports .fold, .oripa, and .svg files. easily convert between them

```javascript
origami.export.svg()
origami.export.oripa()
// load file
var loaded_image = ...;
RabbitEar.convert(loaded_image).fold()
```

# Developers

compile the source using [rollup](https://rollupjs.org/). In terminal type: `rollup -c`

# License

MIT open source software license
