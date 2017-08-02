<?php include 'header.php';?>

<h1>INTERSECTIONS</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-intersections" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="span-merge-result"></span>graph.<f>chop</f>()</code></pre>
	</div>

	<div class="explain">
		<div>
			<p>Chopping a planar graph requires a lot of passes, or a smart algorithm. Each time one intersection gets chopped, 2 edges get removed, and replaced with 4 edges and 1 new node. .</p>
		</div>
	</div>

	<div class="centered">
		<canvas id="canvas-faces-random" resize></canvas>
	</div>

	<div class="tests">
		<ul>
			<li>clean()</li>
			<li>mergeDuplicateVertices(epsilon:number)</li>
		</ul>
	</div>

</section>

<!-- include .js sketches -->
<script language="javascript" type="text/javascript" src="../tests/js/intersections.js"></script>
<script language="javascript" type="text/javascript" src="../tests/js/faces_random.js"></script>

<script>
	edge_intersections_callback = function(event){
		if(event != undefined){
			document.getElementById("span-merge-result").innerHTML = event.length + " ← ";
		}
	}
</script>
<?php include 'footer.php';?>