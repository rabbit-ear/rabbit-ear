// a = 2r tan(π/n);

const regularPolygon = (n) => {
  const r = 0.5 / Math.sin(Math.PI / n);
  return Array.from(Array(n))
    .map((_, i) => (i / n) * (2 * Math.PI))
    .map(a => [r * Math.cos(a), r * Math.sin(a)]);
};

const finishBoundary = (cp) => {
  cp.clean();
  cp.edges_assignment = cp.edges_assignment.map(() => "B");
  cp.edges_foldAngle = cp.edges_foldAngle.map(() => 0);
  return cp;
};

const Static = (func) => {
  const set = [
    null, null, null, "triangle", null, "pentagon", "hexagon", "heptagon", "octogon", "nonagon", "decagon", null, "dodecagon"
  ];
  delete set[0];
  delete set[1];
  delete set[2];
  set.forEach((key, i) => {
    func[key] = function () {
      const cp = func(...arguments);
      cp.polygon(regularPolygon(i));
      return finishBoundary(cp);
    };
  });
  func.square = function () {
    const cp = func(...arguments);
    cp.rect(1, 1);
    return finishBoundary(cp);
  };
};

export default Static;
