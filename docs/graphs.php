<?php include 'header.php';?>
<!-- <script type="text/javascript" src="../include/d3.min.js"></script> -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.9.2/d3.min.js"></script>
<script type="text/javascript" src="js/cp.d3js.js"></script>
<style>
.links line {
	stroke: #000;
	stroke-width: 4px;
	cursor: pointer;
}
.nodes circle {
	stroke: #000;
	fill: #FFF;
	stroke-width: 4px;
	cursor: pointer;
}	
</style>

<h3 style="text-align:center;margin-top:3em;">CHAPTER II.</h3>

<h1>GRAPHS</h1>

<section id="intro">
	<div class="centered">
		<svg id="svgTest00" width="400" height="400"></svg>
	</div>

	<p class="quote">A <b>graph</b> is a collection of <b>vertices</b> and <b>edges</b></p>

	<div class="code"><pre class="language">.js</pre>
		<pre><code><f>let</f> graph <key>=</key> <f>Graph</f>()</code></pre>
	</div>

	<p class="explain">Graphs don't exist in 2D space (or any space), they are an abstract map showing connections between vertices.</p>
</section>

<h2><a href="#nodes-and-edges">&sect;</a> Vertices, Edges, Faces</h2>

<section id="nodes-and-edges">

	<p>A graph needs to keep track of all of its components.</p>

	<div class="code">
		<pre><code>graph.<v>vertices</v> <c> // array of vertices</c><br>graph.<v>edges</v> <c> // array of edges</c><br>graph.<v>faces</v> <c> // array of faces</c></code></pre>
	</div>

	<p>Vertices are easy, they're a list of points.</p>

	<div class="centered code">
		<pre><code>[
  [<n>0.0</n>, <n>0.0</n>, <arg>0.0</arg>],
  [<n>1.0</n>, <n>0.5</n>, <arg>0.5</arg>],
  ...
]</code>
</pre>
</div>

	<p class="quote">2D or 3D (orange)</p>

	<p>Edges and faces however are stored as lists of vertices (or other geometries). Predominantly there are two approaches, where every vertex is represented as:</p>

	<div class="diptych">
		<div class="code" style="margin-right: 1rem;">
			<pre><code>edges <key>=</key> [
  [<n>4</n>, <n>7</n>],
  [<n>3</n>, <n>5</n>],
  [<n>6</n>, <n>8</n>],
  ...
]</code></pre>
		<p class="quote"><b>integer</b> of the index in the geometry array</p>
		</div>

		<div class="code" style="margin-left: 1rem;">
			<pre><code>edges <key>=</key> [
  [<n>0xF92FC99A</n>, <n>0xF952B085</n>],
  [<n>0xF8E127BB</n>, <n>0xF8159A15</n>],
  [<n>0xF8BB90C0</n>, <n>0xF852B984</n>],
  ...
]</code></pre>
		<p class="quote"><b>memory pointer</b> to the vertex</p>
		</div>
	</div>
	

	<p>There are costs and benefits to either approach. The FOLD format uses the first approach, <b>integer indices</b>.</p>

	<div class="centered code">
		<pre class="compact"><code><f>FOLD object</f>
┃
┃ <c>// vertices</c>
┣━ vertices_coords <c> // points, not indices</c>
┣━ <v>vertices_vertices</v>
┣━ <v>vertices_faces</v>
┃
┃ <c>// edges</c>
┣━ <v>edges_vertices</v>
┣━ <v>edges_faces</v>
┃
┃ <c>// faces</c>
┣━ <v>faces_vertices</v>
┗━ <v>faces_edges</v>
</code>
</pre>
</div>

	<p class="quote">Every edge connects two vertices, but faces can be of variable length.</p>

	<div class="diptych">
		<div class="code" style="margin-right: 1rem;">
			<pre><code>edge_vertices <key>=</key> [<n>0</n>, <n>1</n>]</code></pre>
		</div>
		<div class="code" style="margin-left: 1rem;">
			<pre><code>face_vertices <key>=</key> [<n>4</n>, <n>0</n>, <n>1</n>, <n>7</n>, <n>5</n>]</code></pre>
		</div>
	</div>
	
	<p>If you want a face expressed as a list of <b>vertices in space</b>, a simple map will convert indices to vertices.</p>
	
	<div class="code"><pre class="language">.js</pre>
		<pre><code><f>var</f> polygon <key>=</key> face_vertices
  .<f>map</f>(<arg>i</arg> <f>=></f> vertices_coords[i])</code></pre>
	</div>



