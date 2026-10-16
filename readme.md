# Rabbit Ear

This is a Javascript library for modeling origami.

# overview

This library assists in encoding, modifying, and rendering origami models. Origami models are encoded in [FOLD](https://github.com/edemaine/FOLD/) format, which is a mesh based data structure. Rabbit Ear contains methods for modifying FOLD graphs, a math library, an SVG and WebGL rendering library, and various methods for making origami-related calculations.

# version

The current version is 0.9.41 alpha, released 2026.10.16 [changelog](https://rabbit-ear.github.io/rabbit-ear/changelog.html)

# download

The Rabbit Ear library is distributed as a single package which contains an ES6 module (for NodeJS, Bun, module scripts), and as UMD/CommonJS single-file bundle (for traditional html scripts)

### release

manual download [.zip](https://github.com/rabbit-ear/rabbit-ear/releases/)

### npm ([link](https://www.npmjs.com/package/rabbit-ear))

```bash
bun install rabbit-ear
```

```bash
npm install rabbit-ear
```

### CDN (UMD/CommonJS)

```
https://rabbit-ear.github.io/rabbit-ear/rabbit-ear.js
```

### CDN (ES6 module)

```
https://rabbit-ear.github.io/rabbit-ear/src/index.js
```

# learn

The [docs](https://rabbitear.org/docs/) contain technical references for coding with this library.

[FOLD validator/viewer](https://foldfile.com/) validate and visualize a FOLD file, the mesh file format used by this library.

# developers

clone this repository, run `bun i` or `npm i` to install dev dependencies, then to build the project (requires `rollup`):

```bash
bun run build
```

> see `packages.json` for build script (currently hard-coded to `bun` instead of `node`)

# license

GNU GPLv3
