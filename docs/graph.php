<?php include 'header.php';?>
<script type="text/javascript" src="../lib/d3.min.js"></script>
<script type="text/javascript" src="js/cp.d3js.js"></script>


<h3 class="centered" style="padding-top:2em;">CHAPTER I.</h3>
<h1>GRAPHS</h1>

<section id="intro">
	<div class="centered">
		<svg id="svgTest00" width="400" height="400"></svg>
	</div>

	<p class="quote">A <b>graph</b> is a collection of <b>nodes</b> and <b>edges</b></p>

	<div class="centered">
		<pre><code><key>let</key> graph<key> = new</key> Graph()</code></pre>
	</div>

	<p class="quote">This creates an empty graph with no nodes or edges</p>

	<p class="explain">Graphs don't exist in 2D space (or any space), they are an abstract map showing connections between nodes.</p>
</section>

<h2><a href="#nodes-and-edges">&sect;</a> Nodes and Edges</h2>

<section id="nodes-and-edges">
	<p class="quote">The graph holds onto all its nodes and edges in arrays.<br>The types are <a href="library/GraphNode.html">Graph Node</a> and <a href="library/GraphEdge.html">Graph Edge</a>.</p>

	<div class="centered">
		<pre><code>graph.<v>nodes</v> <key>=</key> [] <c> // array of GraphNode</c><br>graph.<v>edges</v> <key>=</key> [] <c> // array of GraphEdge</c></code></pre>
	</div>

	<p class="quote">This operation makes a new node and returns a reference to it.</p>

	<div class="centered">
		<pre><code><key>let</key> node <op>=</op> graph.<v>newNode</v>()</code> <c> // node is a GraphNode</c></pre>
	</div>

	<p class="quote">A new edge needs to know the 2 nodes its connecting.</p>

	<div class="centered">
		<pre><code><key>let</key> edge <op>=</op> graph.<v>newEdge</v>(<arg>node1</arg>, <arg>node2</arg>) <c> // edge is a GraphEdge</c></code></pre>
	</div>

	<p class="quote">You can always grab a node or an edge again</p>

	<div class="centered">
		<pre><code>graph.<v>newNode</v>()<br><key>let</key> node <op>=</op> graph.<v>nodes</v>[<n>0</n>]  <c>// the first node</c></code></pre>
	</div>

</section>

<h2><a href="#nodes">&sect;</a> Nodes</h2>

<section id="nodes">

	<div class="centered">
		<svg id="svgTest01" width="400" height="400"></svg>
	</div>

	<p class="quote">This graph is interactive</p>

	<div class="centered">
		<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<v>nodes</v>[<n><span id="spanNodesAdjacentToNodeInput" class="token argument"></span></n>].<f>adjacentNodes</f>()<br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanNodesAdjacentToEdgeInput" class="token argument"></span></n>].<f>adjacentNodes</f>()</code></pre>
	</div>

	<p class="explain">Two nodes are <strong>adjacent</strong> if they are connected by an edge</p>

</section>

<h2><a href="#edges">&sect;</a> Edges</h2>
<section id="edges">

	<p class="quote">An edge connects two nodes</p>
	
	<div class="centered">
		<pre><code>graph.<v>edges</v>[<n>0</n>]  <c>// the first edge</c><br>graph.<v>edges</v>.length  <c>// total number of edges</c></code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest02" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<v>nodes</v>[<n><span id="spanEdgesAdjacentToNodeInput" class="token argument"></span></n>].<f>adjacentEdges</f>()<br><span id="spanEdgesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanEdgesAdjacentToEdgeInput" class="token argument"></span></n>].<f>adjacentEdges</f>()</code></pre>
	</div>

		<p class="explain"><b>Invalid edges</b><br><b>Circular:</b> an edge cannot connect the same node at both ends<br><b>Duplicate:</b> the same 2 nodes cannot have more than 1 edge between them
		</p>

</section>

<h2><a href="#remove-nodes">&sect;</a> Remove</h2>
<section id="remove-nodes">

	<div class="centered">
		<svg id="svgTest03" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeNode</f>(<v><span id="spanEdgesAdjacentToNodeInput" class="token argument">node</span></v>)</code></pre>
	</div>

	<p class="quote">When removing a node, any edges which share the node will be removed also.</p>

	<div class="centered">
		<svg id="svgTest04" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeEdge</f>(<v><span id="spanEdgesAdjacentToNodeInput" class="token argument">edge</span></v>)</code></pre>
	</div>

	<p class="quote">Removing an edge will do simply that and the nodes remain untouched.</p>

