<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.d3js.js"></script>


<h3 class="centered" style="padding-top:2em;">CHAPTER I.</h3>
<h1>GRAPHS</h1>

<section id="intro">
	<div class="centered">
		<svg id="svgTest00" width="400" height="400"></svg>
	</div>

	<div class="quote">
		<p>A <b>graph</b> is a collection of <b>nodes</b> and <b>edges</b> (circles and lines)</p>
	</div>

	<div class="centered">
		<pre><code><key>var</key> graph<key> = new</key> Graph()</code></pre>
	</div>
	<div class="explain">
		<p>Unlike these visualizations, graphs don't exist in space, they are an abstract model of connections between nodes.</p>
	</div>
</section>


<h2><a href="#nodes-and-edges">&sect;</a> Nodes and Edges</h2>

<section id="nodes-and-edges">
	<div class="quote">
		<p>All of a graph's nodes and edges are stored in arrays called <b>nodes</b> and <b>edges</b>.</p><p>The types are <a href="library/GraphNode.php">Graph Node</a> and <a href="library/GraphEdge.php">Graph Edge</a>.</p>
	</div>

	<div class="centered">
		<pre><code>graph.<v>nodes</v> <c> // array of GraphNode</c><br>graph.<v>edges</v> <c> // array of GraphEdge</c></code></pre>
	</div>

	<div class="quote">
		<p>This makes a new node. You can store a reference to it.</p>
	</div>

	<div class="centered">
		<pre><code><key>var</key> node <op>=</op> graph.<v>newNode</v>()</code> <c> // node is a GraphNode</c></pre>
	</div>

	<div class="quote">
		<p>A new edge needs to know the 2 nodes its connecting.</p>
	</div>
	<div class="centered">
		<pre><code><key>var</key> edge <op>=</op> graph.<v>newEdge</v>(<arg>node1</arg>, <arg>node2</arg>) <c> // edge is a GraphEdge</c></code></pre>
	</div>

</section>

<h2><a href="#nodes">&sect;</a> Nodes</h2>

<section id="nodes">
	<div class="centered">
		<pre><code>graph.<v>nodes</v>[<n>0</n>]  <c>// the first node</c></code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest01" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<v>nodes</v>[<n><span id="spanNodesAdjacentToNodeInput" class="token argument"></span></n>].<f>adjacentNodes</f>()<br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanNodesAdjacentToEdgeInput" class="token argument"></span></n>].<f>adjacentNodes</f>()</code></pre>
	</div>

	<div class="quote" style="">
		<p>Click nodes and edges</p>
	</div>

	<div class="explain">
		<div>
			<p>Two nodes are <strong>adjacent</strong> if they are connected by an edge</p>
		</div>
	</div>
</section>

<h2><a href="#edges">&sect;</a> Edges</h2>
<section id="edges">
	<div class="centered">
		<pre><code>graph.<v>edges</v>[<n>0</n>];  <c>// the first edge</c></code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest02" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<v>nodes</v>[<n><span id="spanEdgesAdjacentToNodeInput" class="token argument"></span></n>].<f>adjacentEdges</f>()<br><span id="spanEdgesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanEdgesAdjacentToEdgeInput" class="token argument"></span></n>].<f>adjacentEdges</f>()</code></pre>
	</div>

	<div class="explain">
		<p>Two edges are <strong>adjacent</strong> when they are both connected to the same node</p>
	</div>

</section>

<h2><a href="#remove-nodes">&sect;</a> Remove</h2>
<section id="remove-nodes">

	<div class="centered">
		<svg id="svgTest03" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeNode</f>(<v><span id="spanEdgesAdjacentToNodeInput" class="token argument">node</span></v>)</code></pre>
	</div>

	<div class="quote">
			<p>When removing a node, any edges which share the node will be removed also.</p>
	</div>

	<div class="centered">
		<svg id="svgTest04" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeEdge</f>(<v><span id="spanEdgesAdjacentToNodeInput" class="token argument">edge</span></v>)</code></pre>
	</div>

	<div class="quote">
		<p>Removing an edge will do simply that and the nodes remain untouched.</p>
	</div>

</section>

<h2><a href="#">&sect;</a> Clean</h2>

<section id="clean">

	<div class="centered">
		<pre><code>graph.<f>clean</f>() <c>// # of edges removed</c></code></pre>
	</div>

	<div class="quote">
		<p>Cleaning removes duplicate and circular edges. You can also target specific edges:</p>
	</div>

	<div class="centered">
		<pre><code>graph.<f>removeEdge</f>(<arg>edge</arg>) <c> // T/F removed or not removed</c><br>graph.<f>removeEdgeBetween</f>(<arg>node1</arg>, <arg>node2</arg>) <c> // # of edges removed</c></code></pre>
	</div>

	<div class="quote">
		<p>Removing Nodes:</p>
	</div>

	<div class="centered">
		<pre><code>graph.<f>removeNode</f>(<arg>node</arg>) <c> // T/F removed or not removed</c><br>graph.<f>removeIsolatedNodes</f>() <c>// # of nodes removed</c></code></pre>
	</div>

	<div class="quote">
		<p><strong>Isolated nodes</strong> are nodes that aren't connected to an edge.</p>
	</div>

	<div class="centered">
		<pre><code><key>var</key> node<key> =</key> graph.<f>mergeNodes</f>(<arg>node1</arg>,<arg>node2</arg>) <c>// node is a GraphNode</c></code></pre>
	</div>

</section>

<div class="nav">
	<div class="nav-back">
		<p><a href="/docs/">⇦ Back: Welcome</a></p>
	</div>
	<div class="nav-next">
		<p><a href="planarGraph.php">Next: Planar Graphs ⇒</a></p>
	</div>
</div>

<section id="tests">
	<div class="tests">
		<ul>
			<li><a href="../tests/html/graph_stress.html">10,000 edges</a></li>
			<li><a href="../tests/html/graph_remove.html">remove a node</a></li>
			<li><a href="../tests/html/graph_clean.html">clean, step by step</a></li>
			<li><a href="../tests/html/graph_in_common.html">common and uncommon nodes</a></li>
		</ul>
	</div>
	
</section>

<script language="javascript" type="text/javascript" src="../tests/js/graph_simple.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/graph_adjacentNode.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/graph_adjacentEdge.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/graph_removeNode.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/graph_removeEdge.js"></script>
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