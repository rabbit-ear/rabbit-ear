<?php include 'header.php';?>

<h1>CLEAN</h1>

<section id="intro">

	<div class="centered">
		<pre><code>graph.<f>clean</f>()</code></pre>
	</div>
	<div class="quote">
		<p>Cleaning a planar graph, it's now possible to merge nodes that are near each other</p>
	</div>

	<div id="divP5_merge" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code><span id="div-node-count"></span> nodes, <span id="div-edge-count"></span> edges</code></pre>
	</div>

	<div class="centered">
		<pre><code><span id="span-merge-result"></span>← graph.<f>mergeDuplicateVertices</f>(<n>epsilon</n>)</code></pre>
	</div>

	<div class="explain">
		<div>
			<p><b>Epsilon</b> is the radius around a point where merging occurs. It's a fraction of the size of the canvas. A larger number will merge across a further distance.</p>
		</div>
	</div>

	<div class="centered">
		<canvas id="canvas1" resize></canvas>
		<canvas id="canvas2" resize></canvas>
		<canvas id="canvas3" resize></canvas>
	</div>

	<div class="tests">
		<ul>
			<li><a href="../tests/html/merge_node_check.html">merge node transparency check</a></li>
			<li>mergeDuplicateVertices(epsilon:number)</li>
		</ul>
	</div>

</section>


<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/11_merge_duplicates.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/blank.js"></script>

<script>
	var p5b = new p5(_11_merge_duplicates, 'divP5_merge');
	p5b.callback = function(nodecount, edgecount, mergeInfo){
		$("#div-node-count").html(nodecount);
		$("#div-edge-count").html(edgecount);
		// if(mergeInfo != undefined){
		// 	var xString = (mergeInfo.x).toFixed(2);
		// 	var yString = (mergeInfo.y).toFixed(2);
		// 	var string = "{x:" + xString + ", y:" + yString + ", nodes:[" + mergeInfo.nodes[0] +"," + mergeInfo.nodes[1] + "]}";
		// 	$("#span-merge-result").html(string);
		// }
	}
</script>

<script>
	var cp = [];
	for(var i = 0; i < 3; i++){
		cp[i] = new CreasePattern();
		cp[i].nodes = [];
		cp[i].edges = [];
		var freq = 12;
		var inc = Math.PI/(12*freq * 2);
		for(var j = 0; j < 1; j+=inc){
			cp[i].creaseOnly(new XYPoint(j, 0.5 + 0.45*Math.sin(j*freq)), 
			              new XYPoint((j+inc), 0.5 + 0.45*Math.sin((j+inc)*freq)));
			cp[i].creaseOnly(new XYPoint(j, 0.5 + 0.45*Math.cos(j*freq)), 
			              new XYPoint((j+inc), 0.5 + 0.45*Math.cos((j+inc)*freq)));
		}
	}

	cp[0].mergeDuplicateVertices(0.01);
	cp[1].mergeDuplicateVertices(0.025);
	cp[2].mergeDuplicateVertices(0.066);
	fillCanvasWithCP("canvas1", cp[0]);
	fillCanvasWithCP("canvas2", cp[1]);
	fillCanvasWithCP("canvas3", cp[2]);

</script>

<?php include 'footer.php';?>