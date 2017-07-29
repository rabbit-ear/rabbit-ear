<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../tests/d3js.cp.js"></script>

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
		<p>Mathematically, an origami crease pattern is a <strong><a href="https://en.wikipedia.org/wiki/Planar_graph">planar graph</a></strong> and contains:</p>
		<ul>
			<li><strong>nodes:</strong> crease endpoint in x,y space</li>
			<li><strong>edges:</strong> crease lines, non-overlapping straight lines* connecting 2 nodes</li>
			<li><strong>faces</strong></li>
		</ul>
		<p>* curved creases are the new black, however the math is wicked.</p>
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
<h2>This Library</h2>
	<div class="explain">
		<p>These pages chronicle the making of this code. It came together in 3 parts. Each class inherits from the one above it.</p>
		<p>This library, the 3 files below, are wrapped up in one file <b>creasePattern.js</b></p>
	</div>
	<div>
		<ul>
			<li><strong>graph.js:</strong></li>
			<li><strong>planarGraph.js:</strong></li>
			<li><strong>creasePattern.js</strong></li>
		</ul>
	</div>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="js/cp_fish_wobble.js"></script>
<script language="javascript" type="text/javascript" src="../tests/d3js/graph_adjacentNode.js"></script>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../tests/p5js.cp.js"></script>
<script language="javascript" type="text/javascript" src="../tests/p5js/04_intersections.js"></script>
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