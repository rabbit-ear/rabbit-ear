<?php include 'header.php';?>

<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../testsD3/d3.graph.js"></script>

<section id="graph">
	<h2>Graphs</h2>
	<div class="centered">
		<pre><code><key>var</key> graph<key> = new</key> Graph()</code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest00" width="400" height="400"></svg>
	</div>

	<div class="accordion">
		<div>
			<p><a href="https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)">Graphs</a> are a collection of <em>nodes</em> connected by <em>edges</em> (circles connected by lines).</p>
			<p>The lists of nodes and edges are stored as 2 arrays.</p>
			<p>In its simplest form, edges store the 2 nodes that they connect. Each edge is made up of 2 numbers: the indices of the 2 nodes (in the node array) it connects.</p></p>
		</div>
	</div>

	<div class="centered">
		<pre><code>console.<f>log</f>(graph)<br><c><span id="spanGraphContents"></span></c></code></pre>
	</div>
</section>


<div>
	<h3>Background</h3>
	<p>An origami crease pattern is a type of planar graph, and a planar graph is a type of graph.</p>
</div>
<div class="centered">Crease Pattern ← Planar Graph ← Graph</div>
<div>
	<p>From graph to crease pattern, the data structure moves from abstract to concrete, adding things like 2D space, faces, flat foldability rules, and more.</p>
</div>
<div class="centered">Origami Rules ← 2D space ← Nodes &amp; Edges</div>



<section id="adjacent-nodes">
	<h2><a href="#adjacent-nodes">Get Nodes</a></h2>
	<div class="accordion">
		<div>
			<p>To get all the nodes of Graph g, simply access the g<i>.nodes</i> array.</p>
			<p>To get certain nodes based on adjacency, use either <i>getNodesAdjacentToNode</i> or <i>getNodesAdjacentToEdge</i>.</p>
			<p><i>"adjacency"</i> has to do with edge-connections and has nothing to do with position in space. Nodes are adjacent when they are connected by an edge.</p>
		</div>
	</div>
	<div class="centered">
		<pre><code>graph.<v>nodes</v>;  <span class="token comment">// array</span></code></pre>
	</div>
	<div class="centered">
		<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<f>getNodesAdjacentToNode</f>(<span id="spanNodesAdjacentToNodeInput" class="token argument"></span>)<br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<f>getNodesAdjacentToEdge</f>(<span id="spanNodesAdjacentToEdgeInput" class="token argument"></span>)</code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest01" width="400" height="400"></svg>
	<div>
</section>

<section id="adjacent-edges">
	<h2><a href="#adjacent-nodes">Get Edges</a></h2>
	<div class="accordion">
		<div>
			<p>To get all the edges of Graph g, simply access the g<i>.edges</i> array.</p>
			<p>To get certain edges based on adjacency, use either <i>getEdgesAdjacentToNode</i> or <i>getEdgesAdjacentToEdge</i>.</p>
			<p><i>"adjacency"</i> has to do with edge-connections and has nothing to do with position in space. Two edges are adjacent when they are both connected to the same node.</p>
		</div>
	</div>
	<div class="centered">
		<pre><code>graph.<v>edges</v>;  <span class="token comment">// array</span></code></pre>
	</div>
	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>getEdgesAdjacentToNode</f>(<span id="spanEdgesAdjacentToNodeInput" class="token argument"></span>)<br><span id="spanEdgesAdjacentToEdgeResult"></span>graph.<f>getEdgesAdjacentToEdge</f>(<span id="spanEdgesAdjacentToEdgeInput" class="token argument"></span>)</code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest02" width="400" height="400"></svg>
	</div>
</section>

<section id="remove-nodes">
	<h2><a href="#remove-nodes">Remove Nodes</a></h2>
	<div class="accordion">
		<div>
			<p>When removing a node, any edges which share the node will be removed also.</p>
			<p>Because this shuffles the node array upon which edges are dependent, this also triggers the edge array to update accordingly.</p>
		</div>
	</div>
	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeNode</f>(<span id="spanEdgesAdjacentToNodeInput" class="token argument"></span>)</code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest03" width="400" height="400"></svg>
	</div>
</section>

<section id="remove-edges">
	<h2><a href="#remove-edges">Remove Edges</a></h2>
	<div class="accordion">
		<p>Removing an edge simply removes that edge, any previously-attached nodes will remain in the graph.</p>
	</div>
	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeEdge</f>(<span id="spanEdgesAdjacentToNodeInput" class="token argument"></span>)</code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest04" width="400" height="400"></svg>
	</div>
</section>

<script language="javascript" type="text/javascript" src="../testsD3/00_graph.js"></script>
<script language="javascript" type="text/javascript" src="../testsD3/01_adjacentNode.js"></script>
<script language="javascript" type="text/javascript" src="../testsD3/02_adjacentEdge.js"></script>
<script language="javascript" type="text/javascript" src="../testsD3/03_removeNode.js"></script>
<script language="javascript" type="text/javascript" src="../testsD3/04_removeEdge.js"></script>
<script>
	$(".accordion-title").html("MORE");
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
	function updateEdgesAdjacentToNode(input, output){
		var outString = '[<span class="token argument">' + output + '</span>] ← ';
		if(input == undefined) { input = ''; outString = ''; }
		$("#spanEdgesAdjacentToNodeInput").html(input);
		$("#spanEdgesAdjacentToNodeResult").html(outString);
	}
	function updateEdgesAdjacentToEdge(input, output){
		var outString = '[<span class="token argument">' + output + '</span>] ← ';
		if(input == undefined) { input = ''; outString = ''; }
		$("#spanEdgesAdjacentToEdgeInput").html(input);
		$("#spanEdgesAdjacentToEdgeResult").html(outString);
	}
	var svg = d3.select("div#container")
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 960 400")
		.classed("svg-content", true);
</script>

<?php include 'footer.php';?>