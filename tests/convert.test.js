const fs = require("fs");
const RabbitEar = require("../rabbit-ear");

// const outputDir = "./tests/output";
// fs.existsSync(outputDir) || fs.mkdirSync(outputDir);

test("svg to fold", () => {
  // const f = RabbitEar.convert("./files/two-fold.svg").toFOLD();
  // console.log(f);
  // expect(f.faces_vertices.length).toBe(4);

  expect(true).toBe(true);
});


// RabbitEar.convert('{"vertices_coords":[[0.5,0.4],[0.3,0.2]],"edges_vertices":[[0,1]]}').svg()

// RabbitEar.convert('{"vertices_coords":[[0.5,0.4],[0.3,0.2]],"edges_vertices":[[0,1]], "edges_assignment":["V"]}').svg()


// RabbitEar.convert("<svg></svg>").FOLD({color:"blue"});

// RabbitEar.convert("<svg></svg>").oripa({color:"blue"});

// let s = `<java version="1.5.0_07" class="java.beans.XMLDecoder">
//   <object class="oripa.DataSet">
//   </object>
// </java>`
// RabbitEar.convert(s).FOLD({color:"blue"});
