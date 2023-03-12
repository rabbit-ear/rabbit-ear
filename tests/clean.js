import fs from "fs";
// const fs = require("fs");

// fs.existsSync(path)
fs.readdirSync("./")
	.filter(s => s.match(/rabbit-ear(.*).js/))
	// .forEach(path => console.log(path));
	.forEach(path => fs.unlinkSync(`./${path}`));

const deleteFolderRecursive = function (path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach((file) => {
			const curPath = `${path}/${file}`;
			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursive(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

deleteFolderRecursive("./tests/files/svg");
