<?php include 'header.php';?>

<h3>class</h3>
<h1>AdjacentNodes</h1>

	<div class="quote">
		<p>node adjacent to node, with angle offset and connecting edge</p>
	</div>

<h2>Variables</h2>

	<div class="centered">
		<pre><code class="language-typescript">parent:PlanarNode;  // "first" node, polarity required for angle calculation
node:PlanarNode;
angle:number; // radians, angle from parent to node
edge:PlanarEdge;  // edge connecting the two nodes</code></pre>
	</div>

<h2>Constructor</h2>

	<div class="centered">
		<pre><code class="language-typescript">constructor(parent:PlanarNode, node:PlanarNode, edge:PlanarEdge)</code></pre>
	</div>

<?php include 'footer.php';?>