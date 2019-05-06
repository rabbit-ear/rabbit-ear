import {default as geom} from "./geom";

var filter = {};

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

filter.edgesAssigned = function(fold, target) {
  var assignment, i, k, len, ref, results;
  ref = fold.edges_assignment;
  results = [];
  for (i = k = 0, len = ref.length; k < len; i = ++k) {
    assignment = ref[i];
    if (assignment === target) {
      results.push(i);
    }
  }
  return results;
};

filter.mountainEdges = function(fold) {
  return filter.edgesAssigned(fold, 'M');
};

filter.valleyEdges = function(fold) {
  return filter.edgesAssigned(fold, 'V');
};

filter.flatEdges = function(fold) {
  return filter.edgesAssigned(fold, 'F');
};

filter.boundaryEdges = function(fold) {
  return filter.edgesAssigned(fold, 'B');
};

filter.unassignedEdges = function(fold) {
  return filter.edgesAssigned(fold, 'U');
};

filter.keysStartingWith = function(fold, prefix) {
  var key, results;
  results = [];
  for (key in fold) {
    if (key.slice(0, prefix.length) === prefix) {
      results.push(key);
    }
  }
  return results;
};

filter.keysEndingWith = function(fold, suffix) {
  var key, results;
  results = [];
  for (key in fold) {
    if (key.slice(-suffix.length) === suffix) {
      results.push(key);
    }
  }
  return results;
};

filter.remapField = function(fold, field, old2new) {

  /*
  old2new: null means throw away that object
   */
  var array, i, j, k, key, l, len, len1, len2, m, new2old, old, ref, ref1;
  new2old = [];
  for (i = k = 0, len = old2new.length; k < len; i = ++k) {
    j = old2new[i];
    if (j != null) {
      new2old[j] = i;
    }
  }
  ref = filter.keysStartingWith(fold, field + "_");
  for (l = 0, len1 = ref.length; l < len1; l++) {
    key = ref[l];
    fold[key] = (function() {
      var len2, m, results;
      results = [];
      for (m = 0, len2 = new2old.length; m < len2; m++) {
        old = new2old[m];
        results.push(fold[key][old]);
      }
      return results;
    })();
  }
  ref1 = filter.keysEndingWith(fold, "_" + field);
  for (m = 0, len2 = ref1.length; m < len2; m++) {
    key = ref1[m];
    fold[key] = (function() {
      var len3, n, ref2, results;
      ref2 = fold[key];
      results = [];
      for (n = 0, len3 = ref2.length; n < len3; n++) {
        array = ref2[n];
        results.push((function() {
          var len4, o, results1;
          results1 = [];
          for (o = 0, len4 = array.length; o < len4; o++) {
            old = array[o];
            results1.push(old2new[old]);
          }
          return results1;
        })());
      }
      return results;
    })();
  }
  return fold;
};

filter.remapFieldSubset = function(fold, field, keep) {
  var id, old2new, value;
  id = 0;
  old2new = (function() {
    var k, len, results;
    results = [];
    for (k = 0, len = keep.length; k < len; k++) {
      value = keep[k];
      if (value) {
        results.push(id++);
      } else {
        results.push(null);
      }
    }
    return results;
  })();
  filter.remapField(fold, field, old2new);
  return old2new;
};

filter.numType = function(fold, type) {

  /*
  Count the maximum number of objects of a given type, by looking at all
  fields with key of the form `type_...`, and if that fails, looking at all
  fields with key of the form `..._type`.  Returns `0` if nothing found.
   */
  var counts, key, value;
  counts = (function() {
    var k, len, ref, results;
    ref = filter.keysStartingWith(fold, type + "_");
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      key = ref[k];
      value = fold[key];
      if (value.length == null) {
        continue;
      }
      results.push(value.length);
    }
    return results;
  })();
  if (!counts.length) {
    counts = (function() {
      var k, len, ref, results;
      ref = filter.keysEndingWith(fold, "_" + type);
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        key = ref[k];
        results.push(1 + Math.max.apply(Math, fold[key]));
      }
      return results;
    })();
  }
  if (counts.length) {
    return Math.max.apply(Math, counts);
  } else {
    return 0;
  }
};

filter.numVertices = function(fold) {
  return filter.numType(fold, 'vertices');
};

filter.numEdges = function(fold) {
  return filter.numType(fold, 'edges');
};

filter.numFaces = function(fold) {
  return filter.numType(fold, 'faces');
};

