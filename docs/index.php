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
		<p>This is a planar graph javascript library for creating origami crease patterns</p>
	</div>
	<div class="quote">
		<p><a href="http://github.com/robbykraft/Origami/">Download</a></p>
	</div>

<h2>Graphs</h2>
	
	<div class="quote">
		<p>Origami crease patterns are modeled on planar graphs, which are graphs (nodes &amp; edges) in 2D space</p>
	</div>

	<div id="sketch_intersections" class="centered p5sketch"></div>
	<div class="centered">
		<pre><code><span id="span-intersection-results"></span>planarGraph.<a href=""><f>getEdgeIntersections</f></a>();</code></pre>
	</div>
	<div class="quote">
		<p>Explore the sections in detail: <a href="graph.php">Graphs</a>, <a href="planarGraph.php">Planar Graphs</a>, <a href="creasePattern.php">Crease Patterns</a> for more information and visual examples of code.</p>
	</div>

<h2>Playgrounds</h2>
<p>&nbsp;</p>

	<h4><a href="/tools/validator/index.html">Crease Pattern Validator</a></h4>
	<div class="quote">
		<p>Check if your crease pattern is flat-foldable, and see a flat-folded approximation</p>
	</div>


	<h4><a href="/tools/editor/index.html">Crease Pattern Editor</a></h4>
	<div class="quote">
		<p>Add/remove creases, see a folded-form approximation, import and export SVG files</p>
	</div>


	<h4><a href="/tools/simplifier/index.html">Path Simplify</a></h4>
	<div class="quote">
		<p>This contains an path-walking algorithm that will merge as many individual lines into few polylines</p>
	</div>


	<h4><a href="/mine/reference-finder.html">Reference Finder</a></h4>
	<div class="quote">
		<p>Visualize all crease lines made possible by axioms 1-3 in an attempt to locate a point of your choosing</p>
	</div>



	<h4><a href="/mine/wiggle.html">Wiggle</a></h4>
	<div class="quote">
		<p>This will identify crease intersections which do not satisfy flat-foldability and attempt to wiggle vertices around until the condition is met</p>
	</div>


	<div class="explain">
		<p>Much of this work is still in progress!</p>
	</div>



<h2>About</h2>
	<div class="quote">
		<p>This is <a href="http://github.com/robbykraft/Origami/">in development</a></p>
		<p>These docs make heavy use of <a href="http://paperjs.org/">paper.js</a>, <a href="http://d3js.org/">d3.js</a>, and <a href="http://p5js.org/">p5.js</a>. Thank you developers.</p>
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
		document.getElementById("span-intersection-results").innerHTML = "<v>Array</v>(<n>" + e.length + "</n>) ← ";
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