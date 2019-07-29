
/* FOLD FORMAT MANIPULATORS */
var convert = {},
  modulo = function(a, b) { return (+a % (b = +b) + b) % b; },
  hasProp = {}.hasOwnProperty;

import {default as geom} from "./geom";
import {default as filter} from "./filter";

convert.edges_vertices_to_vertices_vertices_unsorted = function(fold) {

  /*
  Works for abstract structures, so NOT SORTED.
  Use sort_vertices_vertices to sort in counterclockwise order.
   */
  fold.vertices_vertices = filter.edges_vertices_to_vertices_vertices(fold);
  return fold;
};

convert.edges_vertices_to_vertices_vertices_sorted = function(fold) {

  /*
  Given a FOLD object with 2D `vertices_coords` and `edges_vertices` property
  (defining edge endpoints), automatically computes the `vertices_vertices`
  property and sorts them counterclockwise by angle in the plane.
   */
  convert.edges_vertices_to_vertices_vertices_unsorted(fold);
  return convert.sort_vertices_vertices(fold);
};

convert.edges_vertices_to_vertices_edges_sorted = function(fold) {

  /*
  Given a FOLD object with 2D `vertices_coords` and `edges_vertices` property
  (defining edge endpoints), automatically computes the `vertices_edges`
  and `vertices_vertices` property and sorts them counterclockwise by angle
  in the plane.
   */
  convert.edges_vertices_to_vertices_vertices_sorted(fold);
  return convert.vertices_vertices_to_vertices_edges(fold);
};

convert.sort_vertices_vertices = function(fold) {

  /*
  Sorts `fold.vertices_neighbords` in counterclockwise order using
  `fold.vertices_coordinates`.  2D only.
  Constructs `fold.vertices_neighbords` if absent, via
  `convert.edges_vertices_to_vertices_vertices`.
   */
  var neighbors, ref, ref1, ref2, v;
  if (((ref = fold.vertices_coords) != null ? (ref1 = ref[0]) != null ? ref1.length : void 0 : void 0) !== 2) {
    console.log("fold.vertices_coords", fold.vertices_coords);
    throw new Error("sort_vertices_vertices: Vertex coordinates missing or not two dimensional");
  }
  if (fold.vertices_vertices == null) {
    convert.edges_vertices_to_vertices_vertices(fold);
  }
  ref2 = fold.vertices_vertices;
  for (v in ref2) {
    neighbors = ref2[v];
    geom.sortByAngle(neighbors, v, function(x) {
      return fold.vertices_coords[x];
    });
  }
  return fold;
};

convert.vertices_vertices_to_faces_vertices = function(fold) {

  /*
  Given a FOLD object with counterclockwise-sorted `vertices_vertices`
  property, constructs the implicitly defined faces, setting `faces_vertices`
  property.
   */
  var face, i, j, k, key, l, len, len1, len2, neighbors, next, ref, ref1, ref2, ref3, u, uv, v, w, x;
  next = {};
  ref = fold.vertices_vertices;
  for (v = j = 0, len = ref.length; j < len; v = ++j) {
    neighbors = ref[v];
    for (i = k = 0, len1 = neighbors.length; k < len1; i = ++k) {
      u = neighbors[i];
      next[u + "," + v] = neighbors[modulo(i - 1, neighbors.length)];
    }
  }
  fold.faces_vertices = [];
  ref1 = (function() {
    var results;
    results = [];
    for (key in next) {
      results.push(key);
    }
    return results;
  })();
  for (l = 0, len2 = ref1.length; l < len2; l++) {
    uv = ref1[l];
    w = next[uv];
    if (w == null) {
      continue;
    }
    next[uv] = null;
    ref2 = uv.split(','), u = ref2[0], v = ref2[1];
    u = parseInt(u);
    v = parseInt(v);
    face = [u, v];
    while (w !== face[0]) {
      if (w == null) {
        console.warn("Confusion with face " + face);
        break;
      }
      face.push(w);
      ref3 = [v, w], u = ref3[0], v = ref3[1];
      w = next[u + "," + v];
      next[u + "," + v] = null;
    }
    next[face[face.length - 1] + "," + face[0]] = null;
    if ((w != null) && geom.polygonOrientation((function() {
      var len3, m, results;
      results = [];
      for (m = 0, len3 = face.length; m < len3; m++) {
        x = face[m];
        results.push(fold.vertices_coords[x]);
      }
      return results;
    })()) > 0) {
      fold.faces_vertices.push(face);
    }
  }
  return fold;
};

