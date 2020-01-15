
const TreeMaker = function (div) {
  let origami = RabbitEar.origami(div, { folding: false });
  let graph = RabbitEar.graph();

  origami.drawLayer = origami.svg.group();
  let newestNode = graph.newNode({ position: [0.5, 0.5], radius: 0.1 });
  let selectedNode = undefined;

  origami.redraw = function () {
    origami.svg.draw();
    origami.drawLayer.removeChildren();
    graph.nodes
      .map(n => origami.drawLayer.circle(n.position[0], n.position[1], n.radius))
      .forEach((c) => {
        c.setAttribute("fill", "none");
        c.setAttribute("stroke", "#E44f2f");
        c.setAttribute("stroke-width", 0.01);
      });

    graph.nodes
      .map(n => origami.drawLayer.circle(n.position[0], n.position[1], 0.02))
      // .forEach(c => c.setAttribute("fill"))
    graph.edges
      .map(e => e.nodes.map(n => n.position))
      .map(e => origami.drawLayer.line(e[0][0], e[0][1], e[1][0], e[1][1]))
      .forEach((line) => {
        line.setAttribute("stroke-width", 0.01);
        line.setAttribute("stroke", "black");
      });
  };
  origami.redraw();

  origami.svg.onMouseDown = function (mouse) {
    let touchedNode = graph.nodes
      .map(n => Math.sqrt(Math.pow(n.position[0] - mouse[0],2) + Math.pow(n.position[1] - mouse[1],2)))
      .map((d,i) => d < 0.03 ? i : undefined)
      .filter(el => el !== undefined)
      .shift();
    if (touchedNode != null) {
      selectedNode = graph.nodes[touchedNode];
      newestNode = selectedNode;
    } else {
      let newNode = graph.newNode({position: mouse.position, radius: 0.1});
      graph.newEdge(newestNode, newNode);
      newestNode = newNode;
      selectedNode = newNode;
    }
  };

  origami.svg.onMouseMove = function (mouse) {
    if (selectedNode != null) {
      selectedNode.position = mouse.position;
      origami.redraw();
    }
  };

  origami.svg.onMouseUp = function (mouse) {
    selectedNode = undefined;
  };

  const recalculate = function () {
    let nudge = 0.01;
    for (let i = 0; i < graph.nodes.length-1; i++) {
      for (let j = i+1; j < graph.nodes.length; j++) {
        let max = graph.nodes[i].radius + graph.nodes[j].radius;
        let vec_i_j = [
          graph.nodes[j].position[0] - graph.nodes[i].position[0],
          graph.nodes[j].position[1] - graph.nodes[i].position[1]
        ];
        let d = Math.sqrt(vec_i_j[0]*vec_i_j[0] + vec_i_j[1]*vec_i_j[1]);
        if (d < max) {
          graph.nodes[i].position[0] -= (vec_i_j[0] * nudge);
          graph.nodes[i].position[1] -= (vec_i_j[1] * nudge);
          graph.nodes[j].position[0] += (vec_i_j[0] * nudge);
          graph.nodes[j].position[1] += (vec_i_j[1] * nudge);
        }
      }
    }
    origami.redraw();
  };

  let expandLoop = undefined;

  const expand = function () {
    if (expandLoop !== undefined) {
      clearInterval(expandLoop);
      expandLoop = undefined;
    }
    expandLoop = setInterval(function (){
      graph.nodes.forEach(n => n.radius += 0.001);
      recalculate();
    }, 20);
  };

  const contract = function () {
    if (expandLoop !== undefined) {
      clearInterval(expandLoop);
      expandLoop = undefined;
    }
    expandLoop = setInterval(function (){
      graph.nodes.forEach(n => n.radius -= 0.001);
      recalculate();
    }, 20);

  };

  const stop = function () {
    if (expandLoop !== undefined) {
      clearInterval(expandLoop);
      expandLoop = undefined;
    }
  };

  return {
    origami,
    graph,
    expand,
    contract,
    stop
  };
};

let row = document.querySelectorAll(".row")[0];
let tm = TreeMaker(row);

document.querySelector("#button-expand").onclick = function (event) {
  tm.expand();
};
document.querySelector("#button-contract").onclick = function (event) {
  tm.contract();
};
document.querySelector("#button-stop").onclick = function (event) {
  tm.stop();
};
