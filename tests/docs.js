// this is no longer needed, the package.json contains a simple one line script

// import fs from "fs";
// import TypeDoc from "typedoc";

// // const prepareCache = () => {
// // 	fs.rmSync("./tmp", { recursive: true, force: true });
// // 	// fs.rmSync("./docs", { recursive: true, force: true });
// // 	fs.mkdirSync("./tmp");
// // 	// fs.mkdirSync("./docs");
// // };

// const outputDir = "./docs";
// // const entryPoints = ["./src/index.js"];
// const entryPoints = ["./src/*"];

// const makeDocs = async () => {
// 	// prepareCache();
// 	const app = await TypeDoc.Application.bootstrapWithPlugins({ entryPoints });
// 	const project = await app.convert();
// 	if (project) {
// 		// Rendered docs
// 		await app.generateDocs(project, outputDir);
// 		// Alternatively generate JSON output
// 		await app.generateJson(project, `${outputDir}/documentation.json`);
// 	}
// };

// makeDocs();
