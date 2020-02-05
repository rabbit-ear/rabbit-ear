const fs = require("fs");
const RabbitEar = require("../rabbit-ear");
const outputDir = "./tests/output";
fs.existsSync(outputDir) || fs.mkdirSync(outputDir);

test("convert - async file write bypass", () => {
  expect(true).toBe(true);
});

test("export origami to png", (done) => {
  let origami = RabbitEar.origami();
  origami.load(RabbitEar.bases.frog);
  origami.export.png().then(png => {
    fs.writeFile(`${outputDir}/frog-base.png`, png, () => {
      done();
    });
  });
});

test("export origami to svg", (done) => {
  let origami = RabbitEar.origami();
  origami.load(RabbitEar.bases.frog);
  const svg = origami.export.svg();
  fs.writeFile(`${outputDir}/frog-base.svg`, svg, () => {
    done();
  });
});

test("export origami to oripa", (done) => {
  let origami = RabbitEar.origami();
  origami.load(RabbitEar.bases.frog);
  const oripa = origami.export.oripa();
  fs.writeFile(`${outputDir}/frog-base.oripa`, oripa, () => {
    done();
  });
});


/*
jest.setTimeout(60000);

const outputDir = "./tests/output";
fs.existsSync(outputDir) || fs.mkdirSync(outputDir);

const foldedFrog = RabbitEar.origami();
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
