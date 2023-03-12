import fs from "fs";
// const fs = require("fs");

// fs.existsSync(path)
fs.readdirSync("./")
	.filter(s => s.match(/math(.*).js/))
	// .forEach(path => console.log(path));
	.forEach(path => fs.unlinkSync(`./${path}`));
