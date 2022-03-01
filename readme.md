# Rabbit Ear

[![Build Status](https://travis-ci.org/robbykraft/Origami.svg?branch=master)](https://travis-ci.org/robbykraft/Origami)

This is a Javascript library for modeling origami. Check out the [documentation](https://rabbitear.org/docs/).

# usage

The compiled library is one file and works in the browser or Node.

```html
https://robbykraft.github.io/Origami/rabbit-ear.js
```

```
npm install rabbit-ear
```

# developers

clone this repo and `cd` into the directory.

```shell
git clone https://github.com/robbykraft/Origami.git
cd Origami/
```

install npm. (if you don't already have it install [NodeJS](https://nodejs.org/))

````shell
npm install
````

 npm will install [rollup](https://rollupjs.org/), the compilation tool that creates `rabbit-ear.js`. compile by typing

```shell
rollup -c
```

run the tests to ensure everything worked.

```shell
npm test
```

# src/

an overview of the contents of the source folder

```
src/
  math.js
  axioms/
  classes/
  diagrams/
  fold/
  graph/
  layer/
  single_vertex/
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

Chunks of code which are currently included in the library, but this library could be built without it. For example the "SVG" library can be removed and Rabbit Ear can successfully compile without it.

### fold/

This library is designed around the FOLD graph spec. This contains methods and interfaces with the keys and values themselves, and general helper methods.

### general/

More computer-sciency level data structure kind of stuff, like the manipulation of arrays, memory, strings, etc.

### graph/

All code related to the manipulation of a graph, this graph being in FOLD format. some highlights include:

- `add/` methods that add actual geometry like vertices and edges, splitting faces...
- `clean/` files that remove geometry, generally bad geometry like duplicate edges
- `make.js` create graph components like faces_edges, vertices_vertices...
- `fragment.js` convert to a planar graph, flatten into the XY plane, chop edges
- `remove.js` remove indices from arrays and correct references

### layer/

All code related to solving the layer order of faces in a folded origami.

### single_vertex/

Everything single-vertex related, like Kawasaki and Maekawa's theorem.

### svg/

Conversion of a FOLD object into an SVG rendering, with case-specific styling for crease pattern and folded form.

### text/

Datasets of multilingual text, intended to describe fold operations, parts of the paper, etc.. Intended for use when constructing diagrams.

### webgl/

Conversion of the FOLD format into WebGL mesh format and rendering. Intended as a substitute for the SVG renderer.

# references

This repo is the main entrypoint for building the Rabbit Ear library. The library is split across multiple repos:

- [Origami](https://github.com/robbykraft/Origami) (this repo)
- [Math](https://github.com/robbykraft/Math) **required by this repo** and is included in the build
- [SVG](https://github.com/robbykraft/SVG) included in build
- [fold-to-svg](https://github.com/robbykraft/fold-to-svg) included in build
- [svg-to-fold](https://github.com/robbykraft/svg-to-fold) right now **not** included
- [examples](https://github.com/robbykraft/Examples) the example sketches found in the docs
- [docs](https://github.com/robbykraft/Docs) the docs at [http://rabbitear.org/docs](http://rabbitear.org/docs)

# license

MIT open source software license
