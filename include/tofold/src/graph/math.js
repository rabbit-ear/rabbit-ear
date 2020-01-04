const EPSILON = 1e-6;

const magnitude = function (v) {
  const sum = v
    .map(component => component * component)
    .reduce((prev, curr) => prev + curr, 0);
  return Math.sqrt(sum);
};

const normalize = function (v) {
  const m = magnitude(v);
  return m === 0 ? v : v.map(c => c / m);
};

const equivalent = function (a, b, epsilon = EPSILON) {
  for (let i = 0; i < a.length; i += 1) {
    if (Math.abs(a[i] - b[i]) > epsilon) {
      return false;
    }
  }
  return true;
};

const segment_segment_comp_exclusive = (t0, t1) => t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON
  && t1 < 1 - EPSILON;

const intersection_function = function (aPt, aVec, bPt, bVec, compFunc, epsilon = EPSILON) {
  function det(a, b) { return a[0] * b[1] - b[0] * a[1]; }
  const denominator0 = det(aVec, bVec);
  if (Math.abs(denominator0) < epsilon) { return undefined; } /* parallel */
  const denominator1 = -denominator0;
  const numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
  const numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
  const t0 = numerator0 / denominator0;
  const t1 = numerator1 / denominator1;
  if (compFunc(t0, t1, epsilon)) {
    return [aPt[0] + aVec[0] * t0, aPt[1] + aVec[1] * t0];
  }
  return undefined;
};

const segment_segment_exclusive = function (a0, a1, b0, b1, epsilon) {
  const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return intersection_function(a0, aVec, b0, bVec, segment_segment_comp_exclusive, epsilon);
};

const point_on_edge_exclusive = function (point, edge0, edge1, epsilon = EPSILON) {
  const edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
  const edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
  const edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
  const dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
  const dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
  const dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
  return Math.abs(dEdge - dP0 - dP1) < epsilon;
};

export default {
  core: {
    EPSILON,
    magnitude,
    normalize,
    equivalent,
    point_on_edge_exclusive,
    intersection: {
      segment_segment_exclusive
    }
  }
};
