<?php include 'header.php';?>

<h1>CLEAN</h1>

<section id="intro">

	<div class="centered">
		<pre><code>graph.<f>clean</f>()</code></pre>
	</div>

	<div class="explain">
		<div>
			<p>Cleaning a graph remove any duplicate and circular edges, and leaves the nodes untouched.</p>
		</div>
	</div>

	<div class="tests">
		<ul>
			<li><a href="../tests/html/graph_stress.html">10,000 edges</a></li>
			<li><a href="../tests/html/graph_remove.html">remove a node</a></li>
		</ul>
	</div>

</section>

<?php include 'footer.php';?>