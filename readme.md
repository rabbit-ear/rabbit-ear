# Rabbit Ear

This is a Javascript library for modeling origami.

# overview

This library assists in encoding, modifying, and rendering origami models. Origami models are encoded in [FOLD](https://github.com/edemaine/FOLD/) format, which is a mesh based data structure. Rabbit Ear contains methods for modifying FOLD graphs, a math library, an SVG and WebGL rendering library, and various methods for making origami-related calculations.

# usage

Rabbit Ear source code is distributed as an ES6 module as individual files, and as a single UMD/CommonJS bundled file. Both are available when you download the latest [release](https://github.com/rabbit-ear/rabbit-ear/releases/), or install the [package from npm](https://www.npmjs.com/package/rabbit-ear).

```bash
npm install rabbit-ear
```

Alternatively, use a CDN for the UMD/CommonJS bundle

```
https://rabbit-ear.github.io/rabbit-ear/rabbit-ear.js
```

ES6 module

```
https://rabbit-ear.github.io/rabbit-ear/src/index.js
```

# learn

The [docs](https://rabbitear.org/docs/) contain technical references for coding with this library.

[FOLD validator/viewer](https://foldfile.com/) validate and visualize a FOLD file, the mesh file format used by this library.

# license

GNU GPLv3
