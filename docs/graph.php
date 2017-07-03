<?php include 'header.php';?>

<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../tests/graph/d3.graph.js"></script>

<h1>Graph</h1>
<section id="graph">

	<div style="display:none;">
		<h3>table of contents</h3>
		<ul>
			<li>clear()</li>
			<li>addNode(node) </li>
			<li>addEdge(edge) </li>
			<li>addNodes(nodes)</li>
			<li>removeEdgesBetween(nodeIndex1, nodeIndex2)</li>
			<li>removeNode(nodeIndex)</li>
			<li>removeEdge(edgeIndex)</li>
			<li>cleanCircularEdges()</li>
			<li>cleanDuplicateEdges()</li>
			<li>clean()</li>
			<li>areNodesAdjacent(nodeIndex1, nodeIndex2)</li>
			<li>areEdgesAdjacent(edgeIndex1, edgeIndex2)</li>
			<li>areEdgesSimilar(eIndex1, eIndex2)</li>
			<li>getNodesAdjacentToNode(nodeIndex)</li>
			<li>getNodesAdjacentToEdge(edgeIndex)</li>
			<li>getEdgesAdjacentToEdge(edgeIndex)</li>
			<li>getEdgeConnectingNodes(nodeIndex1, nodeIndex2)</li>
			<li>getEdgesAdjacentToNode(nodeIndex)</li>
			<li>getEdgesConnectedToEdge(edgeIndex)</li>
			<li>mergeNodes(nodeIndex1, nodeIndex2)</li>
			<li>log()</li>
			<li>logMore()</li>
		</ul>
	</div>
	<div class="centered">
		<svg id="svgTest00" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><key>var</key> graph<key> = new</key> Graph()</code></pre>
	</div>
	<div class="accordion">
		<div>
			<p><a href="https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)">Graph</a> is a collection of things <em>"nodes"</em> (circles) and connections between them <em>"edges"</em> (lines).</p>
			<p>When you talk about nodes, you identify them by a unique number-their index in the array. Same with edges. This behavior persists throughout the library.</p>
		</div>
	</div>

	<div class="centered">
		<pre><code>console.<f>log</f>(graph)<br><c><span id="spanGraphContents"></span></c></code></pre>
	</div>
	<div class="accordion">
		<div>
			<p>The lists of nodes and edges are stored as 2 arrays.</p>
			<p>In its simplest form, edges store the 2 nodes that they connect. Each edge is made up of 2 numbers: the indices of the 2 nodes (in the node array) it connects.</p></p>
		</div>
	</div>


</section>

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
		<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<f>getNodesAdjacentToNode</f>(<span id="spanNodesAdjacentToNodeInput" class="token argument"> node </span>)<br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<f>getNodesAdjacentToEdge</f>(<span id="spanNodesAdjacentToEdgeInput" class="token argument"> edge </span>)</code></pre>
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
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>getEdgesAdjacentToNode</f>(<span id="spanEdgesAdjacentToNodeInput" class="token argument"> node </span>)<br><span id="spanEdgesAdjacentToEdgeResult"></span>graph.<f>getEdgesAdjacentToEdge</f>(<span id="spanEdgesAdjacentToEdgeInput" class="token argument"> edge </span>)</code></pre>
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

<script language="javascript" type="text/javascript" src="../tests/graph/00_graph.js"></script>
<script language="javascript" type="text/javascript" src="../tests/graph/01_adjacentNode.js"></script>
<script language="javascript" type="text/javascript" src="../tests/graph/02_adjacentEdge.js"></script>
<script language="javascript" type="text/javascript" src="../tests/graph/03_removeNode.js"></script>
<script language="javascript" type="text/javascript" src="../tests/graph/04_removeEdge.js"></script>
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