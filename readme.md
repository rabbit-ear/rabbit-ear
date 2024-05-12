# Rabbit Ear

This is a Javascript library for modeling origami.

# overview

This library assists in encoding, modifying, and rendering origami models. Origami models are encoded in [FOLD](https://github.com/edemaine/FOLD/) format, which is a mesh based data structure. Rabbit Ear contains methods for modifying FOLD graphs, a math library, an SVG and WebGL rendering library, and various methods for making origami-related calculations.

# usage

Rabbit Ear source code is distributed as an ES6 module as well (as individual files), as well as a single UMD/CommonJS bundle file. These URLs link to the bundled files:

### UMD module

for node.js require() and \<script\>

```
https://rabbit-ear.github.io/rabbit-ear/rabbit-ear.js
```

### ES6 module

for ES 2015 import/export and \<script type="module"\>

```
https://rabbit-ear.github.io/rabbit-ear/src/index.js
```

### NPM

The package on [npm](https://www.npmjs.com/package/rabbit-ear) contains both UMD and ES6-module formats.

```bash
npm install rabbit-ear
```

# learn

The [docs](https://rabbitear.org/docs/) contain technical references for coding with this library.

[FOLD validator/viewer](https://foldfile.com/) validate and visualize a FOLD file, the mesh file format used by this library.

# license

GNU GPLv3
