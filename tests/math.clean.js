import fs from "fs";
// import fs from "fs";

// fs.existsSync(path)
fs.readdirSync("./")
	.filter(s => s.match(/math(.*).js/))
	// .forEach(path => console.log(path));
	.forEach(path => fs.unlinkSync(`./${path}`));
