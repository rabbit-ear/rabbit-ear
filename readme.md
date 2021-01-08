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
  diagrams/
  extensions/
  graph/
  prototypes/
  single_vertex/
  text/
  use/
  webgl/
```

### math.js

This is the math library, bundled as an es6 module. Direct all conversation to the [Math repository](https://github.com/robbykraft/Math).

### diagrams/

Contains methods like fitting arrows and rendering diagrams. It makes use of the SVG library when it's included. I imagine this folder growing a lot in the future.

### extensions/

parts of the Rabbit Ear library that are included in the build but hosted in other repos. read more in **building and linking** below.

### graph/

Most of the important code this repo has to offer is in the `graph/` folder; it's all code that manipulates FOLD graph, which is the mesh data format, so it contains a lot of graph theory. some highlights include:

- `add/` methods that add actual geometry like vertices and edges, splitting faces...
- `clean/` files that remove geometry, generally bad geometry like duplicate edges
- `make.js` create graph components like faces_edges, vertices_vertices...
- `fragment.js` convert to a planar graph, flatten into the XY plane, chop edges
- `remove.js` remove indices from arrays and correct references

### prototypes/

These are the graph, crease pattern, and origami objects accessible from the top-level. They serve as object-oriented class style interface to the methods of the library.

### single_vertex/

Everything single-vertex, Kawasaki and Maekawa's theorem, sectors, folding simulation and intersection test, and layer order solver.

### text/

Multilingual text that describe folds, instructions, parts of the paper. This is used when constructing diagrams.

### use/

this is the interface for **extensions**, read more in the section below.

### webgl/

A baby folder. Conversion of the FOLD format into WebGL mesh format, and help with rendering. Right now the code depends on three.js. A lot of room for growth.

> The structure of the src/ folder isn't completely settled. Things that are not math related or FOLD format related tend to get their own folder.

> If you console.log rabbit ear, notice that the top level contains keys that match *some* of the subdirectories of `src/`, this is not a strict rule, but seems to be a pattern we are following.

# library repos

This repo is the main entrypoint for building the Rabbit Ear library. The library is split across multiple repos:

- [Origami](https://github.com/robbykraft/Origami) (this repo)
- [Math](https://github.com/robbykraft/Math) **required by this repo** and is included in the build
- [SVG](https://github.com/robbykraft/SVG) included in build
- [fold-to-svg](https://github.com/robbykraft/fold-to-svg) included in build
- [svg-to-fold](https://github.com/robbykraft/svg-to-fold) right now **not** included
- [examples](https://github.com/robbykraft/Examples) the example sketches found in the docs
- [docs](https://github.com/robbykraft/Docs) the docs at [http://rabbitear.org/docs](http://rabbitear.org/docs)

The only repo *absolutely necessary* is the math library. It is compiled as an ES6 module and placed in `src/`. It's like submodules, but easier. This way, if you clone just this one repo you can build and run all the tests just fine.

```
npm test
```

If you want the ✨full experience ✨, create a folder called `RabbitEar/ `and clone these repositories into it.

### extensions

The following repos are included in the final build file but they're not dependencies to any source code in this repo; they are like extensions. This library **could totally be built and distributed without them**.

- [a svg library](http://github.com/robbykraft/SVG) create SVGs, easy styling and event handling
- [fold-to-svg](http://github.com/robbykraft/fold-to-svg), convert FOLD graphs to SVGs

These extensions incorporate themselves within the larger library at runtime using the `use` method. This is a pattern that will allow extension development and contribution by the community.

```javascript
ear.use(SVG)
```

> These extensions also happen to be fully independent packages on their own, [rabbit-ear-svg](https://www.npmjs.com/package/rabbit-ear-svg) and [fold-to-svg](https://www.npmjs.com/package/fold-to-svg) on npm.

This pattern of community extensions was inspired by openFrameworks and their system of ofxAddons. Pull requests to this repo are still encouraged, if code is less necessary to the general user, community extensions is the way to go.

# license

MIT open source software license
