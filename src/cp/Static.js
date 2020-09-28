
// a = 2r tan(π/n);
const regularPolygon = (n) => {
  const r = 0.5 / Math.sin(Math.PI / n);
  return Array.from(Array(n))
    .map((_, i) => (i / n) * (2 * Math.PI))
    .map(a => [r * Math.cos(a), r * Math.sin(a)]);
};

const finishBoundary = (cp) => {
  cp.clean();
  if (!cp.edges_assignment) { cp.edges_assignment = []; }
  if (!cp.edges_foldAngle) { cp.edges_foldAngle = []; }
  cp.edges_assignment = cp.edges_vertices.map(() => "B");
  cp.edges_foldAngle = cp.edges_vertices.map(() => 0);
  return cp;
};

const Static = (func) => {
  const set = [
    null, null, null, "triangle", null, "pentagon", "hexagon", "heptagon", "octogon", "nonagon", "decagon", null, "dodecagon"
  ];
  // these are all polygons centered at the origin with side-lengths 1.
  set.forEach((key, i) => {
    func[key] = function () {
      const cp = func(...arguments);
      cp.polygon(regularPolygon(i));
      return finishBoundary(cp);
    };
  });
  // this square is unique, it's a unit square, between x and y, 0 and 1.
  func.square = function () {
    const cp = func(...arguments);
    cp.rect(1, 1);
    return finishBoundary(cp);
  };
};

export default Static;
