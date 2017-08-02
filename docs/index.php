<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.d3js.js"></script>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>

<h1>ORIGAMI</h1>

<section id="intro">
	<div class="centered">
		<canvas id="canvas-fish-base-wobble" resize></canvas>
	</div>
	<div class="centered">
		<pre><code><key>var</key> cp <op>=</op> <key>new</key> CreasePattern()<br>cp.<f>fishBase</f>()</code></pre>
	</div>
	<div class="quote">
		<p>This is a planar graph library in javascript for creating origami crease patterns</p>
	</div>
	<div class="quote">
		<p><a href="http://github.com/robbykraft/Origami/">Download</a></p>
	</div>

<h2>Planar Graphs</h2>
	<div id="sketch_intersections" class="centered p5sketch"></div>
	<div class="centered">
		<pre><code><span id="span-intersection-results"></span>planarGraph.<f>getEdgeIntersections</f>();</code></pre>
	</div>
	<div class="quote">
		<p><a href="planarGraph.php">About planar graphs ⇒</a></p>
	</div>
<h2>Graphs</h2>
	<div class="centered">
		<svg id="svgTest01" width="400" height="400"></svg>
	</div>
	<div class="centered">
		<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<f>getNodesAdjacentToNode</f>(<n><span id="spanNodesAdjacentToNodeInput" class="token argument"></span></n>)<br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<f>getNodesAdjacentToEdge</f>(<n><span id="spanNodesAdjacentToEdgeInput" class="token argument"></span></n>)</code></pre>
	</div>
	<div class="quote">
		<p><a href="graph.php">About graphs ⇒</a></p>
	</div>

<h2>About</h2>
	<div class="quote">
		<p>This is <a href="http://github.com/robbykraft/Origami/">in development</a></p>
		<p>This libary is available under the MIT open source license.</p>
	</div>

</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="js/cp_fish_wobble.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/graph_adjacentNode.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/04_intersections.js"></script>
<script>
	var p5intersections = new p5(_04_intersections, 'sketch_intersections');
	p5intersections.callback = function(e){
		document.getElementById("span-intersection-results").innerHTML = e.length + " ← ";
	}
	function updateNodesAdjacentToNode(input, output){
		var outString = '[<span class="token argument">' + output + '</span>] ← ';
		if(input == undefined) { input = ''; outString = ''; }
		$("#spanNodesAdjacentToNodeInput").html(input);
		$("#spanNodesAdjacentToNodeResult").html(outString);
	}
	function updateNodesAdjacentToEdge(input, output){
		var outString = '[<span class="token argument">' + output + '</span>] ← ';
		if(input == undefined) { input = ''; outString = ''; }
		$("#spanNodesAdjacentToEdgeInput").html(input);
		$("#spanNodesAdjacentToEdgeResult").html(outString);
	}
	var svg = d3.select("div#container")
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 960 400")
		.classed("svg-content", true);
</script>


<?php include 'footer.php';?>