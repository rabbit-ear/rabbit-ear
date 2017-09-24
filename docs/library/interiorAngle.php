<?php include 'header.php';?>

<h3>class</h3>
<h1>InteriorAngle</h1>

	<div class="quote">
		<p>This represents the space between two adjacent planar edges.</p>
	</div>

<h2>Variables</h2>

	<div class="centered">
		<pre><code class="language-typescript">edges:[PlanarEdge,PlanarEdge];
node:PlanarNode;
angle:number;</code></pre>
	</div>

<h2>Constructor</h2>

	<div class="centered">
		<pre><code class="language-typescript">constructor(edge1:PlanarEdge, edge2:PlanarEdge)</code></pre>
	</div>

<h2>Class Methods</h2>

	<div class="centered">
		<pre><code class="language-typescript">equivalent(a:InteriorAngle):boolean</code></pre>
	</div>

<?php include 'footer.php';?>