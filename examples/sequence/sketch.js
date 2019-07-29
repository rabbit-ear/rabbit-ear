const container = document.getElementById("folding-sequence");
let prevCP;
const STEPS = 5;

for (let i = 0; i < STEPS; i += 1) {
  // grab the crease pattern from the previous step if it exists
  const cp = (prevCP != null) ? prevCP.copy() : RabbitEar.Origami({ view: null });

  // generate the geometry for a random crease line
  const origin = [Math.random(), Math.random()];
  const angle = Math.random() * Math.PI * 2;
  const vecA = [Math.cos(angle), Math.sin(angle)];
  // var vecB = [-vecA.x, -vecA.y];

  // crease origami paper
  // todo: need to be able to pass objects {x:, y:} in each arg, in each method
  cp.valleyFold(origin, vecA); // .forEach((c) => c.valley());
  // cp.clean();

  // create html components
  const lineHeader = document.createElement("h2");
  lineHeader.innerHTML = `${(i + 1)}.`;
  container.appendChild(lineHeader);
  const row = document.createElement("div");
  row.className = "row";
  container.appendChild(row);

  // new svgs, fill them with the crease pattern
  const origami = RabbitEar.Origami(row, cp);
  const fold = RabbitEar.Origami(row, cp);
  fold.fold();
  prevCP = cp;
}
