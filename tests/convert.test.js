const fs = require("fs");
const RabbitEar = require("../rabbit-ear");

jest.setTimeout(60000);

const outputDir = "./tests/output";
fs.existsSync(outputDir) || fs.mkdirSync(outputDir);


const foldedFrog = RabbitEar.Origami();
foldedFrog.load(RabbitEar.bases.frog);
foldedFrog.fold();
fs.writeFile("./tests/output/folded-frog-base.svg", foldedFrog.export.svg(), (err) => {});


// convert all .oripa files to .svgs
// from: tests/files/ to: tests/output/
test("convert all .oripa files to .svgs", (done) => {
  const dirCont = fs.readdirSync("./tests/files");
  const files = dirCont.filter(el => el.match(/.*\.(opx)/ig));
  let test_count = files.length;
  // expect.assertions(files.length);
  files.forEach((file) => {
    fs.readFile(`./tests/files/${file}`, "utf-8", (err, data) => {
      const svg = RabbitEar.convert(data, "oripa").svg();
      test_count -= 1;
      if (test_count === 0) {
        expect(true).toBe(true);
        done();
      }
      fs.writeFile(`./tests/output/${file}.svg`, svg, (err) => {});
    });
  });

  // const f = RabbitEar.convert("./files/two-fold.svg").toFOLD();
  // console.log(f);
  // expect(f.faces_vertices.length).toBe(4);
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