</section>

<h2><a href="#adjacent">&sect;</a> Adjacency</h2>

<section id="adjacent">

	<div class="diptych">
		<svg id="svgTest01" width="400" height="400"></svg>
		<svg id="svgTest02" width="400" height="400"></svg>
	</div>

	<div class="diptych">
		<div class="code" style="margin-right: 1rem;"><pre class="language">.js</pre>
			<pre><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<v>vertices</v>[<n><span id="spanNodesAdjacentToNodeInput" class="token argument"></span></n>].<f>adjacent</f>.<f>vertices</f><br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanNodesAdjacentToEdgeInput" class="token argument"></span></n>].<f>adjacent</f>.<f>vertices</f></code></pre>
		</div>
		<div class="code" style="margin-left: 1rem;"><pre class="language">.js</pre>
			<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<v>vertices</v>[<n><span id="spanEdgesAdjacentToNodeInput" class="token argument"></span></n>].<f>adjacent</f>.<f>edges</f><br><span id="spanEdgesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanEdgesAdjacentToEdgeInput" class="token argument"></span></n>].<f>adjacent</f>.<f>edges</f></code></pre>
		</div>
	</div>


</section>
	
<h2><a href="#clean">&sect;</a> Removing and Cleaning</h2>

<section id="clean">

	<div class="code">
		<pre><code>[<n>0.0</n>, <n>0.0</n>, <n>0.0</n>],
[<n>0.5</n>, <n>1.0</n>, <n>0.0</n>],
<key>xxx</key>
[<n>1.0</n>, <n>1.0</n>, <n>1.0</n>]</code></pre>
	</div>

	<p>If a vertex is removed, the vertices following it shift up by one to take its place. Additionally the other arrays need to be iterated and:</p>
	<ul>
		<li>any reference to vertex 2 needs to be removed.</li>
		<li>any reference to vertex greater than 2 needs to decrement -1.</li>
	</ul>

	<p class="explain">this is an example of a cost to using <b>integer indices</b> over <b>memory pointers</b>.</p>

	<div class="diptych">
		<div>
			<div class="centered">
				<svg id="svgTest03" width="400" height="400"></svg>
			</div>

			<div class="code" style="margin-right: 1rem;"><pre class="language">.js</pre>
				<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeVertex</f>(<v><span id="spanEdgesAdjacentToNodeInput" class="token argument">vertex</span></v>)</code></pre>
			</div>

			<p class="quote" style="margin-right: 1rem;">vertices will remove incident edges &amp; faces</p>
			
		</div>
		<div>
			<div class="centered">
				<svg id="svgTest04" width="400" height="400"></svg>
			</div>

			<div class="code" style="margin-left: 1rem;"><pre class="language">.js</pre>
				<pre><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<f>removeEdge</f>(<v><span id="spanEdgesAdjacentToNodeInput" class="token argument">edge</span></v>)</code></pre>
			</div>

			<p class="quote" style="margin-left: 1rem;">removing an edge or face leaves vertices alone</p>
			
		</div>
	</div>


		<p class="explain"><b>potentially invalid edges</b><br><b>circular:</b> an edge cannot connect the same vertex at both ends<br><b>duplicate:</b> the same 2 vertices cannot have more than 1 edge between them
		</p>


	<p>There are various approaches to cleaning, correcting, and rebuilding a graph.</p>

	<div class="code"><pre class="language">.js</pre>
		<pre><code>graph.<f>clean</f>()</code></pre>
	</div>

	<p>each depend on the assumptions regarding the type of graph.</p>

</section>

