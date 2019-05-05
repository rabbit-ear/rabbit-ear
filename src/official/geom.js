
/* BASIC GEOMETRY */
var geom = {},
  modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

/*
    Utilities
 */

geom.EPS = 0.000001;

geom.sum = function(a, b) {
  return a + b;
};

geom.min = function(a, b) {
  if (a < b) {
    return a;
  } else {
    return b;
  }
};

geom.max = function(a, b) {
  if (a > b) {
    return a;
  } else {
    return b;
  }
};

geom.all = function(a, b) {
  return a && b;
};

geom.next = function(start, n, i) {
  if (i == null) {
    i = 1;
  }

  /*
  Returns the ith cyclic ordered number after start in the range [0..n].
   */
  return modulo(start + i, n);
};

geom.rangesDisjoint = function(arg, arg1) {
  var a1, a2, b1, b2, ref, ref1;
  a1 = arg[0], a2 = arg[1];
  b1 = arg1[0], b2 = arg1[1];
  return ((b1 < (ref = Math.min(a1, a2)) && ref > b2)) || ((b1 > (ref1 = Math.max(a1, a2)) && ref1 < b2));
};

geom.topologicalSort = function(vs) {
  var k, l, len, len1, list, ref, v;
  for (k = 0, len = vs.length; k < len; k++) {
    v = vs[k];
    ref = [false, null], v.visited = ref[0], v.parent = ref[1];
  }
  list = [];
  for (l = 0, len1 = vs.length; l < len1; l++) {
    v = vs[l];
    if (!v.visited) {
      list = geom.visit(v, list);
    }
  }
  return list;
};

geom.visit = function(v, list) {
  var k, len, ref, u;
  v.visited = true;
  ref = v.children;
  for (k = 0, len = ref.length; k < len; k++) {
    u = ref[k];
    if (!(!u.visited)) {
      continue;
    }
    u.parent = v;
    list = geom.visit(u, list);
  }
  return list.concat([v]);
};

geom.magsq = function(a) {
  return geom.dot(a, a);
};

geom.mag = function(a) {
  return Math.sqrt(geom.magsq(a));
};

geom.unit = function(a, eps) {
  var length;
  if (eps == null) {
    eps = geom.EPS;
  }
  length = geom.magsq(a);
  if (length < eps) {
    return null;
  }
  return geom.mul(a, 1 / geom.mag(a));
};

geom.ang2D = function(a, eps) {
  if (eps == null) {
    eps = geom.EPS;
  }
  if (geom.magsq(a) < eps) {
    return null;
  }
  return Math.atan2(a[1], a[0]);
};

geom.mul = function(a, s) {
  var i, k, len, results;
  results = [];
  for (k = 0, len = a.length; k < len; k++) {
    i = a[k];
    results.push(i * s);
  }
  return results;
};

geom.linearInterpolate = function(t, a, b) {
  return geom.plus(geom.mul(a, 1 - t), geom.mul(b, t));
};

geom.plus = function(a, b) {
  var ai, i, k, len, results;
  results = [];
  for (i = k = 0, len = a.length; k < len; i = ++k) {
    ai = a[i];
    results.push(ai + b[i]);
  }
  return results;
};

geom.sub = function(a, b) {
  return geom.plus(a, geom.mul(b, -1));
};

geom.dot = function(a, b) {
  var ai, i;
  return ((function() {
    var k, len, results;
    results = [];
    for (i = k = 0, len = a.length; k < len; i = ++k) {
      ai = a[i];
      results.push(ai * b[i]);
    }
    return results;
  })()).reduce(geom.sum);
};

geom.distsq = function(a, b) {
  return geom.magsq(geom.sub(a, b));
};

geom.dist = function(a, b) {
  return Math.sqrt(geom.distsq(a, b));
};

geom.closestIndex = function(a, bs) {
  var b, dist, i, k, len, minDist, minI;
  minDist = 2e308;
  for (i = k = 0, len = bs.length; k < len; i = ++k) {
    b = bs[i];
    if (minDist > (dist = geom.dist(a, b))) {
      minDist = dist;
      minI = i;
    }
  }
  return minI;
};

geom.dir = function(a, b) {
  return geom.unit(geom.sub(b, a));
};

