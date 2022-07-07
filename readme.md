# Rabbit Ear

[![Build Status](https://travis-ci.org/robbykraft/Origami.svg?branch=master)](https://travis-ci.org/robbykraft/Origami)

This is a Javascript library for modeling origami.

# overview

This library assists the user in encoding, modifying, and rendering origami models. Origami models are encoded as [FOLD](https://github.com/edemaine/FOLD/) objects, which is a graph data structure format. Rabbit Ear contains methods for modifying FOLD graphs, a small math library, an SVG rendering library, and various origami-specific calculations.

The [docs](https://rabbitear.org/docs/) contain technical references for coding with this library.

The [book](https://rabbitear.org/book/) contains higher-level explanations and interactive examples.

# installation

Rabbit Ear is compiled into one file in various formats:

**UMD module** for html \<script\> tags and node.js require()

``` bash
https://robbykraft.github.io/Origami/rabbit-ear.js
```

**ES module** for ES 2015 import/export

```
https://robbykraft.github.io/Origami/rabbit-ear.module.js
```

Install via. npm with:

```
npm install rabbit-ear
```

# developers

To compile this project on your computer, make sure you have [node and npm](https://nodejs.org/) installed, and clone this repository.

```shell
git clone https://github.com/robbykraft/Origami.git
cd Origami/
npm i
```

 npm will install [rollup](https://rollupjs.org/), the compilation tool that creates `rabbit-ear.js`. Compile the library by typing:

```shell
rollup -c
```

Run the tests to ensure everything worked.

```shell
npm test
```

Here is an overview of the contents of the source folder.

```
src/
  math.js
  axioms/
  classes/
  diagrams/
  fold/
  graph/
  layer/
  singleVertex/
  svg/
  text/
  use/
  webgl/
```

### math.js

This is the math library, bundled into one file. It can exist as its own independent library, but Rabbit Ear cannot exist without it. All comments go to the [Math repository](https://github.com/robbykraft/Math).

### axioms/

All code related to the seven origami axioms, the formula for generating lines based of a set of input points and lines.

### classes/

These are object-oriented class-like interfaces for creating origami "objects", which behave like class instances, for example they contain object methods. This library strictly *does not* use ES6 classes, rather prototype based constructors, but the idea is similar to a "class".

### diagrams/

All methods relating to generating origami diagrams. Most of it relates to rendering.

### extensions/

Code which is currently included in the library, but this library could be built without it. The "SVG" library can be removed and Rabbit Ear can successfully compile and run without it.

### fold/

This library is designed around the FOLD graph spec. This contains methods and interfaces with the keys and values themselves, and general helper methods.

### general/

Manipulation of arrays, memory, strings, etc.

### graph/

All code related to the manipulation of a graph, this graph being in FOLD format. some highlights include:

- `add/` methods that add actual geometry like vertices and edges, splitting faces...
- `clean/` files that remove geometry, generally bad geometry like duplicate edges
- `make.js` create graph components like faces_edges, vertices_vertices...
- `fragment.js` convert to a planar graph, flatten into the XY plane, chop edges
- `remove.js` remove indices from arrays and correct references

### layer/

All code related to solving the layer order of faces in a folded origami.

### singleVertex/

Everything single-vertex related, like Kawasaki and Maekawa's theorem.

### svg/

Conversion of a FOLD object into an SVG rendering, with case-specific styling for crease pattern and folded form.

### text/

Multilingual text, intended to contain instructions for fold operations, parts of the paper, etc.

### webgl/

Conversion of the FOLD format into WebGL mesh format and rendering. Intended as a substitute for the SVG renderer. *not much to see here*

# references

This repo is the main entrypoint for building the Rabbit Ear library. The library is split across multiple repos:

- [Origami](https://github.com/robbykraft/Origami) (this repo)
- [Math](https://github.com/robbykraft/Math) **required by this repo** and is included in the build
- [SVG](https://github.com/robbykraft/SVG) included in build
- [examples](https://github.com/robbykraft/Examples) the example sketches found in the docs
- [book](https://github.com/robbykraft/Docs) the book at [http://rabbitear.org/book](http://rabbitear.org/book)

# license

MIT open source software license
