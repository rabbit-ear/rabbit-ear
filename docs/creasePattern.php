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
		<p>A crease pattern. This library comes with the few of the popular bases baked in.</strong></p>
	</div>

	<div class="centered">
		<pre><code><key>var</key> cp<key> = new</key> CreasePattern().<v>loadSVG</v>(<str>"filename"</str>)</code></pre>
	</div>
	<div class="quote">
		<p>Can also load crease patterns from a file.</p>
	</div>

	<div class="centered">
		<pre><code> </code></pre>
	</div>
	<div class="quote">
		<p>And of course, build up a crease pattern from a sequence of folds.</p>
	</div>

</section>

<script type="text/javascript" src="../tests/js/blank.js"></script>

<script>
	new PaperCreasePattern(new CreasePattern().birdBase(), "canvas-1");
</script>

<?php include 'footer.php';?>