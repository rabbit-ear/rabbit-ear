<?php include 'header.php';?>
<script type="text/javascript" src="js/toolkit.js"></script>
<script type="text/javascript" src="include/d3.min.js"></script>
<script type="text/javascript" src="js/cp.d3js.js"></script>

<h3>CHAPTER III.</h3>

<h1>GRAPHS</h1>

<div class="d3-force-graph">
  <svg id="svgTest00"></svg>
</div>

<p class="quote">
  A <b>graph</b> is a collection of <b>vertices</b> and <b>edges</b>
</p>

<pre class="language">.js</pre>
<pre class="code"><code><f>var</f> graph <key>=</key> <f>RabbitEar</f>.<f>graph</f>()</code></pre>

<p>
  Graphs don't need to exist in 2D space (or any space), they are an abstract map showing connections between vertices.
</p>

<p>
  One effect of organizing things this way is to calculate adjacency.
</p>

<h3>Adjacency</h3>

<div class="grid-2">
  <div>
    <div class="d3-force-graph">
      <svg id="svgTest01"></svg>
    </div>
    <p class="quote">
      adjacent vertices
    </p>
    <pre class="code"><code><span id="spanNodesAdjacentToNodeResult"></span>graph.<v>vertices</v>[<n><span id="spanNodesAdjacentToNodeInput" class="token argument"></span></n>].<f>vertices</f><br><span id="spanNodesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanNodesAdjacentToEdgeInput" class="token argument"></span></n>].<f>vertices</f></code></pre>
  </div>
  <div>
    <div class="d3-force-graph">
      <svg id="svgTest02"></svg>
    </div>
    <p class="quote">
      adjacent edges
    </p>
    <pre class="code"><code><span id="spanEdgesAdjacentToNodeResult"></span>graph.<v>vertices</v>[<n><span id="spanEdgesAdjacentToNodeInput" class="token argument"></span></n>].<f>edges</f><br><span id="spanEdgesAdjacentToEdgeResult"></span>graph.<v>edges</v>[<n><span id="spanEdgesAdjacentToEdgeInput" class="token argument"></span></n>].<f>edges</f></code></pre>
  </div>
</div>

<h3>Components</h3>

<pre class="code"><code>graph.<v>vertices</v><br>graph.<v>edges</v><br>graph.<v>faces</v></code></pre>

<p>
  Our graph keeps track of all of its components by index references.
</p>

<p>
  An edge is represented by two integers: the index of each vertex in their vertices array.
</p>

<p>
  This means that the vertices (and edges and faces) cannot move around in their array. If so, all of these index references in all the arrays needs to be carefully updated.
</p>

<pre class="code"><code>edges <key>=</key> [
  [<n>4</n>, <n>7</n>],
  ...
]</code></pre>

<p>
  We can count on every edge only containing two integers. Faces however can be made of any number of vertices, greater than or equal to three.
</p>

<pre class="code"><code>faces <key>=</key> [<br>  [<n>4</n>, <n>0</n>, <n>1</n>, <n>7</n>, <n>5</n>],<br>  ...<br>]</code></pre>
  
<h2>FOLD Format</h2>

<p>
  This library subscribes to the <b>FOLD file format</b>, which is a set of naming standards around this type of graph structure.
</p>

<pre class="code compact"><code><f>FOLD graph</f>
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
</code></pre>

<p>
  <b>vertices_coords</b> is the only graph array that doesn't contain index references to an array. Each of its elements is a coordinate in Euclidean space.
</p>

<h2>Core Methods</h2>

<p>
  The bulk of Rabbit Ear's engine are methods which modify FOLD objects. Here is an abbreviated list:
</p>

<p>
  These methods validate and repair a FOLD object.
</p>

<pre class="code compact"><code><f>RabbitEar</f>.core
┃
┣━ <f>clean</f>(<arg>graph</arg>)
┣━ <f>populate</f>(<arg>graph</arg>)
┣━ <f>validate</f>(<arg>graph</arg>)
┣━ <f>rebuild</f>(<arg>graph</arg>, <arg>epsilon</arg>)
┃
┃ <c>// into a valid planar graph</c>
┣━ <f>fragment</f>(<arg>graph</arg>, <arg>epsilon</arg>)
</code></pre>

<p>
  Methods for removing things.
</p>

