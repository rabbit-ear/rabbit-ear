<?php include 'header.php';?>

<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/cp.p5js.js"></script>

<h3 class="centered" style="padding-top:2em;">CHAPTER II.</h3>
<h1>PLANAR GRAPHS</h1>

<section id="intro">

	<div id="sketch_intersections" class="centered p5sketch"></div>

	<div class="centered">
		<pre><code><key>var</key> planarGraph<key> = new</key> PlanarGraph();<br><span id="span-intersection-results"></span>planarGraph.<f>getEdgeIntersections</f>();</code></pre>
	</div>

	<div class="quote">
		<p>A planar graph amends a graph's nodes with (X,Y) coordinates and adds the ability to detect faces</p>
	</div>

</section>

<script language="javascript" type="text/javascript" src="../tests/js/04_intersections.js"></script>

<script>

var p5intersections = new p5(_04_intersections, 'sketch_intersections');
// p5intersections.callback = function(e){
// 	document.getElementById("span-intersection-results").innerHTML = e.length + " ← ";
// }
</script>

<?php include 'footer.php';?>