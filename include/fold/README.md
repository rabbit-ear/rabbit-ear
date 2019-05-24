# FOLD [[spec](doc/spec.md), [viewer](https://edemaine.github.io/fold/examples/foldviewer.html), [API](doc/api.md)]

**FOLD** (Flexible Origami List Datastructure) is a file format (with extension
`.fold`) for describing **origami models**: crease patterns, mountain-valley
patterns, folded states, etc.  Mainly, a FOLD file can store a **mesh** with
**vertices**, **edges**, **faces**, and links between them, with optional
2D or 3D geometry, plus the topological **stacking order** of faces that
overlap geometrically.
A mesh can also easily store additional user-defined data.
One FOLD file can even store multiple such meshes in "**frames**"
(but this feature is not yet supported in any code).

This repository both **documents** the FOLD format (which is still in early
stages so its definition is evolving) and provides web **software tools**
and **JavaScript libraries** to aid in manipulation of FOLD files.
FOLD is built upon
**[JSON](http://www.json.org/)** (JavaScript Object Notation)
so [parsers](http://www.json.org/) are available in essentially all
programming languages.  Once parsed, the format also serves as the typical
data structure you'll want to represent foldings in your software.
Our libraries also help build useful redundant data structures for
navigating the mesh.

FOLD is similar in spirit to the
[OBJ format](http://paulbourke.net/dataformats/obj/) (and other similar
formats) for storing 3D meshes; its main distinguishing features are
**easy parsing**, **easy extensibility**, the ability to disambiguate
**overlapping faces** with stacking order, and the ability to define edges
and thus edge properties (such as mountain-valley assignments) and
**arbitrary polyhedral complexes**.
(Without edges, OBJ cannot distinguish between two faces sharing two
consecutive vertices from faces sharing an edge.)
In addition, FOLD can support **linkages** (with 1D edges but no 2D faces).

## [FOLD Format Documentation](https://github.com/edemaine/fold/tree/master/doc/spec.md)

* [FOLD specification](https://github.com/edemaine/fold/tree/master/doc/spec.md)
* [2-page paper describing FOLD](http://erikdemaine.org/papers/FOLD_CGW2016/)
* [Examples of .fold files](https://github.com/edemaine/fold/tree/master/examples/)

## FOLD Software Tools

Here is software supporting the FOLD format, built both within this project
and by other people:

* [FOLD viewer](https://edemaine.github.io/fold/examples/foldviewer.html)
  loads and display a given .fold file, useful for visualization and testing
* Amanda Ghassaei's
  [Origami Simulator](https://github.com/amandaghassaei/OrigamiSimulator)
  supports FOLD input and output
* Tomohiro Tachi's
  [Freeform Origami](http://origami.c.u-tokyo.ac.jp/~tachi/software/#ffo)
  supports FOLD input and output

## [FOLD JavaScript Library](https://github.com/edemaine/fold/tree/master/doc/api.md)

For simple web apps, add this tag to your HTML:
`<script src="https://edemaine.github.io/fold/dist/fold.js"></script>`
(or save a local copy of
[`dist/fold.js`](https://github.com/edemaine/fold/blob/master/dist/fold.js)
and use that).
Then, if you add `FOLD = require('fold')` to your JavaScript/CoffeeScript code,
you can access the library via `FOLD.moduleName.functionName`, e.g.,
`FOLD.filter.collapseNearbyVertices`.

For Node apps, just `npm install --save fold`;
then add `FOLD = require('fold')` to your JavaScript/CoffeeScript code;
then access the library via `FOLD.moduleName.functionName`, e.g.,
`FOLD.filter.collapseNearbyVertices`.

The [FOLD library API](https://github.com/edemaine/fold/tree/master/doc/api.md)
documents the available modules and functions for manipulating FOLD objects.
If you have a `.fold` file, first parse it with `JSON.parse(fileContents)`
to get a FOLD object.

## Authors

The FOLD format was invented by three people:
* [Erik Demaine](http://erikdemaine.org), M.I.T.
* [Jason Ku](http://jasonku.mit.edu), M.I.T.
* [Robert Lang](http://langorigami.com), langorigami.com

We welcome your feedback and suggestions!  The goal is for all software in
computational origami to support FOLD as a common interchange format.