<pre class="code compact"><code>┃ <c>// remove components</c>
┣━ <f>remove</f>(graph, key, removeIndices)
┃
┃ <c>// vertices left behind after edges removal</c>
┣━ <f>collinear_vertices</f>(<arg>graph</arg>, <arg>point</arg>, <arg>vector</arg>)
┣━ <f>collinear_edges</f>(<arg>graph</arg>, <arg>point</arg>, <arg>vector</arg>)
┣━ <f>remove_all_collinear_vertices</f>(<arg>graph</arg>)
┣━ <f>find_isolated_vertices</f>(<arg>graph</arg>)
┃
┃ <c>// additional clean up</c>
┣━ <f>get_collinear_vertices</f>(<arg>graph</arg>)
┣━ <f>get_isolated_vertices</f>(<arg>graph</arg>)
┣━ <f>get_duplicate_vertices</f>(<arg>graph</arg>)
┣━ <f>get_duplicate_edges</f>(<arg>graph</arg>)
┣━ <f>get_duplicate_edges_old</f>(<arg>graph</arg>)
┣━ <f>find_collinear_face_edges</f>(<arg>edge</arg>, <arg>face_vertices</arg>, <arg>vertices_coords</arg>)
</code></pre>

<p>
  Methods for creating graph components.
</p>

<pre class="code compact"><code>┃ <c>// makers</c>
┣━ <f>make_vertices_edges</f>(<arg>graph</arg>)
┣━ <f>make_edges_vertices</f>(<arg>graph</arg>)
┣━ <f>make_faces_faces</f>(<arg>graph</arg>)
┣━ <f>make_edges_faces</f>(<arg>graph</arg>)
┣━ <f>make_edges_length</f>(<arg>graph</arg>)
┣━ <f>make_edges_foldAngle</f>(<arg>graph</arg>)
┣━ <f>make_vertex_pair_to_edge_map</f>(<arg>graph</arg>)
┣━ <f>make_vertices_faces</f>(<arg>graph</arg>)
┣━ <f>make_face_walk_tree</f>(<arg>graph</arg>, <arg>root_face</arg> <key>=</key> <n>0</n>)
┣━ <f>make_faces_matrix</f>(<arg>graph</arg>, <arg>root_face</arg>)
┣━ <f>make_faces_matrix_inv</f>(<arg>graph</arg>, <arg>root_face</arg>)
┣━ <f>make_vertices_coords_folded</f>(<arg>graph</arg>, <arg>face_stationary</arg>, <arg>faces_matrix</arg>)
┗━ <f>make_vertices_isBoundary</f>(<arg>graph</arg>)
make_faces_coloring_from_faces_matrix(<arg>faces_matrix</arg>)
</code></pre>

<p>
  Methods for counting a graph's components.
</p>

<pre class="code compact"><code>┃ <c>// query the component arrays</c>
┣━ <f>vertices_count</f>(graph)
┣━ <f>edges_count</f>(graph)
┣━ <f>faces_count</f>(graph)
┃
┃ <c>// search other arrays for evidence of components</c>
┣━ <f>implied_vertices_count</f>(graph)
┣━ <f>implied_edges_count</f>(graph)
┣━ <f>implied_faces_count</f>(graph)
</code></pre>

<p>
  Search the graph.
</p>

<pre class="code compact"><code>┃ <c>// using vertices_coords and Euclidean distance</c>
┣━ <f>select_vertices</f>(graph, poly_points)
┣━ <f>select_edges</f>(graph, poly_points)
┣━ <f>nearest_vertex</f>(graph, point)
┣━ <f>nearest_edge</f>(graph, point)
┣━ <f>face_containing_point</f>(graph, point)
┣━ <f>folded_faces_containing_point</f>(graph, point, faces_matrix)
┣━ <f>faces_containing_point</f>(graph, point)
┣━ <f>topmost_face</f>(graph, faces)
</code></pre>

<p>
  Kawasaki's theorem, sector math, angles around a vertex.
</p>

<pre class="code compact"><code>┃ <c>// sector angles and Kawasaki</c>
┣━ <f>alternating_sum</f>(...numbers)
┣━ <f>kawasaki_flatness</f>(...sectorAngles)
┣━ <f>vertex_adjacent_vectors</f>(graph, vertex)
┣━ <f>vertex_sectorAngles</f>(graph, vertex)
┣━ <f>vertex_kawasaki_flatness</f>(graph, vertex)
┣━ <f>make_vertices_sectorAngles</f>(graph)
┣━ <f>make_vertices_kawasaki_flatness</f>(graph)
┣━ <f>make_vertices_kawasaki</f>(graph)
┣━ <f>make_vertices_nudge_matrix</f>(graph)
┣━ <f>kawasaki_test</f>(graph, EPSILON = math.core.EPSILON)
┣━ <f>make_vertices_nudge</f>(graph)
┣━ <f>kawasaki_solutions_radians</f>(...vectors_radians)
┣━ <f>kawasaki_solutions</f>(...vectors)
┣━ <f>kawasaki_collapse</f>(graph, vertex, face, crease_direction = "F")
</code></pre>

<pre class="code compact"><code>┃ <c>// </c>
copy_without_marks: ƒ (graph)