</section>

<h2><a href="#">&sect;</a> Clean</h2>

<section id="clean">

	<div class="centered">
		<pre><code>graph.<f>clean</f>()</code></pre>
	</div>

	<p class="quote">Cleaning a graph removes duplicate and circular edges. You can also target specific edges:</p>

	<div class="centered">
		<pre><code>graph.<f>removeEdge</f>(<arg>edge</arg>)<br>graph.<f>removeEdgeBetween</f>(<arg>node1</arg>, <arg>node2</arg>)</code></pre>
	</div>

	<p class="quote">Removing Nodes:</p>

	<div class="centered">
		<pre><code>graph.<f>removeNode</f>(<arg>node</arg>)</c><br>graph.<f>removeIsolatedNodes</f>()</code></pre>
	</div>

	<p class="quote"><strong>Isolated nodes</strong> are nodes that aren't connected to an edge.</p>

	<div class="centered">
		<pre><code>graph.<f>mergeNodes</f>(<arg>node1</arg>,<arg>node2</arg>)</code></pre>
	</div>

	<p class="quote">Each of these functions returns a <b>GraphClean</b> Object</p>

	<div class="centered">
		<pre><code>{<br>&nbsp;&nbsp;edges<key>:</key>{total<key>:</key><f>number</f>, duplicate<key>:</key><f>number</f>, circular<key>:</key><f>number</f>},<br>&nbsp;&nbsp;nodes<key>:</key>{total<key>:</key><f>number</f>, isolated<key>:</key><f>number</f>}<br>}</code></pre>
	</div>

	<p class="quote">Each of the entries in a <b>GraphClean</b> object is the number of elements of that type <strong>removed</strong></p>

</section>

<!-- <div class="nav">
	<div class="nav-back">
		<p><a href="/docs/">⇦ Back: Welcome</a></p>
	</div>
	<div class="nav-next">
		<p><a href="planarGraph.php">Next: Planar Graphs ⇨</a></p>
	</div>
</div> -->

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

<script type="text/javascript" src="../tests/graph_simple.js"></script>
<script type="text/javascript" src="../tests/graph_adjacentNode.js"></script>
<script type="text/javascript" src="../tests/graph_adjacentEdge.js"></script>
<script type="text/javascript" src="../tests/graph_removeNode.js"></script>
<script type="text/javascript" src="../tests/graph_removeEdge.js"></script>
<script>
	// $(".accordion-title").html("MORE");
	function updateNodesAdjacentToNode(input, output){
		var outString = '[<span class="token argument">' + output + '</span>] ← ';
		if(input == undefined) { input = ''; outString = ''; }
		document.getElementById("spanNodesAdjacentToNodeInput").innerHTML = input;
		document.getElementById("spanNodesAdjacentToNodeResult").innerHTML = outString;
	}
	function updateNodesAdjacentToEdge(input, output){
		var outString = '[<span class="token argument">' + output + '</span>] ← ';
		if(input == undefined) { input = ''; outString = ''; }
		document.getElementById("spanNodesAdjacentToEdgeInput").innerHTML = input;
		document.getElementById("spanNodesAdjacentToEdgeResult").innerHTML = outString;
	}
	function updateEdgesAdjacentToNode(input, output){
		var outString = '[<span class="token argument">' + output + '</span>] ← ';
		if(input == undefined) { input = ''; outString = ''; }
		document.getElementById("spanEdgesAdjacentToNodeInput").innerHTML = input;
		document.getElementById("spanEdgesAdjacentToNodeResult").innerHTML = outString;
	}
	function updateEdgesAdjacentToEdge(input, output){
		var outString = '[<span class="token argument">' + output + '</span>] ← ';
		if(input == undefined) { input = ''; outString = ''; }
		document.getElementById("spanEdgesAdjacentToEdgeInput").innerHTML = input;
		document.getElementById("spanEdgesAdjacentToEdgeResult").innerHTML = outString;
	}
	var svg = d3.select("div#container")
		.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 960 400")
		.classed("svg-content", true);
</script>

<?php include 'footer.php';?>