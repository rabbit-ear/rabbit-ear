<?php include 'header.php';?>

<section id="planar-graph">
<h2>Generate Creases</h2>
	<div class="accordion">
		<p>Add creases by adding their endpoints or add a crease using an existing crease for positioning.</p>
	</div>

	<div id="divTest03_02" class="centered p5sketch"></div>

	<pre><code>graph.<span class="token function">addEdgeWithVertices</span>( <span id="divAddNode02x1">x1</span>, <span id="divAddNode02y1">y1</span>, <span id="divAddNode02x2">x2</span>, <span id="divAddNode02y2">y2<span> )</code></pre>

	<div id="divTest03_03" class="centered p5sketch"></div>

	<pre><code>graph.<span class="token function">addEdgeFromVertex</span>( firstNodeIndex, x, y )</code></pre>

	<div class="third p5sketch" id="divTest01"></div>
	<div class="third p5sketch" id="divTest02"></div>
	<div class="third p5sketch" id="divTest03"></div>

	<pre><code><span id="spanAddEdge1">graph.<span class="token function">addEdgeWithVertices</span>( x1, y1, x2, y2 )</span>    <span class="token comment">//(float, float, float, float)</span><br><span id="spanAddEdge2">graph.<span class="token function">addEdgeFromVertex</span>( firstNodeIndex, x, y )</span>    <span class="token comment">//(uint, float, float)</span><br><span id="spanAddEdge3">graph.<span class="token function">addEdgeFromVertex</span>( lastNodeIndex, x, y )</span>    <span class="token comment">//(uint, float, float)</span></code></pre>
</section>

<section id="intersections">
	<h2><a href="#intersections">Clean</a></h2>
	<div class="accordion">
		<div>
			<p>Clean does a few things:</p>
			<p>First, it removes any redundant edges (when 2 or more edges join between the same nodes).</p>
			<p>Secondly, because this is a planar graph, it is able to remove redundant nodes when 2 or more nodes exist at the same location in space.</p>
			<p>Due to floating point precision, points are determined to be redundant when the are close enough to a certain floating point precision.</p>
		</div>
	</div>

	<pre><code>graph.<span class="token function">clean</span>()</code></pre>
	<pre><code>graph.<span class="token function">mergeDuplicateVertices</span>()    <span class="token comment">//calling clean() will automatically call this</span></code></pre>
</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/03_add_nodes.js"></script>
<script language="javascript" type="text/javascript" src="../tests/03_add_nodes_02.js"></script>
<script language="javascript" type="text/javascript" src="../tests/03_add_nodes_03.js"></script>
<script>
	var p501 = new p5(test03, 'divTest01');
	p501.pattern = 0;
	var p502 = new p5(test03, 'divTest02');
	p502.pattern = 1;
	var p503 = new p5(test03, 'divTest03');
	p503.pattern = 2;
	var p503_02 = new p5(test03_02, 'divTest03_02');
	var p503_03 = new p5(test03_03, 'divTest03_03');

	$("#spanAddEdge1").mouseenter(function(){ p501.setHighlight(true); })
	                  .mouseleave(function(){ p501.setHighlight(false); });
	$("#spanAddEdge2").mouseenter(function(){ p502.setHighlight(true); })
	                  .mouseleave(function(){ p502.setHighlight(false); });
	$("#spanAddEdge3").mouseenter(function(){ p503.setHighlight(true); })
	                  .mouseleave(function(){ p503.setHighlight(false); });
</script>

<?php include 'footer.php';?>