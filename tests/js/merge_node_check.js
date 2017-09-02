var mergeNodeCheck = new OrigamiPaper("canvas-merge-node-check");
mergeNodeCheck.zoomToFit(0.05);

mergeNodeCheck.reset = function(){
	loadSVG("/tests/svg/sea-turtle-base.svg", function(e){ 
		mergeNodeCheck.cp = e;
		mergeNodeCheck.initialize();
		mergeNodeCheck.nodeLayer.visible = true;
		mergeNodeCheck.nodeLayer.bringToFront();
		for(var i = 0; i < mergeNodeCheck.nodeLayer.children.length; i++){
			mergeNodeCheck.nodeLayer.children[i].radius = 0.03;
			mergeNodeCheck.nodeLayer.children[i].fillColor = { hue:220, saturation:0.8, brightness:1, alpha:0.2 };
		}
	});
} 
mergeNodeCheck.reset();