filter.removeDuplicateEdges_vertices = function(fold) {
  var edge, id, key, old2new, seen, v, w;
  seen = {};
  id = 0;
  old2new = (function() {
    var k, len, ref, results;
    ref = fold.edges_vertices;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      edge = ref[k];
      v = edge[0], w = edge[1];
      if (v < w) {
        key = v + "," + w;
      } else {
        key = w + "," + v;
      }
      if (!(key in seen)) {
        seen[key] = id;
        id += 1;
      }
      results.push(seen[key]);
    }
    return results;
  })();
  filter.remapField(fold, 'edges', old2new);
  return old2new;
};

filter.edges_verticesIncident = function(e1, e2) {
  var k, len, v;
  for (k = 0, len = e1.length; k < len; k++) {
    v = e1[k];
    if (indexOf.call(e2, v) >= 0) {
      return v;
    }
  }
  return null;
};

var RepeatedPointsDS = (function() {
  function RepeatedPointsDS(vertices_coords, epsilon1) {
    var base, coord, k, len, name, ref, v;
    this.vertices_coords = vertices_coords;
    this.epsilon = epsilon1;
    this.hash = {};
    ref = this.vertices_coords;
    for (v = k = 0, len = ref.length; k < len; v = ++k) {
      coord = ref[v];
      ((base = this.hash)[name = this.key(coord)] != null ? base[name] : base[name] = []).push(v);
    }
    null;
  }

  RepeatedPointsDS.prototype.lookup = function(coord) {
    var k, key, l, len, len1, len2, m, ref, ref1, ref2, ref3, v, x, xr, xt, y, yr, yt;
    x = coord[0], y = coord[1];
    xr = Math.round(x / this.epsilon);
    yr = Math.round(y / this.epsilon);
    ref = [xr, xr - 1, xr + 1];
    for (k = 0, len = ref.length; k < len; k++) {
      xt = ref[k];
      ref1 = [yr, yr - 1, yr + 1];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        yt = ref1[l];
        key = xt + "," + yt;
        ref3 = (ref2 = this.hash[key]) != null ? ref2 : [];
        for (m = 0, len2 = ref3.length; m < len2; m++) {
          v = ref3[m];
          if (this.epsilon > geom.dist(this.vertices_coords[v], coord)) {
            return v;
          }
        }
      }
    }
    return null;
  };

  RepeatedPointsDS.prototype.key = function(coord) {
    var key, x, xr, y, yr;
    x = coord[0], y = coord[1];
    xr = Math.round(x / this.epsilon);
    yr = Math.round(y / this.epsilon);
    return key = xr + "," + yr;
  };

  RepeatedPointsDS.prototype.insert = function(coord) {
    var base, name, v;
    v = this.lookup(coord);
    if (v != null) {
      return v;
    }
    ((base = this.hash)[name = this.key(coord)] != null ? base[name] : base[name] = []).push(v = this.vertices_coords.length);
    this.vertices_coords.push(coord);
    return v;
  };

  return RepeatedPointsDS;

})();

filter.collapseNearbyVertices = function(fold, epsilon) {
  var coords, old2new, vertices;
  vertices = new RepeatedPointsDS([], epsilon);
  old2new = (function() {
    var k, len, ref, results;
    ref = fold.vertices_coords;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      coords = ref[k];
      results.push(vertices.insert(coords));
    }
    return results;
  })();
  return filter.remapField(fold, 'vertices', old2new);
};

filter.maybeAddVertex = function(fold, coords, epsilon) {

  /*
  Add a new vertex at coordinates `coords` and return its (last) index,
  unless there is already such a vertex within distance `epsilon`,
  in which case return the closest such vertex's index.
   */
  var i;
  i = geom.closestIndex(coords, fold.vertices_coords);
  if ((i != null) && epsilon >= geom.dist(coords, fold.vertices_coords[i])) {
    return i;
  } else {
    return fold.vertices_coords.push(coords) - 1;
  }
};

filter.addVertexLike = function(fold, oldVertexIndex) {
  var k, key, len, ref, vNew;
  vNew = filter.numVertices(fold);
  ref = filter.keysStartingWith(fold, 'vertices_');
  for (k = 0, len = ref.length; k < len; k++) {
    key = ref[k];
    switch (key.slice(6)) {
      case 'vertices':
        break;
      default:
        fold[key][vNew] = fold[key][oldVertexIndex];
    }
  }
  return vNew;
};

filter.addEdgeLike = function(fold, oldEdgeIndex, v1, v2) {
  var eNew, k, key, len, ref;
  eNew = fold.edges_vertices.length;
  ref = filter.keysStartingWith(fold, 'edges_');
  for (k = 0, len = ref.length; k < len; k++) {
    key = ref[k];
    switch (key.slice(6)) {
      case 'vertices':
        fold.edges_vertices.push([v1 != null ? v1 : fold.edges_vertices[oldEdgeIndex][0], v2 != null ? v2 : fold.edges_vertices[oldEdgeIndex][1]]);
        break;
      case 'edges':
        break;
      default:
        fold[key][eNew] = fold[key][oldEdgeIndex];
    }
  }
  return eNew;
};

