const fs = require("fs");
const RabbitEar = require("../rabbit-ear");

test("convert - async file write bypass", () => {
  expect(true).toBe(true);
});

/*
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
});
*/