geom.ang = function(a, b) {
  var ref, ua, ub, v;
  ref = (function() {
    var k, len, ref, results;
    ref = [a, b];
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      v = ref[k];
      results.push(geom.unit(v));
    }
    return results;
  })(), ua = ref[0], ub = ref[1];
  if (!((ua != null) && (ub != null))) {
    return null;
  }
  return Math.acos(geom.dot(ua, ub));
};

geom.cross = function(a, b) {
  var i, j, ref, ref1;
  if ((a.length === (ref = b.length) && ref === 2)) {
    return a[0] * b[1] - a[1] * b[0];
  }
  if ((a.length === (ref1 = b.length) && ref1 === 3)) {
    return (function() {
      var k, len, ref2, ref3, results;
      ref2 = [[1, 2], [2, 0], [0, 1]];
      results = [];
      for (k = 0, len = ref2.length; k < len; k++) {
        ref3 = ref2[k], i = ref3[0], j = ref3[1];
        results.push(a[i] * b[j] - a[j] * b[i]);
      }
      return results;
    })();
  }
  return null;
};

geom.parallel = function(a, b, eps) {
  var ref, ua, ub, v;
  if (eps == null) {
    eps = geom.EPS;
  }
  ref = (function() {
    var k, len, ref, results;
    ref = [a, b];
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      v = ref[k];
      results.push(geom.unit(v));
    }
    return results;
  })(), ua = ref[0], ub = ref[1];
  if (!((ua != null) && (ub != null))) {
    return null;
  }
  return 1 - Math.abs(geom.dot(ua, ub)) < eps;
};

geom.rotate = function(a, u, t) {
  var ct, i, k, len, p, q, ref, ref1, results, st;
  u = geom.unit(u);
  if (u == null) {
    return null;
  }
  ref = [Math.cos(t), Math.sin(t)], ct = ref[0], st = ref[1];
  ref1 = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
  results = [];
  for (k = 0, len = ref1.length; k < len; k++) {
    p = ref1[k];
    results.push(((function() {
      var l, len1, ref2, results1;
      ref2 = [ct, -st * u[p[2]], st * u[p[1]]];
      results1 = [];
      for (i = l = 0, len1 = ref2.length; l < len1; i = ++l) {
        q = ref2[i];
        results1.push(a[p[i]] * (u[p[0]] * u[p[i]] * (1 - ct) + q));
      }
      return results1;
    })()).reduce(geom.sum));
  }
  return results;
};

geom.interiorAngle = function(a, b, c) {
  var ang;
  ang = geom.ang2D(geom.sub(a, b)) - geom.ang2D(geom.sub(c, b));
  return ang + (ang < 0 ? 2 * Math.PI : 0);
};

geom.turnAngle = function(a, b, c) {
  return Math.PI - geom.interiorAngle(a, b, c);
};

geom.triangleNormal = function(a, b, c) {
  return geom.unit(geom.cross(geom.sub(b, a), geom.sub(c, b)));
};

geom.polygonNormal = function(points, eps) {
  var i, p;
  if (eps == null) {
    eps = geom.EPS;
  }
  return geom.unit(((function() {
    var k, len, results;
    results = [];
    for (i = k = 0, len = points.length; k < len; i = ++k) {
      p = points[i];
      results.push(geom.cross(p, points[geom.next(i, points.length)]));
    }
    return results;
  })()).reduce(geom.plus), eps);
};

geom.twiceSignedArea = function(points) {
  var i, v0, v1;
  return ((function() {
    var k, len, results;
    results = [];
    for (i = k = 0, len = points.length; k < len; i = ++k) {
      v0 = points[i];
      v1 = points[geom.next(i, points.length)];
      results.push(v0[0] * v1[1] - v1[0] * v0[1]);
    }
    return results;
  })()).reduce(geom.sum);
};

geom.polygonOrientation = function(points) {
  return Math.sign(geom.twiceSignedArea(points));
};

geom.sortByAngle = function(points, origin, mapping) {
  if (origin == null) {
    origin = [0, 0];
  }
  if (mapping == null) {
    mapping = function(x) {
      return x;
    };
  }
  origin = mapping(origin);
  return points.sort(function(p, q) {
    var pa, qa;
    pa = geom.ang2D(geom.sub(mapping(p), origin));
    qa = geom.ang2D(geom.sub(mapping(q), origin));
    return pa - qa;
  });
};