filter.addVertexAndSubdivide = function(fold, coords, epsilon) {
  var changedEdges, e, i, iNew, k, len, ref, s, u, v;
  v = filter.maybeAddVertex(fold, coords, epsilon);
  changedEdges = [];
  if (v === fold.vertices_coords.length - 1) {
    ref = fold.edges_vertices;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      e = ref[i];
      if (indexOf.call(e, v) >= 0) {
        continue;
      }
      s = (function() {
        var l, len1, results;
        results = [];
        for (l = 0, len1 = e.length; l < len1; l++) {
          u = e[l];
          results.push(fold.vertices_coords[u]);
        }
        return results;
      })();
      if (geom.pointStrictlyInSegment(coords, s)) {
        iNew = filter.addEdgeLike(fold, i, v, e[1]);
        changedEdges.push(i, iNew);
        e[1] = v;
      }
    }
  }
  return [v, changedEdges];
};

filter.removeLoopEdges = function(fold) {

  /*
  Remove edges whose endpoints are identical.  After collapsing via
  `filter.collapseNearbyVertices`, this removes epsilon-length edges.
   */
  var edge;
  return filter.remapFieldSubset(fold, 'edges', (function() {
    var k, len, ref, results;
    ref = fold.edges_vertices;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      edge = ref[k];
      results.push(edge[0] !== edge[1]);
    }
    return results;
  })());
};

filter.subdivideCrossingEdges_vertices = function(fold, epsilon, involvingEdgesFrom) {

  /*
  Using just `vertices_coords` and `edges_vertices` and assuming all in 2D,
  subdivides all crossing/touching edges to form a planar graph.
  In particular, all duplicate and loop edges are also removed.
  
  If called without `involvingEdgesFrom`, does all subdivision in quadratic
  time.  xxx Should be O(n log n) via plane sweep.
  In this case, returns an array of indices of all edges that were subdivided
  (both modified old edges and new edges).
  
  If called with `involvingEdgesFrom`, does all subdivision involving an
  edge numbered `involvingEdgesFrom` or higher.  For example, after adding an
  edge with largest number, call with `involvingEdgesFrom =
  edges_vertices.length - 1`; then this will run in linear time.
  In this case, returns two arrays of edges: the first array are all subdivided
  from the "involved" edges, while the second array is the remaining subdivided
  edges.
   */
  var addEdge, changedEdges, cross, crossI, e, e1, e2, i, i1, i2, k, l, len, len1, len2, len3, m, n, old2new, p, ref, ref1, ref2, ref3, s, s1, s2, u, v, vertices;
  changedEdges = [[], []];
  addEdge = function(v1, v2, oldEdgeIndex, which) {
    var eNew;
    eNew = filter.addEdgeLike(fold, oldEdgeIndex, v1, v2);
    return changedEdges[which].push(oldEdgeIndex, eNew);
  };
  i = involvingEdgesFrom != null ? involvingEdgesFrom : 0;
  while (i < fold.edges_vertices.length) {
    e = fold.edges_vertices[i];
    s = (function() {
      var k, len, results;
      results = [];
      for (k = 0, len = e.length; k < len; k++) {
        u = e[k];
        results.push(fold.vertices_coords[u]);
      }
      return results;
    })();
    ref = fold.vertices_coords;
    for (v = k = 0, len = ref.length; k < len; v = ++k) {
      p = ref[v];
      if (indexOf.call(e, v) >= 0) {
        continue;
      }
      if (geom.pointStrictlyInSegment(p, s)) {
        addEdge(v, e[1], i, 0);
        e[1] = v;
      }
    }
    i++;
  }
  vertices = new RepeatedPointsDS(fold.vertices_coords, epsilon);
  i1 = involvingEdgesFrom != null ? involvingEdgesFrom : 0;
  while (i1 < fold.edges_vertices.length) {
    e1 = fold.edges_vertices[i1];
    s1 = (function() {
      var l, len1, results;
      results = [];
      for (l = 0, len1 = e1.length; l < len1; l++) {
        v = e1[l];
        results.push(fold.vertices_coords[v]);
      }
      return results;
    })();
    ref1 = fold.edges_vertices.slice(0, i1);
    for (i2 = l = 0, len1 = ref1.length; l < len1; i2 = ++l) {
      e2 = ref1[i2];
      s2 = (function() {
        var len2, m, results;
        results = [];
        for (m = 0, len2 = e2.length; m < len2; m++) {
          v = e2[m];
          results.push(fold.vertices_coords[v]);
        }
        return results;
      })();
      if (!filter.edges_verticesIncident(e1, e2) && geom.segmentsCross(s1, s2)) {
        cross = geom.lineIntersectLine(s1, s2);
        if (cross == null) {
          continue;
        }
        crossI = vertices.insert(cross);
        if (!(indexOf.call(e1, crossI) >= 0 && indexOf.call(e2, crossI) >= 0)) {
          if (indexOf.call(e1, crossI) < 0) {
            addEdge(crossI, e1[1], i1, 0);
            e1[1] = crossI;
            s1[1] = fold.vertices_coords[crossI];
          }
          if (indexOf.call(e2, crossI) < 0) {
            addEdge(crossI, e2[1], i2, 1);
            e2[1] = crossI;
          }
        }
      }
    }
    i1++;
  }
  old2new = filter.removeDuplicateEdges_vertices(fold);
  ref2 = [0, 1];
  for (m = 0, len2 = ref2.length; m < len2; m++) {
    i = ref2[m];
    changedEdges[i] = (function() {
      var len3, n, ref3, results;
      ref3 = changedEdges[i];
      results = [];
      for (n = 0, len3 = ref3.length; n < len3; n++) {
        e = ref3[n];
        results.push(old2new[e]);
      }
      return results;
    })();
  }
  old2new = filter.removeLoopEdges(fold);
  ref3 = [0, 1];
  for (n = 0, len3 = ref3.length; n < len3; n++) {
    i = ref3[n];
    changedEdges[i] = (function() {
      var len4, o, ref4, results;
      ref4 = changedEdges[i];
      results = [];
      for (o = 0, len4 = ref4.length; o < len4; o++) {
        e = ref4[o];
        results.push(old2new[e]);
      }
      return results;
    })();
  }
  if (involvingEdgesFrom != null) {
    return changedEdges;
  } else {
    return changedEdges[0].concat(changedEdges[1]);
  }
};

