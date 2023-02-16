# 0.9.33 alpha

replace `getGraphKeysWithPrefix` with `filterKeysWithPrefix`, maintaining the functionality of `getGraphKeysWithPrefix` where it will add the `_` character to match against. same with Suffix methods.

new method: `subgraph` and `subgraphWithFaces`, where *subgraphWithEdges* and *subgraphWithVertices* could be written in similar form.

Methods renamed:

- `getBoundingBox` -> `boundingBox`
- `getBoundaryVertices` -> `boundaryVertices`
- `getBoundary` -> `boundary`
- `getPlanarBoundary` -> `planarBoundary`
- `makeFacesFacesOverlap` -> `getFacesFaces2DOverlap`
- `makeFacesCenter` -> `makeFacesCenter2D`
- `makeFacesCenterQuick` -> `makeFacesConvexCenter`
- `getDuplicateEdges` -> `duplicateEdges`
- `getCircularEdges` -> `circularEdges`
- `getVerticesClusters` -> `verticesClusters`
- `getDuplicateVertices` -> `duplicateVertices`
- `getEdgeIsolatedVertices` -> `edgeIsolatedVertices`
- `getFaceIsolatedVertices` -> `faceIsolatedVertices`
- `getIsolatedVertices` -> `isolatedVertices`
- `getCoplanarFacesGroups` -> `coplanarFacesGroups`
- `getOverlappingFacesGroups` -> `overlappingFacesGroups`
- `makeTrianglePairs` -> `chooseTwoPairs`
- `clusterArrayValues` -> `clusterScalars`
- `getDisjointedVertices` -> `disjointVerticesSets`

`makeEdgesAssignment` has been renamed to `makeEdgesAssignmentSimple` and `makeEdgesAssignment` now also assigns "B" boundary edges by checking edges_faces for # of incident faces.

new WebGL implementation. see: https://foldfile.com

Various methods will now throw Errors instead of console.error or console.warn. Not all console.warn have been removed however. The distinction is that if the function is still able to generate a solution, it will console.warn. If the function generated something which contains errors or misleading information, it throws an error.

New subcategory `ear.webgl` containing at least: `createProgram`, `initialize`, `foldedForm`, `creasePattern`, `rebuildViewport`, `makeProjectionMatrix`, `makeModelMatrix`, `drawProgram`, `deallocProgram`, with many more methods specific to drawing different styles with different shaders.

new Matrix4 type. new Quaternion type. new projection matrices.

new method `ear.graph.nearest`, which was already in the `graph()` object as a prototype method. now exists in the top level.

all matrix scale methods takes an array of values instead of one number, allowing non-uniform axis scaling.

`ear.graph.getBoundingBox` will return "undefined" if the graph does not contain any vertices_coords. previously this would throw an error.

new `nudgeVerticesWithFacesLayer`, `nudgeVerticesWithFaceOrders` for nudging vertices in an exploded graph based on layer order.

`src/layer/topological.js` contains a new topological sort method. currently not being exported.

new `.convert` with the first (of many, hopefully) file conversions: `.obj` to `.fold`, which includes computing edges_foldAngle and giving them a "M" "V" assignment.

new methods `getCoplanarFacesGroups`,  `getOverlappingFacesGroups` which will find all groups of faces which share the same plane in 3D space (`getCoplanarFacesGroups`), and then in the case of `getOverlappingFacesGroups` actually compute whether or not they overlap.

new method `selfRelationalUniqueIndexPairs`, given any array of self-referential data (vertices_vertices, faces_faces, etc), create a list of unique pairwise combinations of related indices.

rewrite of `getVerticesClusters`, implemented a line sweep and the runtime has been massively improved.

refactor fold/keys and fold/spec, simplify methods that get exposed in the final build.

# 0.9.32 alpha

new layer solver implementation at ear.layer.solver(), huge performance improvement. solver returns data bound to a prototype which includes methods to process and analyze the data. methods include

```javascript
count()
solution(...indices)
allSolutions()
facesLayer(...indices)
allFacesLayers()
faceOrders(...indices)
allFaceOrders()
```

ear.layer.assignmentSolver renamed to ear.layer.singleVertexAssignmentSolver.

ear.math.enclosingBoundingBoxes, new method. test if one bounding box is entirely inside another.

ear.graph.makeEdgesEdgesSimilar, answers which edges have the same endpoints (vertices) as other edges. endpoints can be in any order.

performance improvements for ear.graph.makeFacesFacesOverlap, ear.graph.makeEdgesFacesOverlap.

# 0.9.31 alpha

axiom function wrapper has changed. `validate()` is now exposed to the user, as is the `axiomInBoundary` methods. Normal-distance parameterization methods are now named as such.

new convex hull algorithm. two entrypoints: `convexHull` returns points, `convexHullIndices` returns indices of points from your points parameter array.

`onLeave` added to the other three methods `onMove` `onPress` `onRelease` for SVG elements.

# 0.9.3 alpha

no longer requiring @xmldom/xmldom as a dependency. This library now has zero dependencies! [1]

`clean()` takes no options now and performs one consistent task: removes all bad edges and vertices. if you like you can call each submethod now `removeDuplicateVertices`, `removeCircularEdges`, `removeDuplicateEdges`, `removeIsolatedVertices`.

axiom function parameters have now changed to the much simpler "point, line" to consistenly separate types. This replaces "point, origin, vector" inputs where "origin, vector" are two components which describe a line, and "point" is points... **to update: modify your axiom function parameters, whever it asks for a line, make a ear.line() objects from your previous origin/vector pairs.**

```javascript
ear.graph.getBoundaryVertices // unsorted
ear.graph.getBoundary.vertices // sorted
```

> [1] if you use Rabbit Ear in NodeJS and create a SVG elements (virtually), you will need to import @xmldom. Because this is such a unique rare case, this is left to the user. This will be explained in the documentation.
