<?php include 'header.php';?>

<h1>REFLECTION</h1>

<section id="intro">

	<div class="quote large">
		<div class="inline" id="matrix-2"></div><div class="inline" id="matrix-3"></div>
	</div>

	<div class="quote">
		<p>A 2x2 matrix is sufficient to represent a reflection line that goes through the origin. For all lines, an additional 1x2 column is required.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-reflection" resize></canvas>
	</div>

	<div class="quote large">
		<div id="matrix-1"></div>
	</div>

</section>

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