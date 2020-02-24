import math from "../../include/math";

const Params = function (number, ...args) {
  const params = math.core.semi_flatten_input(...args);
  switch (number) {
    case 1:
    case 2: {
      if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
        if (params[0].points == null) { throw new Error("axiom .points property needed"); }
        return params[0].points.map(p => math.core.get_vector(p));
      }
      if (params.length === 2) {
        return params.map(p => math.core.get_vector(p))
      }
      if (params.length === 4 && typeof params[0] === "number") {
        return [[params[0], params[1]], [params[2], params[3]]];
      }
    }
      break;
    case 3: {
      if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
        if (params[0].lines != null && params[0].lines.length > 0) {
          const lines = params[0].lines.map(l => math.core.get_line(l));
          return [lines[0].origin, lines[0].vector, lines[1].origin, lines[1].vector];
        }
        if (params[0].points != null && params[0].vectors != null) {
          const points = params[0].points.map(p => math.core.get_vector(p));
          const vectors = params[0].vectors.map(p => math.core.get_vector(p));
          return [points[0], vectors[0], points[1], vectors[1]];
        }
      }
      // if (params.length === 8) {
      //   return params;
      // }
      // if (params.length === 4) {
      //   if (params[0].length >= 2 && params[1].length >= 2 && params[2].length >= 2 && params[3].length >= 2) {
      //     return [params[0][0], params[0][1], params[1][0], params[1][1], params[2][0], params[2][1], params[3][0], params[3][1]];
      //   }
      // }
      // if (params.length === 2) {
      //   if (params[0].length >= 4 && params[1].length >= 4) {
      //     return [params[0][0], params[0][1], params[0][2], params[0][3], params[1][0], params[1][1], params[1][2], params[1][3]];
      //   }
      //   return [...math.core.flatten_input(params[0]), ...math.core.flatten_input(params[1])];
      // }
    }
      break;
    case 4: {
      // pointA, vectorA, pointB
      if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
        // { points: __, lines: ___ }
        if (params[0].lines != null && params[0].lines.length > 0
          && params[0].points != null && params[0].points.length > 0) {
          const lines = params[0].lines.map(l => math.core.get_line(l));
          const points = params[0].points.map(p => math.core.get_vector(p));
          return [lines[0].origin, lines[0].vector, points[0]];
        }
      }
    }
    break;
    case 5: {
      // pointA, vectorA, pointB, pointC
      if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
        // { points: __, lines: ___ }
        if (params[0].lines != null && params[0].lines.length > 0
          && params[0].points != null && params[0].points.length > 0) {
          const lines = params[0].lines.map(l => math.core.get_line(l));
          const points = params[0].points.map(p => math.core.get_vector(p));
          
          return [lines[0].origin, lines[0].vector, points[0], points[1]];
        }
      }
    }
    break;
    case 6: {
      // pointA, vectorA, pointB, vectorB, pointC, pointD
      if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
        // { points: __, lines: ___ }
        if (params[0].lines != null && params[0].lines.length > 0
          && params[0].points != null && params[0].points.length > 0) {
          const lines = params[0].lines.map(l => math.core.get_line(l));
          const points = params[0].points.map(p => math.core.get_vector(p));
          return [lines[0].origin, lines[0].vector, lines[1].origin, lines[1].vector, points[0], points[1]];
        }
      }
    }
    break;
    case 7: {
      // pointA, vectorA, pointB, vectorB, pointC
      if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
        // { points: __, lines: ___ }
        if (params[0].lines != null && params[0].lines.length > 0
          && params[0].points != null && params[0].points.length > 0) {
          const lines = params[0].lines.map(l => math.core.get_line(l));
          const points = params[0].points.map(p => math.core.get_vector(p));
          return [lines[0].origin, lines[0].vector, lines[1].origin, lines[1].vector, points[0]];
        }
      }
    }
    break;
    default: break;
  }
  return args;
};

export default Params;
