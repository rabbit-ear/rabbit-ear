<?php include 'header.php';?>

<h3 class="centered" style="padding-top:2em;">CHAPTER III.</h3>
<h1>CREASE PATTERNS</h1>

<section id="intro">

	<div class="centered">
		<canvas id="canvas-1" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> cp<key> = new</key> CreasePattern().<v>birdBase</v>()</code></pre>
	</div>

<h2>Paper</h2>

	<div class="quote">
		<p>Load crease patterns from a file and it will attempt to interpret mountain valley assignment</strong></p>
	</div>

	<div class="centered">
		<canvas id="canvas-load-svg" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> cp<key> = new</key> CreasePattern().<v>loadSVG</v>(<str>"crane.svg"</str>)</code></pre>
	</div>

<h2>Creases</h2>

	<div class="quote">
		<p>Creases are planar graph edges with more properties.</strong></p>
	</div>

	<div class="centered">
	<pre><code><v>CreaseDirection</v>{<br>&nbsp;mark,<br>&nbsp;border,<br>&nbsp;mountain,<br>&nbsp;valley<br>}</code></pre>
	</div>

	<div class="quote">
		<p>This generative twist is flat-foldable</p>
	</div>

	<div class="centered">
		<canvas id="canvas-joint-triangle-animated" resize></canvas>
	</div>

</section>

<script type="text/javascript" src="../tests/js/joint_tri_anim.js"></script>

<script>
	new OrigamiPaper("canvas-1", new CreasePattern().birdBase());

	var craneCP = new OrigamiPaper("canvas-load-svg");

	craneCP.load("/tests/svg/crane.svg", function(){
		// console.log("rendered file");
		// console.log(cp);
		// new OrigamiPaper("canvas-load-svg", cp);
		// loadSVGSketch.cp = cp;
		// loadSVGSketch.init();
	});

</script>

<?php include 'footer.php';?>