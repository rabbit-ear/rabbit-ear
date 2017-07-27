<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../tests/graph/d3.graph.js"></script>

<h1>ORIGAMI</h1>

<section id="intro">
	<div class="centered">
		<canvas id="canvas-fish-base-wobble" resize></canvas>
	</div>
	<div class="centered">
		<pre><code><key>var</key> cp <op>=</op> <key>new</key> CreasePattern()<br>cp.<f>fishBase</f>()</code></pre>
	</div>
	<div class="explain">
	<!-- <div class="accordion"> -->
		<p>Mathematically, an origami crease pattern is a <strong><a href="https://en.wikipedia.org/wiki/Planar_graph">planar graph</a></strong> data structure containing:</p>
		<ul>
			<li><strong>nodes:</strong> crease endpoint in x,y space</li>
			<li><strong>edges:</strong> crease lines, non-overlapping straight lines (or maybe curved)* connecting 2 nodes</li>
			<li><strong>faces</strong></li>
		</ul>
		<p>* the math is wicked but maybe this will handle curved creases one day.</p>
	<!-- </div> -->
	</div>
<h2>Planar Graphs</h2>
	<div id="sketch_intersections" class="centered p5sketch"></div>
	<div class="centered">
		<pre><code><span id="span-intersection-results"></span>planarGraph.<f>getAllEdgeIntersections</f>();</code></pre>
	</div>
	<div class="explain">
		<p>Because edges and nodes exist in a 2D plane, we can do things like detect edge intersections.</p>
	</div>
<h2>Graphs</h2>
	<div class="centered">
		<svg id="svgTest01" width="400" height="400"></svg>
	</div>
	<div class="centered">
		<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<f>getNodesAdjacentToNode</f>(<n><span id="spanNodesAdjacentToNodeInput" class="token argument"></span></n>)<br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<f>getNodesAdjacentToEdge</f>(<n><span id="spanNodesAdjacentToEdgeInput" class="token argument"></span></n>)</code></pre>
	</div>
	<div class="explain">
		<p>In a <a href="https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)">graph</a>, edges connect to nodes but the nodes don't exist in space. It's much more abstract. A planar graph is built on a graph, and the graph is where you ask questions like "give me all nodes connected to this node". Connections exist but the idea of x,y space doesn't.</p>
	</div>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="js/fish-base-wobble.js"></script>
<script language="javascript" type="text/javascript" src="../tests/graph/01_adjacentNode.js"></script>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../tests/p5js/p5jscp.js"></script>
<script language="javascript" type="text/javascript" src="../tests/p5js/planarGraph/04_intersections.js"></script>
<script>
	var p5intersections = new p5(_04_intersections, 'sketch_intersections');
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