// this is the pass-through function you run EVERYTIME you load a .fold
// file from an outside source. - this converts everytihng into strict types
// for example foldAngles can contain nil, we need to define these

const sanitize = function (fold) {
  // vertices_coords
  if (fold.vertices_coords != null) {
    fold.vertices_coords.forEach((v, i) => {
      if (typeof v === "object" && v.constructor === Array) {
        v.forEach((n, j) => {
          if (typeof n === "number") {
            if (isNaN(n) || !isFinite(n)) {
              fold.vertices_coords[i][j] = 0;
            }
          } else if (n === null || n === undefined) {
            fold.vertices_coords[i][j] = 0;
          } else {
            // throw a warning. what is going on?
          }
        });
      } else {
        // entry in vertices_coords is not an array
      }
    });
  }

  // edges_vertices
};

export default sanitize;
