<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../tests/graph/d3.graph.js"></script>

<h1>ORIGAMI</h1>

<section id="intro">
	<div id="sketch_intro" class="centered p5sketch"></div>
	<div class="centered">
		<pre><code><key>var</key> cp <op>=</op> <key>new</key> CreasePattern()<br>cp.<f>fishBase</f>()</code></pre>
	</div>
	<div class="accordion">
		<div>
		<p>This is a javascript library for origami crease patterns. These docs explain the code in much detail, I wrote these docs as I built the code. Code is split into 3 main parts:</p>
		<ul style="list-style-type: upper-roman;">
			<li>Graph - abstract math foundations</li>
			<li>Planar Graph - 2D geometry</li>
			<li>Crease Pattern - All origami related</li>
		</ul>
		<p>Apart from anything origami-related, this library also works as a general .svg file processing tool</p>
		</div>
	</div>
<h2>Crease Patterns are Planar Graphs</h2>
	<div id="sketch_intersections" class="centered p5sketch"></div>
	<div class="centered">
		<pre><code><span id="span-intersection-results"></span>planargraph.<f>getAllEdgeIntersections</f>();</code></pre>
	</div>
	<div class="accordion">
		<p>A <a href="https://en.wikipedia.org/wiki/Planar_graph">planar graph</a> can be thought of as a group of lines, defined by endpoints, existing in 2D space. The proper name for lines is "edges", and an endpoint is called a "node". Edges can share nodes, this makes them connected. To save the data structure, save a list of nodes as x,y points, and a list of edges as pointers to 2 nodes.</p>
	</div>
<h2>Planar Graphs are Graphs</h2>
	<div class="centered">
		<svg id="svgTest01" width="400" height="400"></svg>
	</div>
	<div class="centered">
		<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<f>getNodesAdjacentToNode</f>(<n><span id="spanNodesAdjacentToNodeInput" class="token argument"></span></n>)<br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<f>getNodesAdjacentToEdge</f>(<n><span id="spanNodesAdjacentToEdgeInput" class="token argument"></span></n>)</code></pre>
	</div>
	<div class="accordion">
		<p>A <a href="https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)">graph</a> is a planar graph if you take away the idea of 2D space. There are edges and nodes, but they are abstract and don't exist in space. A graph can ask things like, "are 2 nodes connected by an edge?" A planar graph can do everything a graph can do, but a graph cannot do everything a planar graph can do.</p>
	</div>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/graph/01_adjacentNode.js"></script>
<script language="javascript" type="text/javascript" src="sketch_intro.js"></script>
<script language="javascript" type="text/javascript" src="../tests/planarGraph/04_intersections.js"></script>
<script>
	new p5(sketch_intro, 'sketch_intro');
	var p5intersections = new p5(_04_intersections, 'sketch_intersections');
	p5intersections.callback = function(e){
		if(e != undefined){
			$("#span-intersection-results").html('Array(' + e.length + ') ← ');
		}
	}

	$(".accordion-title").html("EXPLAIN");
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