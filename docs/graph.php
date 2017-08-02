<?php include 'header.php';?>
<script language="javascript" type="text/javascript" src="../lib/d3.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.d3js.js"></script>
<h3 class="centered" style="padding-top:2em;">CHAPTER I.</h3>
<h1>GRAPHS</h1>

<section id="intro">
	<div class="centered">
		<svg id="svgTest00" width="400" height="400"></svg>
	</div>

	<div class="centered">
		<pre><code><key>var</key> graph<key> = new</key> Graph()</code></pre>
	</div>
	<div class="explain">
		<div>
			<p>A <a href="https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)">graph</a> is a collection of <em>nodes</em> (circles) and <em>edges</em> (lines).</p>
			<p>Unlike these renderings, graph nodes don't have a position in space, it is an abstract model of nodes and the connections between them.</p>
		</div>
	</div>

	<div class="centered">
		<pre><code>console.<f>log</f>(graph)<br><c><span id="spanGraphContents"></span></c></code></pre>
	</div>

</section>


<section id="nodes-and-edges">

	<h2><a href="#nodes-and-edges">&sect;</a> Nodes and Edges</h2>

	<div class="explain">
		<div>
			<p>All of a graph's nodes and edges are stored in arrays called <b>nodes</b> and <b>edges</b>.</p>
		</div>
	</div>

	<div class="centered">
		<pre><code>graph.<v>nodes</v>;  <c>// all the graph's nodes</c><br>graph.<v>edges</v>;  <c>// all the graph's edges</c></code></pre>
	</div>

	<div class="explain">
		<div>
			<p><i>newNode()</i> will create a new <i>GraphNode</i>, add it to the graph, and return a reference to the new node</p>
		</div>
	</div>

	<div class="centered">
		<pre><code><key>var</key> node <op>=</op> graph.<v>newNode</v>();</code></pre>
	</div>

	<div class="centered">
		<pre><code><key>var</key> edge <op>=</op> graph.<v>newEdge</v>(node1, node2);  <c>// having already created node1 and node2</c></code></pre>
	</div>

	<div class="tests">
		<ul>
			<li>newNode():<n>GraphNode</n></li>
			<li>newEdge(node1:<n>GraphNode</n>, node2:<n>GraphNode</n>):<n>GraphEdge</n></li>
			<li>clear()</li>
		</ul>
	</div>
	
</section>

<section id="adjacent-nodes">
	<h2><a href="#adjacent-nodes">&sect;</a> Get Nodes</h2>

	<div class="centered">
		<pre><code>graph.<v>nodes</v>[<n>0</n>];  <c>// the first node</c></code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest01" width="400" height="400"></svg>
	<div>

	<div class="centered">
		<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<v>nodes</v>[<n><span id="spanNodesAdjacentToNodeInput" class="token argument"></span></n>].<f>adjacentNodes</f>()<br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanNodesAdjacentToEdgeInput" class="token argument"></span></n>].<f>adjacentNodes</f>()</code></pre>
	</div>

	<div class="explain">
		<div>
			<p>Once you have a node, you can call functions on it, such as getting all adjacent nodes.</p>
			<p><strong>2 nodes are adjacent if they are connected by an edge</strong></p>
		</div>
	</div>

</section>

<section id="adjacent-edges">
	<h2><a href="#adjacent-nodes">&sect;</a> Get Edges</h2>
	<div class="explain">
		<div>
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
	<h2><a href="#remove-nodes">&sect;</a> Remove Nodes</h2>
	<div class="explain">
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
	<h2><a href="#remove-edges">&sect;</a> Remove Edges</h2>
	<div class="explain">
		<p>Removing an edge simply removes that edge, any previously-attached nodes will remain in the graph.</p>
	</div>
	<div class="centered">
		<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeEdge</f>(<span id="spanEdgesAdjacentToNodeInput" class="token argument"></span>)</code></pre>
	</div>

	<div class="centered">
		<svg id="svgTest04" width="400" height="400"></svg>
	</div>

	<div class="tests">
		<ul>
			<li>removeEdgesBetween(node1:GraphNode, node2:GraphNode):number</li>
			<li>removeNode(node:GraphNode)</li>
			<li>removeEdge(edgeIndex:number)</li>
		</ul>
	</div>

</section>

	<div class="tests">
		<ul>
			<li>clean():object</li>
			<li>cleanCircularEdges():number</li>
			<li>cleanDuplicateEdges():number</li>
		</ul>
	</div>


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