filter.addEdgeAndSubdivide = function(fold, v1, v2, epsilon) {

  /*
  Add an edge between vertex indices or points `v1` and `v2`, subdivide
  as necessary, and return two arrays: all the subdivided parts of this edge,
  and all the other edges that change.
  If the edge is a loop or a duplicate, both arrays will be empty.
   */
  var changedEdges, changedEdges1, changedEdges2, e, i, iNew, k, len, ref, ref1, ref2, ref3, ref4;
  if (v1.length != null) {
    ref = filter.addVertexAndSubdivide(fold, v1, epsilon), v1 = ref[0], changedEdges1 = ref[1];
  }
  if (v2.length != null) {
    ref1 = filter.addVertexAndSubdivide(fold, v2, epsilon), v2 = ref1[0], changedEdges2 = ref1[1];
  }
  if (v1 === v2) {
    return [[], []];
  }
  ref2 = fold.edges_vertices;
  for (i = k = 0, len = ref2.length; k < len; i = ++k) {
    e = ref2[i];
    if ((e[0] === v1 && e[1] === v2) || (e[0] === v2 && e[1] === v1)) {
      return [[i], []];
    }
  }
  iNew = fold.edges_vertices.push([v1, v2]) - 1;
  if (iNew) {
    changedEdges = filter.subdivideCrossingEdges_vertices(fold, epsilon, iNew);
    if (indexOf.call(changedEdges[0], iNew) < 0) {
      changedEdges[0].push(iNew);
    }
  } else {
    changedEdges = [[iNew], []];
  }
  if (changedEdges1 != null) {
    (ref3 = changedEdges[1]).push.apply(ref3, changedEdges1);
  }
  if (changedEdges2 != null) {
    (ref4 = changedEdges[1]).push.apply(ref4, changedEdges2);
  }
  return changedEdges;
};

