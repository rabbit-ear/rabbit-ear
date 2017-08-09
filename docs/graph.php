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
		<p>Unlike these visualizations, graphs don't exist in space, they are an abstract model of connections between nodes</p>
	</div>
</section>


<h2><a href="#nodes-and-edges">&sect;</a> Nodes and Edges</h2>

<section id="nodes-and-edges">
	<div class="quote">
		<p>All of a graph's nodes and edges are stored in arrays called <b>nodes</b> and <b>edges</b>.</p>
	</div>

	<div class="centered">
		<pre><code>graph.<v>nodes</v><op>:</op><v>GraphNode</v> <op>=</op> [];  <c>// empty array of the graph's nodes</c><br>graph.<v>edges</v><op>:</op><v>GraphEdge</v>  <op>=</op> [];  <c>// empty array of the graph's edges</c></code></pre>
	</div>


	<div class="quote">
		<p>The type of the nodes is a <a href="methods/GraphNode.php">GraphNode</a>, and edges is a <a href="methods/GraphEdge.php">GraphEdge</a>.</p>
	</div>

	<div class="centered">
		<pre><code><key>var</key> node <op>=</op> graph.<v>newNode</v>();</code></pre>
	</div>

	<div class="quote">
		<p>newEdge(a,b) requires you specify 2 nodes to connect.</p>
	</div>
	<div class="centered">
		<pre><code><key>var</key> edge <op>=</op> graph.<v>newEdge</v>(<arg>node1</arg>, <arg>node2</arg>);</code></pre>
	</div>

	<div class="quote">
		<p>These return a pointer to the newly created object.</p>
	</div>
</section>

<h2><a href="#">&sect;</a> Clean</h2>

<section id="clean">
	<div class="explain">
		<p>Cleaning a graph will removing any duplicate or circular edges and leave the nodes untouched.</p>
	</div>

	<div class="centered">
		<pre><code>graph.<f>clean</f>()</code></pre>
	</div>
</section>

<h2><a href="#nodes">&sect;</a> Nodes</h2>

<section id="nodes">
	<div class="centered">
		<pre><code>graph.<v>nodes</v>[<n>0</n>];  <c>// the first node</c></code></pre>
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
		<p><strong>Two edges are adjacent when they are both connected to the same node</strong></p>
	</div>

</section>

<h2><a href="#remove-nodes">&sect;</a> Remove</h2>
<section id="remove-nodes">
	<div class="quote">
			<p>When removing a node, any edges which share the node will be removed also.</p>
	</div>

	<div class="centered">
		<svg id="svgTest03" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeNode</f>(<v><span id="spanEdgesAdjacentToNodeInput" class="token argument">node</span></v>)</code></pre>
	</div>

	<div class="quote">
		<p>Removing an edge simply removes that edge, any previously-attached nodes will remain in the graph.</p>
	</div>

	<div class="centered">
		<svg id="svgTest04" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeEdge</f>(<v><span id="spanEdgesAdjacentToNodeInput" class="token argument">edge</span></v>)</code></pre>
	</div>

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