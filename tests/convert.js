const fs = require("fs");
const RabbitEar = require("../rabbit-ear");

const outputDir = "./tests/output";
fs.existsSync(outputDir) || fs.mkdirSync(outputDir);

// convert all .oripa files to .svgs
// from: tests/files/ to: tests/output/
console.log("convert all .oripa files to .svgs");
const dirCont = fs.readdirSync("./tests/files");
const files = dirCont.filter(el => el.match(/.*\.(opx)/ig));
files.forEach((file) => {
  fs.readFile(`./tests/files/${file}`, "utf-8", (err, data) => {
    const svg = RabbitEar.convert(data, "oripa").svg();
    fs.writeFile(`./tests/output/${file}.svg`, svg, (err) => {});
  });
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
