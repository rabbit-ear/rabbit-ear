<?php include 'header.php';?>

<h1>EUCLIDEAN MATH</h1>



	<div class="centered">
		<canvas id="canvas-interior-angles" resize></canvas>
	</div>

	<div class="centered">
		<pre><code></code></pre>
	</div>

<section id="junction">
<h2>JUNCTIONS &amp; JOINTS</h2>

	<p>In preparation for origami calculations, there is a lot to be done with the area around a node. A <strong>junction</strong> is the area including one node, its adjacent edges, and the interior angles they form.</p>

	<p>Junctions are comprised of <b>joints</b>, defined as one neighbor pair of adjacent edges (having been sorted rotationally around the node), and the 1 interior angle they form.</p>

	<p class="quote">Below is one junction, containing 2 joints, each joint bisected.</p>

	<div class="centered">
		<canvas id="canvas-vectors" resize></canvas>
	</div>

</section>


<section id="matrix">

<h2>MATRIX</h2>

	<div class="quote large">
		<div class="inline" id="matrix-2"></div><div class="inline" id="matrix-3"></div>
	</div>

	<p>Matrices are the dark arts of geometric transformations. Inside of one matrix can contain instructions for any number of rotations, translations, reflections, scaling, shearing (mathematically speaking some of those are redundant).</p>

	<p>A matrix for 2D transformations needs 6 numbers: 4 for rotation, scaling, and reflection operations, and 2 for translation.</p>

<h3 id="reflection">Reflection</h3>

	<p>A 2x2 matrix is sufficient to represent a reflection line that goes through the origin. For all lines, an additional 1x2 column is required.</p>

	<div class="centered">
		<canvas id="canvas-reflection" resize></canvas>
	</div>

	<div class="quote large">
		<div id="matrix-1"></div>
	</div>

	<p class="quote">drag the blue circles to move the line of reflection</p>

</section>

<section id="epsilon">

<h2>INTERSECTIONS</h2>

<h3 id="reflection">Lines and Segments</h3>

	<div class="centered">
		<canvas id="canvas-intersect-lines" resize></canvas>
		<canvas id="canvas-intersect-segments" resize></canvas>
	</div>

<h3 id="reflection">Rays and Segments</h3>

	<div class="centered">
		<canvas id="canvas-intersect-rays" resize></canvas>
		<canvas id="canvas-intersect-ray-segment" resize></canvas>
	</div>


</section>

<section id="epsilon">

<h2>EPSILON</h2>

		<p>Epsilon (ε) is the tiny space deep in the floating point number past the decimal point.</p>

		<p>Nearly every math function in this library offers an optional argument to allow you to specify a level of precision. </p>	

		<p>For most generative applications an epsilon of 0.00000001 is sufficient for Javascript's 64 bit floats. 0.001 is more reasonable when dealing with imported files created in vector graphics applications with sometimes imprecise input.</p>
	
</section>



<script type="text/javascript" src="../tests/vectors.js"></script>
<script type="text/javascript" src="../tests/interior_angles.js"></script>
<script type="text/javascript" src="../tests/intersect_segments.js"></script>
<script type="text/javascript" src="../tests/intersect_lines.js"></script>
<script type="text/javascript" src="../tests/intersect_rays.js"></script>
<script type="text/javascript" src="../tests/intersect_ray_segment.js"></script>

<script src="../tests/reflection.js"></script>

<script>
katex.render("\\begin{bmatrix} a & c & tx \\\\ b & d & ty \\end{bmatrix}", document.getElementById("matrix-1"));
katex.render("\\begin{Bmatrix} a & c \\\\ b & d \\end{Bmatrix}", document.getElementById("matrix-2"));
katex.render("\\begin{Bmatrix} tx \\\\ ty \\end{Bmatrix}", document.getElementById("matrix-3"));
</script>

<script>
reflexMatrixCallback = function(el){
	if(el !== undefined){
		var a = el.a.toFixed(2);
		var b = el.b.toFixed(2);
		var c = el.c.toFixed(2);
		var d = el.d.toFixed(2);
		var tx = el.tx.toFixed(2);
		var ty = el.ty.toFixed(2);
		if(a == "-0.00") a = "0.00";
		if(b == "-0.00") b = "0.00";
		if(c == "-0.00") c = "0.00";
		if(d == "-0.00") d = "0.00";
		if(tx == "-0.00") tx = "0.00";
		if(ty == "-0.00") ty = "0.00";
		katex.render("\\begin{bmatrix} "+a+" & "+b+" & "+tx+" \\\\ "+c+" & "+d+" & "+ty+" \\end{bmatrix}", document.getElementById("matrix-1"));
	}
}
reflex.computeReflection();
</script>

<?php include 'footer.php';?>
