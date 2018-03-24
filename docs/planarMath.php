<?php include 'header.php';?>

<h1>EUCLIDEAN MATH</h1>

	<div class="centered">
		<canvas id="canvas-interior-angles" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><span id="interiorAngleSpan"></span></code></pre>
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

<section id="types">

<h2>TYPES</h2>

<h3>Points</h3>
	<p>A point is represented by its components: x and y. There is only one data structure in this library, and it takes its name from these components.</p>
	<div class="centered">
		<pre><code><key>let</key> point <key>=</key> <key>new</key> <v>XY</v>(<n>0.5</n>, <n>0.666</n>)</code></pre>
	</div>

<h3>Lines</h3>
	<p><b>Mathematical lines</b> extend infinitely in both directions, <b>rays</b> extend infinitely in one direction, and line segments, or <b>edges</b> are bound by two endpoints.</p>
	<div class="centered">
		<pre><code><key>let</key> segment <key>=</key> <key>new</key> <v>Edge</v>(<n>0.0</n>, <n>0.0</n>, <n>1.0</n>, <n>1.0</n>)</code></pre>
	</div>
	<div class="centered">
		<pre><code><key>let</key> ray <key>=</key> <key>new</key> <v>Ray</v>(<n>0.0</n>, <n>0.0</n>, <n>1.0</n>, <n>1.0</n>)</code></pre>
	</div>
	<div class="centered">
		<pre><code><key>let</key> line <key>=</key> <key>new</key> <v>Line</v>(<n>0.0</n>, <n>0.0</n>, <n>1.0</n>, <n>1.0</n>)</code></pre>
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
interiorAnglesCallback = function(event){
	// console.log(event);
	var string = "edges <key>=</key> ";
	if(event !== undefined){
		event.edgeAngles.forEach(function(el, i){
			string += "<n>" + (el*180/Math.PI).toFixed(1) + "</n>&deg;"
			if(i !== event.edgeAngles.length-1){ string += ", "; }
		});
		string += "<br>interior angles <key>=</key> ";
		event.interiorAngles.forEach(function(el, i){
			string += "<n>" + (el*180/Math.PI).toFixed(1) + "</n>&deg;"
			if(i !== event.edgeAngles.length-1){ string += ", "; }
		});
	}
	document.getElementById("interiorAngleSpan").innerHTML = string;
}
projectInAngles.onMouseMove();
</script>

<script>
reflexMatrixCallback = function(event){
	if(event !== undefined){
		var a = event.a.toFixed(2);
		var b = event.b.toFixed(2);
		var c = event.c.toFixed(2);
		var d = event.d.toFixed(2);
		var tx = event.tx.toFixed(2);
		var ty = event.ty.toFixed(2);
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
