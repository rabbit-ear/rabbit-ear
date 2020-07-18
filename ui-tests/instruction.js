let instruct = RabbitEar.origami("canvas-instruction", {padding:0.01});
instruct.instructionLayer = instruct.g();
instruct.load("../files/fold/instruction.fold", function() {
	instruct.renderInstructions(instruct.instructionLayer);
});

instruct.renderInstructions = function(group) {
	if (instruct.cp["re:instructions"] === undefined) { return; }
	if (instruct.cp["re:instructions"].length === 0) { return; }

	instruct.cp["re:instructions"].forEach(instruction => {
		// draw crease lines
		if ("re:instruction_creaseLines" in instruction === true) {
			instruction["re:instruction_creaseLines"].forEach(crease => {
				let creaseClass = ("re:instruction_creaseLines_class" in crease)
					? crease["re:instruction_creaseLines_class"]
					: "valley"; // unspecified should throw error really
				let pts = crease["re:instruction_creaseLines_endpoints"]
				if (pts !== undefined) {
					let l = group.line(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
					l.setAttribute("class", creaseClass);
				}
			});
		}
		// draw arrows and instruction markings
		if ("re:instruction_arrows" in instruction === true) {
			instruction["re:instruction_arrows"].forEach(arrow => {
				let start = arrow["re:instruction_arrows_start"];
				let end = arrow["re:instruction_arrows_end"];
				if (start === undefined || end === undefined) { return; }
				group.arcArrow(start, end);
			});
		}
	});
}