<h1>Planar Graphs</h1>

	<div id="canvas-intersection-wobble" class="panorama"></div>

	<p class="quote">A <b>planar graph</b> is a collection of <b>nodes</b> and <b>edges</b> in 2D space where it's now illegal for two edges to cross.</p>

</section>

<h2><a href="#fragment">&sect;</a> Fragment</h2>

<section id="fragment">

	<p>Edges are not allowed to cross each other. This is resolved by <b>fragmenting</b> edges into shorter edges with a new node at their intersection.</p>

	<div class="centered">
		<canvas id="canvas-fragment" resize class="panorama"></canvas>
	</div>

	<div class="code">
		<pre><code><span id="span-merge-result"></span>graph.<f>fragment</f>()</code></pre>
	</div>

	<p class="quote">Fragment chops edges and returns the location of intersections.</p>

	<div class="centered">
		<canvas id="canvas-crane-1" resize></canvas><canvas id="canvas-crane-2" resize></canvas>
	</div>

	<p class="quote">The graph on the right has been <a href="library/fragment">fragmented</a>. The longer lines have been split at their crossings.</p>

</section>


<h2><a href="#face">&sect;</a> Face</h2>

<section id="face">

	<div class="centered">
		<canvas id="canvas-faces-convex" resize></canvas>
		<canvas id="canvas-faces-non-convex" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<f>flatten</f>()</code></pre>
	</div>
	
	<p class="quote">This flatten operation calculates and stores all the faces.</p>

	<p class="explain">Faces containing leaf edges are currently considered invalid.</p>

</section>


<h2><a href="#junction">&sect;</a> Junction &amp; Sector</h2>

<section id="junction">

	<p>Perhaps this is forward looking, but origami crease patterns typically arrange themselves so that many edges are sharing the same node, leaving much to be said about the area around one node. We will call this area a <b>junction</b>.</p>

	<p class="quote"><strong>Junction</strong>: the area including one node, its adjacent edges, and the sectors formed between edges.</p>

	<div class="centered">
		<canvas id="canvas-edge-winding" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>let</key> a <key>=</key> junction.<f>edges</f>[<n><span id="edge-angle-index"></span></n>]  <span id="edge-angle-div"></span><br><span id="edge-angle-clockwise"></span></code></pre>
	</div>

	<p class="quote">All radially-sorted components, like edges around a junction, are sorted counter-clockwise.</p>

	<p class="explain">This library is strictly in the cartesian system, however this graphics library uses an inverted Y axis. Counter-clockwise appears clockwise.</p>

<h3 id="sector">Sector</h3>

	<div class="centered">
		<canvas id="canvas-nearest-sector" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>junction.<f>sectors</f>[<n id="sketch-nia-index"></n>]</code></pre>
	</div>

	<p>Junctions are made up of <b>sectors</b>, the number of sectors is equal to the number of edges.</p>

	<div class="centered">
		<canvas id="canvas-sector" resize></canvas>
	</div>

	<p class="quote"><strong>Sector</strong>: two adjacent ordered edges and the space that creates an angle between them.</p>

	<p>This sector is defined as the counter-clockwise space from the blue to the yellow line.</p>

	<p class="explain">Remember, all counter-clockwise winding appears clockwise in this inverted Y-axis graphics library.</p>
	
</section>







<section id="graphs">
	<h2>Crease Patterns</h2>
	<p>A crease pattern's crease lines are the edges of the graph, nodes as endpoints. When it lies flat like this it's called a <strong>planar graph</strong>. During folding the edges leave the plane and enter 3D.</p>
	<div class="three-js" id="intersection-wobble"></div>
	<pre><code><span id="span-intersection-results"></span>origami.<a href=""><f>fold</f></a>();</code></pre>
	<p class="quote">Even if a model is folded in 3D, it still has a 2D crease pattern.</p>

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
			<li><a href="../tests/graph_stress.html">10,000 edges</a></li>
			<li><a href="../tests/graph_remove.html">remove a node</a></li>
			<li><a href="../tests/graph_clean.html">clean, step by step</a></li>
			<li><a href="../tests/graph_in_common.html">common and uncommon nodes</a></li>
		</ul>
	</div>
	