filter.cutEdges = function(fold, es) {

  /*
  Given a FOLD object with `edges_vertices`, `edges_assignment`, and
  counterclockwise-sorted `vertices_edges`
  (see `FOLD.convert.edges_vertices_to_vertices_edges_sorted`),
  cuts apart ("unwelds") all edges in `es` into pairs of boundary edges.
  When an endpoint of a cut edge ends up on n boundaries,
  it splits into n vertices.
  Preserves above-mentioned properties (so you can then compute faces via
  `FOLD.convert.edges_vertices_to_faces_vertices_edges`),
  but ignores face properties and discards `vertices_vertices` if present.
   */
  var b1, b2, boundaries, e, e1, e2, ev, i, i1, i2, ie, ie1, ie2, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, neighbor, neighbors, o, q, r, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, t, u1, u2, v, v1, v2, ve, vertices_boundaries;
  vertices_boundaries = [];
  ref = filter.boundaryEdges(fold);
  for (k = 0, len = ref.length; k < len; k++) {
    e = ref[k];
    ref1 = fold.edges_vertices[e];
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      v = ref1[l];
      (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e);
    }
  }
  for (m = 0, len2 = es.length; m < len2; m++) {
    e1 = es[m];
    e2 = filter.addEdgeLike(fold, e1);
    ref2 = fold.edges_vertices[e1];
    for (i = n = 0, len3 = ref2.length; n < len3; i = ++n) {
      v = ref2[i];
      ve = fold.vertices_edges[v];
      ve.splice(ve.indexOf(e1) + i, 0, e2);
    }
    ref3 = fold.edges_vertices[e1];
    for (i = o = 0, len4 = ref3.length; o < len4; i = ++o) {
      v1 = ref3[i];
      u1 = fold.edges_vertices[e1][1 - i];
      u2 = fold.edges_vertices[e2][1 - i];
      boundaries = (ref4 = vertices_boundaries[v1]) != null ? ref4.length : void 0;
      if (boundaries >= 2) {
        if (boundaries > 2) {
          throw new Error(vertices_boundaries[v1].length + " boundary edges at vertex " + v1);
        }
        ref5 = vertices_boundaries[v1], b1 = ref5[0], b2 = ref5[1];
        neighbors = fold.vertices_edges[v1];
        i1 = neighbors.indexOf(b1);
        i2 = neighbors.indexOf(b2);
        if (i2 === (i1 + 1) % neighbors.length) {
          if (i2 !== 0) {
            neighbors = neighbors.slice(i2).concat(neighbors.slice(0, +i1 + 1 || 9e9));
          }
        } else if (i1 === (i2 + 1) % neighbors.length) {
          if (i1 !== 0) {
            neighbors = neighbors.slice(i1).concat(neighbors.slice(0, +i2 + 1 || 9e9));
          }
        } else {
          throw new Error("Nonadjacent boundary edges at vertex " + v1);
        }
        ie1 = neighbors.indexOf(e1);
        ie2 = neighbors.indexOf(e2);
        ie = Math.min(ie1, ie2);
        fold.vertices_edges[v1] = neighbors.slice(0, +ie + 1 || 9e9);
        v2 = filter.addVertexLike(fold, v1);
        fold.vertices_edges[v2] = neighbors.slice(1 + ie);
        ref6 = fold.vertices_edges[v2];
        for (q = 0, len5 = ref6.length; q < len5; q++) {
          neighbor = ref6[q];
          ev = fold.edges_vertices[neighbor];
          ev[ev.indexOf(v1)] = v2;
        }
      }
    }
    if ((ref7 = fold.edges_assignment) != null) {
      ref7[e1] = 'B';
    }
    if ((ref8 = fold.edges_assignment) != null) {
      ref8[e2] = 'B';
    }
    ref9 = fold.edges_vertices[e1];
    for (i = r = 0, len6 = ref9.length; r < len6; i = ++r) {
      v = ref9[i];
      (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e1);
    }
    ref10 = fold.edges_vertices[e2];
    for (i = t = 0, len7 = ref10.length; t < len7; i = ++t) {
      v = ref10[i];
      (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e2);
    }
  }
  delete fold.vertices_vertices;
  return fold;
};

filter.edges_vertices_to_vertices_vertices = function(fold) {

  /*
  Works for abstract structures, so NOT SORTED.
  Use sort_vertices_vertices to sort in counterclockwise order.
   */
  var edge, k, len, numVertices, ref, v, vertices_vertices, w;
  numVertices = filter.numVertices(fold);
  vertices_vertices = (function() {
    var k, ref, results;
    results = [];
    for (v = k = 0, ref = numVertices; 0 <= ref ? k < ref : k > ref; v = 0 <= ref ? ++k : --k) {
      results.push([]);
    }
    return results;
  })();
  ref = fold.edges_vertices;
  for (k = 0, len = ref.length; k < len; k++) {
    edge = ref[k];
    v = edge[0], w = edge[1];
    while (v >= vertices_vertices.length) {
      vertices_vertices.push([]);
    }
    while (w >= vertices_vertices.length) {
      vertices_vertices.push([]);
    }
    vertices_vertices[v].push(w);
    vertices_vertices[w].push(v);
  }
  return vertices_vertices;
};

export default filter;
