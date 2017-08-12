
cp = new CreasePattern();
cp.nodes = [];
cp.edges = [];
var freq = 12;
var inc = Math.PI/(12*freq * 2);
for(var j = 0; j < 1; j+=inc){
	cp.creaseOnly(new XYPoint(j, 0.5 + 0.45*Math.sin(j*freq)), 
	              new XYPoint((j+inc), 0.5 + 0.45*Math.sin((j+inc)*freq)));
	cp.creaseOnly(new XYPoint(j, 0.5 + 0.45*Math.cos(j*freq)), 
	              new XYPoint((j+inc), 0.5 + 0.45*Math.cos((j+inc)*freq)));
}

// cp.cleanDuplicateNodes(0.01);
// cp.cleanDuplicateNodes(0.025);
cp.cleanDuplicateNodes(0.066);

PaperCreasePattern(cp, "canvas-merge-duplicates");