</section>

<script type="text/javascript" src="js/d3_graph_simple.js"></script>
<script type="text/javascript" src="js/d3_graph_adjNode.js"></script>
<script type="text/javascript" src="js/d3_graph_adjEdge.js"></script>
<script type="text/javascript" src="js/d3_graph_removeNode.js"></script>
<script type="text/javascript" src="js/d3_graph_removeEdge.js"></script>

<script type="text/javascript" src="../tests/line_intersection_animated.js"></script>
<script type="text/javascript" src="../tests/fragment.js"></script>
<script type="text/javascript" src="../tests/faces_convex.js"></script>
<script type="text/javascript" src="../tests/faces_non_convex.js"></script>
<script type="text/javascript" src="../tests/edge_winding.js"></script>
<script type="text/javascript" src="../tests/sector.js"></script>
<script type="text/javascript" src="../tests/nearest_sector.js"></script>


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


<script>
// wobble_intersections_callback = function(e){
// 	document.getElementById("span-intersection-results").innerHTML = "<v>Array</v>(<n>" + e.length + "</n>) ← ";
// }
fragment_sketch_callback = function(event){
	if(event !== undefined){
		document.getElementById("span-merge-result").innerHTML = "<v>Array</v>(<n>" + event.length + "</n>) ← ";
	}
}
fragmentSketch.reset();
nearSectorCallback = function(event){
	if(event.index != undefined){
		document.getElementById("sketch-nia-index").innerHTML = event.index;
	}
}
edge_winding_callback = function(event){
	var angleDegrees = event.angle * 180 / Math.PI;
	var nextAngleDegrees = event.nextAngle * 180 / Math.PI;
	var prevAngleDegrees = event.prevAngle * 180 / Math.PI;
	// if(angleDegrees < 0) angleDegrees += 360;
	document.getElementById("edge-angle-index").innerHTML = event.index;
	document.getElementById("edge-angle-div").innerHTML = 
		"<c> // " + angleDegrees.toFixed(1) + "° (red)</c>";
	// document.getElementById("edge-angle-clockwise").innerHTML = "junction.edges[<n>" + event.nextIndex + "</n>] <key>=</key> junction.<v>clockwiseEdge</v>( a ) <c> // " + nextAngleDegrees.toFixed(1) + "° (black)</c>";
	document.getElementById("edge-angle-clockwise").innerHTML = "junction.<v>clockwiseEdge</v>( a ) <c> // " + nextAngleDegrees.toFixed(1) + "° (black)</c><br>junction.<v>counterClockwiseEdge</v>( a ) <c> // " + prevAngleDegrees.toFixed(1) + "° (blue)</c>";
}
</script>
<script>
var crane1CP = new OrigamiPaper("canvas-crane-1").blackAndWhite().setPadding(0.05);
crane1CP.loadRaw("/files/errors/crane-errors.svg");
crane1CP.onMouseMove = function(event){
	var point = {x:event.point.x, y:event.point.y};
	var edgeArray = this.cp.edges
		.map(function(edge){
			return {edge:edge, distance:edge.nearestPoint(point).distanceTo(point)};
		})
		.sort(function(a,b){
			return a.distance - b.distance;
		})[0];
	var edge = (edgeArray != undefined) ? edgeArray.edge : undefined;

	if(edge != undefined){
		this.updateStyles();
		this.edges[ edge.index ].strokeColor = this.styles.byrne.red;
		this.edges[ edge.index ].strokeWidth = this.style.mountain.strokeWidth*2;
	}

}

var crane2CP = new OrigamiPaper("canvas-crane-2").blackAndWhite().setPadding(0.05);
crane2CP.load("/files/errors/crane-errors.svg");
crane2CP.show.faces = false;
crane2CP.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.edge){ 
		this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.red;
		this.edges[ nearest.edge.index ].strokeWidth = this.style.mountain.strokeWidth*2;
	}
}	
</script>

<?php include 'footer.php';?>