convert.vertices_edges_to_faces_vertices_edges = function(fold) {

  /*
  Given a FOLD object with counterclockwise-sorted `vertices_edges` property,
  constructs the implicitly defined faces, setting both `faces_vertices`
  and `faces_edges` properties.  Handles multiple edges to the same vertex
  (unlike `FOLD.convert.vertices_vertices_to_faces_vertices`).
   */
  var e, e1, e2, edges, i, j, k, l, len, len1, len2, len3, m, neighbors, next, nexts, ref, ref1, v, vertex, vertices, x;
  next = [];
  ref = fold.vertices_edges;
  for (v = j = 0, len = ref.length; j < len; v = ++j) {
    neighbors = ref[v];
    next[v] = {};
    for (i = k = 0, len1 = neighbors.length; k < len1; i = ++k) {
      e = neighbors[i];
      next[v][e] = neighbors[modulo(i - 1, neighbors.length)];
    }
  }
  fold.faces_vertices = [];
  fold.faces_edges = [];
  for (vertex = l = 0, len2 = next.length; l < len2; vertex = ++l) {
    nexts = next[vertex];
    for (e1 in nexts) {
      e2 = nexts[e1];
      if (e2 == null) {
        continue;
      }
      e1 = parseInt(e1);
      nexts[e1] = null;
      edges = [e1];
      vertices = [filter.edges_verticesIncident(fold.edges_vertices[e1], fold.edges_vertices[e2])];
      if (vertices[0] == null) {
        throw new Error("Confusion at edges " + e1 + " and " + e2);
      }
      while (e2 !== edges[0]) {
        if (e2 == null) {
          console.warn("Confusion with face containing edges " + edges);
          break;
        }
        edges.push(e2);
        ref1 = fold.edges_vertices[e2];
        for (m = 0, len3 = ref1.length; m < len3; m++) {
          v = ref1[m];
          if (v !== vertices[vertices.length - 1]) {
            vertices.push(v);
            break;
          }
        }
        e1 = e2;
        e2 = next[v][e1];
        next[v][e1] = null;
      }
      if ((e2 != null) && geom.polygonOrientation((function() {
        var len4, n, results;
        results = [];
        for (n = 0, len4 = vertices.length; n < len4; n++) {
          x = vertices[n];
          results.push(fold.vertices_coords[x]);
        }
        return results;
      })()) > 0) {
        fold.faces_vertices.push(vertices);
        fold.faces_edges.push(edges);
      }
    }
  }
  return fold;
};

convert.edges_vertices_to_faces_vertices = function(fold) {

  /*
  Given a FOLD object with 2D `vertices_coords` and `edges_vertices`,
  computes a counterclockwise-sorted `vertices_vertices` property and
  constructs the implicitly defined faces, setting `faces_vertices` property.
   */
  convert.edges_vertices_to_vertices_vertices_sorted(fold);
  return convert.vertices_vertices_to_faces_vertices(fold);
};

convert.edges_vertices_to_faces_vertices_edges = function(fold) {

  /*
  Given a FOLD object with 2D `vertices_coords` and `edges_vertices`,
  computes counterclockwise-sorted `vertices_vertices` and `vertices_edges`
  properties and constructs the implicitly defined faces, setting
  both `faces_vertices` and `faces_edges` property.
   */
  convert.edges_vertices_to_vertices_edges_sorted(fold);
  return convert.vertices_edges_to_faces_vertices_edges(fold);
};

convert.vertices_vertices_to_vertices_edges = function(fold) {

  /*
  Given a FOLD object with `vertices_vertices` and `edges_vertices`,
  fills in the corresponding `vertices_edges` property (preserving order).
   */
  var edge, edgeMap, i, j, len, ref, ref1, v1, v2, vertex, vertices;
  edgeMap = {};
  ref = fold.edges_vertices;
  for (edge = j = 0, len = ref.length; j < len; edge = ++j) {
    ref1 = ref[edge], v1 = ref1[0], v2 = ref1[1];
    edgeMap[v1 + "," + v2] = edge;
    edgeMap[v2 + "," + v1] = edge;
  }
  return fold.vertices_edges = (function() {
    var k, len1, ref2, results;
    ref2 = fold.vertices_vertices;
    results = [];
    for (vertex = k = 0, len1 = ref2.length; k < len1; vertex = ++k) {
      vertices = ref2[vertex];
      results.push((function() {
        var l, ref3, results1;
        results1 = [];
        for (i = l = 0, ref3 = vertices.length; 0 <= ref3 ? l < ref3 : l > ref3; i = 0 <= ref3 ? ++l : --l) {
          results1.push(edgeMap[vertex + "," + vertices[i]]);
        }
        return results1;
      })());
    }
    return results;
  })();
};