add_edge: ƒ (graph, a, b, c, d, assignment = "U")
split_edge_run: ƒ ( graph, x, y, old_edge_index )
apply_run: ƒ (graph, diff)
merge_run: ƒ (graph, target, source)
apply_axiom: ƒ (axiom, solutions, parameters)
</code></pre>

<h2>Discussion</h2>

<h3>Remove</h3>

<pre class="code"><code>[<n>0.0</n>, <n>0.0</n>, <n>0.0</n>],
[<n>0.5</n>, <n>1.0</n>, <n>0.0</n>],
<key>xxx</key>
[<n>1.0</n>, <n>1.0</n>, <n>1.0</n>]</code></pre>

<p>
  If a component at an arbitrary index is removed, the following array elements need to shift up by one. This breaks all other arrays which reference this one.
</p>

<p>
  The <b>remove</b> method addresses this.
</p>

<pre class="code"><code><f>RabbitEar</f>.core.<f>remove</f>(graph, <str>"vertices"</str>, [<n>5</n>, <n>9</n>])</code></pre>

<p>
  This will remove elements 5 and 9 from all arrays beginning with <b>vertices_</b> ("vertices_coords"), and update all indices accordingly in every array that ends with <b>_vertices</b> ("edges_vertices").
</p>

<h3>Clean</h3>

<pre class="code"><code>graph.<f>clean</f>()</code></pre>

<p>Clean will fix a graph in accordance with general graph theory. A graph cannot contain:</p>

<p class="explain">
  <b>circular edges:</b> an edge cannot connect the same vertex at both ends<br><b>duplicate edges:</b> the same 2 vertices cannot have more than 1 edge between them
</p>

<h3>Populate</h3>

<p>
  Consider this graph which models the square below.
</p>

<pre class="code"><code>vertices_coords: [[<n>0</n>, <n>0</n>], [<n>1</n>, <n>0</n>], [<n>1</n>, <n>1</n>], [<n>0</n>, <n>1</n>]]
edges_vertices: [[<n>0</n>, <n>1</n>], [<n>1</n>, <n>2</n>], [<n>2</n>, <n>3</n>], [<n>3</n>, <n>0</n>], [<n>0</n>, <n>2</n>]]
edges_assignment: [<str>"B"</str>, <str>"B"</str>, <str>"B"</str>, <str>"B"</str>, <str>"M"</str>]</code></pre>

<p>
  The four vertices are the four corners. The edges mark the boundaries except for the final edge, the diagonal, given the assignment "mountain fold".
</p>

<svg viewBox="-0.1 -0.1 1.2 1.2" stroke-width="0.02" fill="none">
  <path stroke="#e53" stroke-dasharray="0.03 0.02" d="M0,0L1,1" />
  <path stroke="black" d="M0,0L1,0L1,1L0,1Z" />
</svg>

<p>
  If the above example is the variable <b>g</b>, this method will populate all the other arrays.
</p>

<pre class="code"><code><f>var</f> graph <key>=</key> <f>RabbitEar</f>.<f>graph</f>(g)<br>graph.<f>populate</f>();</code></pre>

<p>
  Resulting in:
</p>

<pre class="code"><code>vertices_coords: [[<n>0</n>,<n>0</n>], [<n>1</n>,<n>0</n>], [<n>1</n>,<n>1</n>], [<n>0</n>,<n>1</n>]]
vertices_vertices: [[<n>1</n>,<n>2</n>,<n>3</n>], [<n>2</n>,<n>0</n>], [<n>0</n>,<n>1</n>,<n>3</n>], [<n>0</n>,<n>2</n>]]
vertices_edges: [[<n>0</n>,<n>3</n>,<n>4</n>], [<n>0</n>,<n>1</n>], [<n>1</n>,<n>2</n>,<n>4</n>], [<n>2</n>,<n>3</n>]]
vertices_faces: [[<n>0</n>,<n>1</n>], [<n>0</n>], [<n>0</n>,<n>1</n>], [<n>1</n>]]
edges_vertices: [[<n>0</n>,<n>1</n>], [<n>1</n>,<n>2</n>], [<n>2</n>,<n>3</n>], [<n>3</n>,<n>0</n>], [<n>0</n>,<n>2</n>]]
edges_edges: [[<n>3</n>,<n>4</n>,<n>1</n>], [<n>0</n>,<n>2</n>,<n>4</n>], [<n>1</n>,<n>4</n>,<n>3</n>], [<n>2</n>,<n>0</n>,<n>4</n>], [<n>0</n>,<n>3</n>,<n>1</n>,<n>2</n>]]
edges_faces: [[<n>0</n>], [<n>0</n>], [<n>1</n>], [<n>1</n>], [<n>0</n>,<n>1</n>]]
edges_length: [<n>1</n>, <n>1</n>, <n>1</n>, <n>1</n>, <n>1.4142135623730951</n>]
edges_foldAngle: [<n>0</n>, <n>0</n>, <n>0</n>, <n>0</n>, -<n>180</n>]
edges_assignment: [<str>"B"</str>, <str>"B"</str>, <str>"B"</str>, <str>"B"</str>, <str>"M"</str>]
faces_vertices: [[<n>2</n>,<n>0</n>,<n>1</n>], [<n>3</n>,<n>0</n>,<n>2</n>]]
faces_edges: [[<n>4</n>,<n>0</n>,<n>1</n>], [<n>3</n>,<n>4</n>,<n>2</n>]]
faces_faces: [[<n>1</n>], [<n>0</n>]]
</code></pre>

