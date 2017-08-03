<?php include 'header.php';?>

<h1>IMPORT &amp; EXPORT</h1>

<section id="intro">

<h2>Load from .svg</h2>

	<div class="centered">
		<canvas id="canvas-load-svg" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> cp<key> = new</key> CreasePattern().<v>loadSVG</v>("filename")</code></pre>
	</div>
	
</section>

<script type="text/javascript" src="../tests/js/load_svg.js"></script>

<?php include 'footer.php';?>