import fs from "fs";

fs.readdirSync("./")
	.filter(s => s.match(/rabbit-ear(.*).js/))
	.forEach(path => fs.unlinkSync(`./${path}`));

fs.rm("./docs", { recursive: true, force: true }, () => {});
fs.rm("./module", { recursive: true, force: true }, () => {});
fs.rm("./types", { recursive: true, force: true }, () => {});
