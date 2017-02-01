<?php include 'header.php';?>

<section id="intersections">
	<h2><a href="#intersesctions">Intersections</a></h2>
	<div class="accordion">
		<p>a planar graph is <b>INVALID</b> if an edge cross another edge. It's simple to resolve by splitting the 2 edges into 4 and place a node at the intersection point.</p>
	</div>

	<div class="centered p5sketch" id="divTest04"></div>

	<div class="centered">
		<pre><code>graph.<f>getAllEdgeIntersections</f>()</code></pre>
	</div>
</section>

<section id="parallel">
	<h2><a href="#parallel">Parallel Lines</a></h2>
	<div class="accordion">
		<p>Concerning floating point precision: at some point, two lines will be considered parallel, and impossible to intersect. We are</p>
	</div>

	<div class="centered p5sketch" id="divTest05"></div>
	
	<div class="centered">
		<pre><code>graph.<f>getAllEdgeIntersections</f>()</code></pre>
	</div>
</section>

<script language="javascript" type="text/javascript" src="../tests/04_intersections.js"></script>
<script language="javascript" type="text/javascript" src="../tests/05_parallels.js"></script>
<script>
	$(".accordion-title").html("MORE");
	var p504 = new p5(_04_intersections, 'divTest04');
	var p505 = new p5(_05_parallels, 'divTest05');
</script>

<?php include 'footer.php';?>