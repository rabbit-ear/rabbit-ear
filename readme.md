# Origami Code

This is a Javascript library for creating origami crease patterns.

First time visitors there are a few ways to get acquainted:

- [introduction and tutorial](https://rabbitear.org/download.php)
- [documentation](https://rabbitear.org/docs/), there are a lot of interactive graphical examples.
- download this repo and check out the `/examples/` folder.

# Usage

Include `rabbit-ear.js`

A data model of a crease pattern is initialized like so

```javascript
var cp = new CreasePattern();
```
If you are in the browser, initialize an OrigamiPaper object and you also get an SVG visualization of the Crease Pattern.

```javascript
var origami = new OrigamiPaper();
```

There are functions for checking local flat-foldability, Kawasaki-Justin's theorem, Maekawa's theorem, exposing the planar graph data structure. Everything is built on a custom geometry module giving the user control over the epsilon value for all adjacency or intersection calculations, useful for .svg file import. This library supports .fold, .oripa, and .svg file formats for import and export.

check out the [introduction and tutorial](https://rabbitear.org/download.php) for detailed usage notes.

# Build

from the project root directory, compile source files using rollup: `rollup -c`

# License

MIT open source software license