const fs = require("fs");
const RabbitEar = require("../rabbit-ear");

const outputDir = "./tests/output";
fs.existsSync(outputDir) || fs.mkdirSync(outputDir);

// convert all .oripa files to .svgs
// from: tests/files/ to: tests/output/
console.log("convert all .oripa files to .svgs");
const dirCont = fs.readdirSync("./tests/files");
const files = dirCont.filter(el => el.match(/.*\.(opx)/ig));
files.forEach(file => {
  fs.readFile(`./tests/files/${file}`, "utf-8", (err, data) => {
    const svg = RabbitEar.convert(data, "oripa").svg();
    fs.writeFile(`./tests/output/${file}.svg`, svg, (err) => {});
  });
});
