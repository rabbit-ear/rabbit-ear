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
	<div class="quote">
		<p>Load crease patterns from a file and transform them</strong></p>
	</div>

	<div class="centered">
		<canvas id="canvas-load-svg" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> cp<key> = new</key> CreasePattern().<v>loadSVG</v>(<str>"filename"</str>)</code></pre>
	</div>

	<div class="quote">
		<p>This generative joint relies on the flat-foldability algorithm.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-single-joint" resize></canvas>
	</div>

</section>

<script type="text/javascript" src="../tests/js/joint.js"></script>

<script>
	new PaperCreasePattern("canvas-1", new CreasePattern().birdBase());


var loadSVGSketch = new PaperCreasePattern("canvas-load-svg");

loadSVG("/tests/svg/sea-turtle.svg", function(cp){ 
	loadSVGSketch.cp = cp;
	loadSVGSketch.initialize();
});

</script>

<?php include 'footer.php';?>