<h2>Planar Graphs</h2>

<p>
  When the FOLD object is meant to represent a crease pattern, we can treat it like a <b>planar graph</b>.
</p>

<div id="canvas-intersection-wobble" class="panorama"></div>

<p class="quote">
  In planar graphs, it's illegal for two edges to cross.
</p>

<h3>Fragment</h3>

<p>
  The fragment method converts a graph into a planar graph.
</p>

<div id="canvas-graph-fragment"></div>

<pre class="code"><code><span id="span-merge-result"></span>graph.<f>fragment</f>()</code></pre>

<p>
  Fragment locates all overlapping edges and resolves them by adding a vertex at their intersection, and substitutes an overlapped edge with two edges.
</p>

<p class="explain">
  This method removes all 3D information and triggers a re-build on all other component arrays.
</p>

<h3>Join</h3>

<p>
  Join two graphs into one.
</p>

<div id="canvas-graph-join"></div>

<pre class="code"><code><span id="span-merge-result"></span>graph.<f>join</f>(graph2)</code></pre>

<p>
  This example demonstrates the join method with a very permissive <b>epsilon</b>.
</p>
<p>
  Notice how vertices will snap to other vertices. With a more appropriate epsilon this will still happen but with a more reasonable level of deformation.
</p>

<h3>Sectors</h3>

<p>
  Origami math, especially concerning flat-foldability, focuses a lot of attention to the space around a vertex and the interior angles formed by the edges.
</p>

<p>
  These interior angles are called <b>sectors</b>, and I like to call the collection of sectors around one vertex a <b>junction</b>.
</p>

  <div class="centered">
    <canvas id="canvas-edge-winding" resize></canvas>
  </div>

  <div class="centered">
    <pre><code><key>let</key> a <key>=</key> junction.<f>edges</f>[<n><span id="edge-angle-index"></span></n>]  <span id="edge-angle-div"></span><br><span id="edge-angle-clockwise"></span></code></pre>
  </div>

  <p class="quote">All radially-sorted components, like edges around a junction, are sorted counter-clockwise.</p>

  <p class="explain">This library is strictly in the cartesian system, however this graphics library uses an inverted Y axis. Counter-clockwise appears clockwise.</p>

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
  

<pre class="code"><code>vertices_coords <key>=</key> [<br>  [<n>0.8660254</n>, <n>0.5</n>]<br>]</code></pre>

<p>
  If you want a face expressed as a list of <b>vertices in space</b>, a simple map will convert indices to vertices.
</p>
  
<pre class="code"><code><f>var</f> polygon <key>=</key> faces_vertices[<n>0</n>]
  .<f>map</f>(<arg>v</arg> <f>=></f> vertices_coords[v])</code></pre>

<p>
  Read more about the FOLD format from <a href="https://github.com/edemaine/fold">the official documentation</a>.
</p>

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

<script type="text/javascript" src="../ui-tests/graph_fragment.js"></script>
<script type="text/javascript" src="../ui-tests/graph_join.js"></script>

<!-- 
<script type="text/javascript" src="js/d3_graph_removeNode.js"></script>
<script type="text/javascript" src="js/d3_graph_removeEdge.js"></script>
-->

<!-- <script type="text/javascript" src="../ui-tests/line_intersection_animated.js"></script> -->

<!--
<script type="text/javascript" src="../tests/fragment.js"></script>
<script type="text/javascript" src="../tests/faces_convex.js"></script>
<script type="text/javascript" src="../tests/faces_non_convex.js"></script>
<script type="text/javascript" src="../tests/edge_winding.js"></script>
<script type="text/javascript" src="../tests/sector.js"></script>
<script type="text/javascript" src="../tests/nearest_sector.js"></script>
 -->




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

<!-- 
<script>
// wobble_intersections_callback = function(e){
//  document.getElementById("span-intersection-results").innerHTML = "<v>Array</v>(<n>" + e.length + "</n>) ← ";
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
 -->
<?php include 'footer.php';?>