convert.faces_vertices_to_faces_edges = function(fold) {

  /*
  Given a FOLD object with `faces_vertices` and `edges_vertices`,
  fills in the corresponding `faces_edges` property (preserving order).
   */
  var edge, edgeMap, face, i, j, len, ref, ref1, v1, v2, vertices;
  edgeMap = {};
  ref = fold.edges_vertices;
  for (edge = j = 0, len = ref.length; j < len; edge = ++j) {
    ref1 = ref[edge], v1 = ref1[0], v2 = ref1[1];
    edgeMap[v1 + "," + v2] = edge;
    edgeMap[v2 + "," + v1] = edge;
  }
  return fold.faces_edges = (function() {
    var k, len1, ref2, results;
    ref2 = fold.faces_vertices;
    results = [];
    for (face = k = 0, len1 = ref2.length; k < len1; face = ++k) {
      vertices = ref2[face];
      results.push((function() {
        var l, ref3, results1;
        results1 = [];
        for (i = l = 0, ref3 = vertices.length; 0 <= ref3 ? l < ref3 : l > ref3; i = 0 <= ref3 ? ++l : --l) {
          results1.push(edgeMap[vertices[i] + "," + vertices[(i + 1) % vertices.length]]);
        }
        return results1;
      })());
    }
    return results;
  })();
};

convert.faces_vertices_to_edges = function(mesh) {

  /*
  Given a FOLD object with just `faces_vertices`, automatically fills in
  `edges_vertices`, `edges_faces`, `faces_edges`, and `edges_assignment`.
   */
  var edge, edgeMap, face, i, key, ref, v1, v2, vertices;
  mesh.edges_vertices = [];
  mesh.edges_faces = [];
  mesh.faces_edges = [];
  mesh.edges_assignment = [];
  edgeMap = {};
  ref = mesh.faces_vertices;
  for (face in ref) {
    vertices = ref[face];
    face = parseInt(face);
    mesh.faces_edges.push((function() {
      var j, len, results;
      results = [];
      for (i = j = 0, len = vertices.length; j < len; i = ++j) {
        v1 = vertices[i];
        v1 = parseInt(v1);
        v2 = vertices[(i + 1) % vertices.length];
        if (v1 <= v2) {
          key = v1 + "," + v2;
        } else {
          key = v2 + "," + v1;
        }
        if (key in edgeMap) {
          edge = edgeMap[key];
        } else {
          edge = edgeMap[key] = mesh.edges_vertices.length;
          if (v1 <= v2) {
            mesh.edges_vertices.push([v1, v2]);
          } else {
            mesh.edges_vertices.push([v2, v1]);
          }
          mesh.edges_faces.push([null, null]);
          mesh.edges_assignment.push('B');
        }
        if (v1 <= v2) {
          mesh.edges_faces[edge][0] = face;
        } else {
          mesh.edges_faces[edge][1] = face;
        }
        results.push(edge);
      }
      return results;
    })());
  }
  return mesh;
};

convert.deepCopy = function(fold) {
  var copy, item, j, key, len, ref, results, value;
  if ((ref = typeof fold) === 'number' || ref === 'string' || ref === 'boolean') {
    return fold;
  } else if (Array.isArray(fold)) {
    results = [];
    for (j = 0, len = fold.length; j < len; j++) {
      item = fold[j];
      results.push(convert.deepCopy(item));
    }
    return results;
  } else {
    copy = {};
    for (key in fold) {
      if (!hasProp.call(fold, key)) continue;
      value = fold[key];
      copy[key] = convert.deepCopy(value);
    }
    return copy;
  }
};

convert.toJSON = function(fold) {
  var key, obj, value;
  return "{\n" + ((function() {
    var results;
    results = [];
    // i made a change here - Robby
    // for (key in fold) {
    var keys = Object.keys(fold);
    for(var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      key = keys[keyIndex];
      value = fold[key];
      results.push(("  " + (JSON.stringify(key)) + ": ") + (Array.isArray(value) ? "[\n" + ((function() {
        var j, len, results1;
        results1 = [];
        for (j = 0, len = value.length; j < len; j++) {
          obj = value[j];
          results1.push("    " + (JSON.stringify(obj)));
        }
        return results1;
      })()).join(',\n') + "\n  ]" : JSON.stringify(value)));
    }
    return results;
  })()).join(',\n') + "\n}\n";
};

convert.extensions = {};

convert.converters = {};

convert.getConverter = function(fromExt, toExt) {
  if (fromExt === toExt) {
    return function(x) {
      return x;
    };
  } else {
    return convert.converters["" + fromExt + toExt];
  }
};

convert.setConverter = function(fromExt, toExt, converter) {
  convert.extensions[fromExt] = true;
  convert.extensions[toExt] = true;
  return convert.converters["" + fromExt + toExt] = converter;
};

convert.convertFromTo = function(data, fromExt, toExt) {
  var converter;
  if (fromExt[0] !== '.') {
    fromExt = "." + fromExt;
  }
  if (toExt[0] !== '.') {
    toExt = "." + toExt;
  }
  converter = convert.getConverter(fromExt, toExt);
  if (converter == null) {
    if (fromExt === toExt) {
      return data;
    }
    throw new Error("No converter from " + fromExt + " to " + toExt);
  }
  return converter(data);
};

convert.convertFrom = function(data, fromExt) {
  return convert.convertFromTo(data, fromExt, '.fold');
};

convert.convertTo = function(data, toExt) {
  return convert.convertFromTo(data, '.fold', toExt);
};

// convert.oripa = require('./oripa');

export default convert;