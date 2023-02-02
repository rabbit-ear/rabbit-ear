# Rabbit Ear

[![Build Status](https://travis-ci.org/robbykraft/Origami.svg?branch=master)](https://travis-ci.org/robbykraft/Origami)

This is a Javascript library for modeling origami.

# overview

This library assists the user in encoding, modifying, and rendering origami models. Origami models are encoded as [FOLD](https://github.com/edemaine/FOLD/) objects, which is a graph data structure format. Rabbit Ear contains methods for modifying FOLD graphs, a small math library, an SVG and WebGL rendering library, and various origami-specific calculations.

# learn

The [docs](https://rabbitear.org/docs/) contain technical references for coding with this library.

The [book](https://rabbitear.org/book/) contains higher-level explanations and interactive examples.

[FOLD viewer](https://foldfile.com/) visualize a FOLD file, the format on which this library is built.

The [REPL](https://terminal.rabbitear.org/) is a terminal interface to the library.

[SVG coder](https://svg.rabbitear.org/) is a live coding interface for drawing SVG.

# usage

Rabbit Ear is bundled into one Javascript file, available in a few formats. Use these urls as a cdn.

### UMD module

for node.js require() and \<script\>

```
https://robbykraft.github.io/Origami/rabbit-ear.js
```

### ES6 module

for ES 2015 import/export and \<script type="module"\>

```
https://robbykraft.github.io/Origami/rabbit-ear.module.js
```

### NPM 

The [package on npmjs.org](https://www.npmjs.com/package/rabbit-ear) contains both UMD and ES6

```bash
npm install rabbit-ear
```

# license

MIT open source software license