geom.segmentsCross = function(arg, arg1) {
  var p0, p1, q0, q1;
  p0 = arg[0], q0 = arg[1];
  p1 = arg1[0], q1 = arg1[1];
  if (geom.rangesDisjoint([p0[0], q0[0]], [p1[0], q1[0]]) || geom.rangesDisjoint([p0[1], q0[1]], [p1[1], q1[1]])) {
    return false;
  }
  return geom.polygonOrientation([p0, q0, p1]) !== geom.polygonOrientation([p0, q0, q1]) && geom.polygonOrientation([p1, q1, p0]) !== geom.polygonOrientation([p1, q1, q0]);
};

geom.parametricLineIntersect = function(arg, arg1) {
  var denom, p1, p2, q1, q2;
  p1 = arg[0], p2 = arg[1];
  q1 = arg1[0], q2 = arg1[1];
  denom = (q2[1] - q1[1]) * (p2[0] - p1[0]) + (q1[0] - q2[0]) * (p2[1] - p1[1]);
  if (denom === 0) {
    return [null, null];
  } else {
    return [(q2[0] * (p1[1] - q1[1]) + q2[1] * (q1[0] - p1[0]) + q1[1] * p1[0] - p1[1] * q1[0]) / denom, (q1[0] * (p2[1] - p1[1]) + q1[1] * (p1[0] - p2[0]) + p1[1] * p2[0] - p2[1] * p1[0]) / denom];
  }
};

geom.segmentIntersectSegment = function(s1, s2) {
  var ref, s, t;
  ref = geom.parametricLineIntersect(s1, s2), s = ref[0], t = ref[1];
  if ((s != null) && ((0 <= s && s <= 1)) && ((0 <= t && t <= 1))) {
    return geom.linearInterpolate(s, s1[0], s1[1]);
  } else {
    return null;
  }
};

geom.lineIntersectLine = function(l1, l2) {
  var ref, s, t;
  ref = geom.parametricLineIntersect(l1, l2), s = ref[0], t = ref[1];
  if (s != null) {
    return geom.linearInterpolate(s, l1[0], l1[1]);
  } else {
    return null;
  }
};

geom.pointStrictlyInSegment = function(p, s, eps) {
  var v0, v1;
  if (eps == null) {
    eps = geom.EPS;
  }
  v0 = geom.sub(p, s[0]);
  v1 = geom.sub(p, s[1]);
  return geom.parallel(v0, v1, eps) && geom.dot(v0, v1) < 0;
};

geom.centroid = function(points) {
  return geom.mul(points.reduce(geom.plus), 1.0 / points.length);
};

geom.basis = function(ps, eps) {
  var d, ds, n, ns, p, x, y, z;
  if (eps == null) {
    eps = geom.EPS;
  }
  if (((function() {
    var k, len, results;
    results = [];
    for (k = 0, len = ps.length; k < len; k++) {
      p = ps[k];
      results.push(p.length !== 3);
    }
    return results;
  })()).reduce(geom.all)) {
    return null;
  }
  ds = (function() {
    var k, len, results;
    results = [];
    for (k = 0, len = ps.length; k < len; k++) {
      p = ps[k];
      if (geom.distsq(p, ps[0]) > eps) {
        results.push(geom.dir(p, ps[0]));
      }
    }
    return results;
  })();
  if (ds.length === 0) {
    return [];
  }
  x = ds[0];
  if (((function() {
    var k, len, results;
    results = [];
    for (k = 0, len = ds.length; k < len; k++) {
      d = ds[k];
      results.push(geom.parallel(d, x, eps));
    }
    return results;
  })()).reduce(geom.all)) {
    return [x];
  }
  ns = (function() {
    var k, len, results;
    results = [];
    for (k = 0, len = ds.length; k < len; k++) {
      d = ds[k];
      results.push(geom.unit(geom.cross(d, x)));
    }
    return results;
  })();
  ns = (function() {
    var k, len, results;
    results = [];
    for (k = 0, len = ns.length; k < len; k++) {
      n = ns[k];
      if (n != null) {
        results.push(n);
      }
    }
    return results;
  })();
  z = ns[0];
  y = geom.cross(z, x);
  if (((function() {
    var k, len, results;
    results = [];
    for (k = 0, len = ns.length; k < len; k++) {
      n = ns[k];
      results.push(geom.parallel(n, z, eps));
    }
    return results;
  })()).reduce(geom.all)) {
    return [x, y];
  }
  return [x, y, z];
};

