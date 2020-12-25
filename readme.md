# Rabbit Ear

[![Build Status](https://travis-ci.org/robbykraft/Origami.svg?branch=master)](https://travis-ci.org/robbykraft/Origami)

This is a Javascript library for designing origami. Check out the [documentation](https://rabbitear.org/docs/).

# Usage

The library is one file, `rabbit-ear.js`, [download it](https://github.com/robbykraft/Origami/releases) or link it from this CDN. 

```html
<script src="https://robbykraft.github.io/Origami/rabbit-ear.js"></script>
```

Or, get it from NPM

```
npm i rabbit-ear
```

# Developers

This repo is the main entrypoint for building the Rabbit Ear library. The product of the compilation is one Javascript file. The compiled file includes code from at least 2 repositories, currently it includes 4.

If you clone **just this one** repo, you can build and run all the tests just fine.

If you want the ✨full experience ✨, create a folder called `RabbitEar/ `and clone all these repositories into it:

- [Origami](https://github.com/robbykraft/Origami) (this repo)
- [Math](https://github.com/robbykraft/Math) **required by this repo** and included in build
- [SVG](https://github.com/robbykraft/SVG) included in build
- [Fold-to-svg](https://github.com/robbykraft/fold-to-svg) included in build
- [Examples](https://github.com/robbykraft/Examples) the examples that are mostly populating the docs
- [Docs](https://github.com/robbykraft/Docs) the docs at [http://rabbitear.org/docs](http://rabbitear.org/docs)

### Compile

all repos including this one (not Examples or Docs) can compile using [rollup](https://rollupjs.org/), type `rollup -c`

### Repos

The math library is required by half the files in this repo, it is compiled as an ES6 module and is placed in `src/`. It's like submodules, but easier!

```
src/
  math.js
```

The following repos are included in the final build file but they're not dependencies to any source code in this repo; they are like extensions. This library **could totally be built and distributed without them**.

- [a svg library](http://github.com/robbykraft/SVG) create SVGs, easy styling and event handling
- [fold-to-svg](http://github.com/robbykraft/fold-to-svg), convert FOLD graphs to SVGs

These extensions incorporate themselves within the larger library at runtime using the `use` method. This is a pattern that will allow extension development and contribution by the community.

```javascript
ear.use(SVG)
```

This pattern of community extensions was inspired by openFrameworks and their system of ofxAddons. Pull requests to this repo are still encouraged, if code is less necessary to the general user, community extensions is the way to go.

### src/ files inside repository

```
src/
  math.js
  graph/
  diagrams/
  axioms/
```

Most of the important code this repo has to offer is in the `graph/` folder; it's all code that manipulates FOLD graph objects. some highlights include:

- `add/` files that add actual geometry like vertices and edges, splitting faces...
- `clean/` files that remove geometry, generally bad geometry like duplicate edges
- `single_vertex/` flat-foldability and layer solvers, Kawasaki, Maekawa's theorem...
- `make.js` create graph components like faces_edges, vertices_vertices...
- `fragment.js` convert to a planar graph, flatten into the XY plane, chop edges
- `remove.js` remove indices from arrays and correct references

Any method that is purely about **math** gets added to the [math repo](http://github.com/robbykraft/Math), otherwise, if code doesn't below inside `graph/` because it's not specific general graph manipulation then it should probably get its own folder in `src/`, like `diagrams/` and `axioms/`.

> If you console.log rabbit ear, notice that the top level contains keys that match *some* of the subdirectories of `src/`, this is not a strict rule, but seems to be a pattern we are following.

# License

MIT open source software license