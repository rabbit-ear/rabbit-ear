import math from "../../include/math";

const Params = function (number, ...args) {
  switch (number) {
    // 4 params: [x1, y1, x2, y2]
    case 1:
    case 2: {
      const flat = math.core.semi_flatten_input(...args);
      if (flat.length === 4) {
        return flat;
      }
      if (flat.length === 2) {
        // ignore components from dimension larger than 2
        if (flat[0].length > 1 && flat[1].length > 1) {
          return [flat[0][0], flat[0][1], flat[1][0], flat[1][1]];
        }
      }
    }
      break;
    case 3: {
      const flat = math.core.semi_flatten_input(...args);
      if (flat.length === 8) {
        return flat;
      }
      if (flat.length === 4) {
        if (flat[0].length >= 2 && flat[1].length >= 2 && flat[2].length >= 2 && flat[3].length >= 2) {
          return [flat[0][0], flat[0][1], flat[1][0], flat[1][1], flat[2][0], flat[2][1], flat[3][0], flat[3][1]];
        }
      }
      if (flat.length === 2) {
        if (flat[0].length >= 4 && flat[1].length >= 4) {
          return [flat[0][0], flat[0][1], flat[0][2], flat[0][3], flat[1][0], flat[1][1], flat[1][2], flat[1][3]];
        }
        return [...math.core.flatten_input(flat[0]), ...math.core.flatten_input(flat[1])];
      }
    }
      break;
    case 4: break;
    case 5: break;
    case 6: break;
    case 7: break;
    default: break;
  }
  return args;
};

export default Params;