geom.above = function(ps, qs, n, eps) {
  var pn, qn, ref, v, vs;
  if (eps == null) {
    eps = geom.EPS;
  }
  ref = (function() {
    var k, len, ref, results;
    ref = [ps, qs];
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      vs = ref[k];
      results.push((function() {
        var l, len1, results1;
        results1 = [];
        for (l = 0, len1 = vs.length; l < len1; l++) {
          v = vs[l];
          results1.push(geom.dot(v, n));
        }
        return results1;
      })());
    }
    return results;
  })(), pn = ref[0], qn = ref[1];
  if (qn.reduce(geom.max) - pn.reduce(geom.min) < eps) {
    return 1;
  }
  if (pn.reduce(geom.max) - qn.reduce(geom.min) < eps) {
    return -1;
  }
  return 0;
};

geom.separatingDirection2D = function(t1, t2, n, eps) {
  var i, j, k, l, len, len1, len2, m, o, p, q, ref, sign, t;
  if (eps == null) {
    eps = geom.EPS;
  }
  ref = [t1, t2];
  for (k = 0, len = ref.length; k < len; k++) {
    t = ref[k];
    for (i = l = 0, len1 = t.length; l < len1; i = ++l) {
      p = t[i];
      for (j = o = 0, len2 = t.length; o < len2; j = ++o) {
        q = t[j];
        if (!(i < j)) {
          continue;
        }
        m = geom.unit(geom.cross(geom.sub(p, q), n));
        if (m != null) {
          sign = geom.above(t1, t2, m, eps);
          if (sign !== 0) {
            return geom.mul(m, sign);
          }
        }
      }
    }
  }
  return null;
};

geom.separatingDirection3D = function(t1, t2, eps) {
  var i, j, k, l, len, len1, len2, len3, m, o, p, q1, q2, r, ref, ref1, sign, x1, x2;
  if (eps == null) {
    eps = geom.EPS;
  }
  ref = [[t1, t2], [t2, t1]];
  for (k = 0, len = ref.length; k < len; k++) {
    ref1 = ref[k], x1 = ref1[0], x2 = ref1[1];
    for (l = 0, len1 = x1.length; l < len1; l++) {
      p = x1[l];
      for (i = o = 0, len2 = x2.length; o < len2; i = ++o) {
        q1 = x2[i];
        for (j = r = 0, len3 = x2.length; r < len3; j = ++r) {
          q2 = x2[j];
          if (!(i < j)) {
            continue;
          }
          m = geom.unit(geom.cross(geom.sub(p, q1), geom.sub(p, q2)));
          if (m != null) {
            sign = geom.above(t1, t2, m, eps);
            if (sign !== 0) {
              return geom.mul(m, sign);
            }
          }
        }
      }
    }
  }
  return null;
};

geom.circleCross = function(d, r1, r2) {
  var x, y;
  x = (d * d - r2 * r2 + r1 * r1) / d / 2;
  y = Math.sqrt(r1 * r1 - x * x);
  return [x, y];
};

geom.creaseDir = function(u1, u2, a, b, eps) {
  var b1, b2, x, y, z, zmag;
  if (eps == null) {
    eps = geom.EPS;
  }
  b1 = Math.cos(a) + Math.cos(b);
  b2 = Math.cos(a) - Math.cos(b);
  x = geom.plus(u1, u2);
  y = geom.sub(u1, u2);
  z = geom.unit(geom.cross(y, x));
  x = geom.mul(x, b1 / geom.magsq(x));
  y = geom.mul(y, geom.magsq(y) < eps ? 0 : b2 / geom.magsq(y));
  zmag = Math.sqrt(1 - geom.magsq(x) - geom.magsq(y));
  z = geom.mul(z, zmag);
  return [x, y, z].reduce(geom.plus);
};

geom.quadSplit = function(u, p, d, t) {
  if (geom.magsq(p) > d * d) {
    throw new Error("STOP! Trying to split expansive quad.");
  }
  return geom.mul(u, (d * d - geom.magsq(p)) / 2 / (d * Math.cos(t) - geom.dot(u, p)));
};

export default geom;