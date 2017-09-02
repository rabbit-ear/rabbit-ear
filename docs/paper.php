<?php include 'header.php';?>

<h1>PAPER</h1>

<section id="shape">

	<div class="quote">
		<p>A new crease pattern will automatically set itself to be a unit square</p>
	</div>

	<div class="centered">
		<canvas id="canvas-1" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> cp<key> = new</key> CreasePattern().<v>square</v>()</code></pre>
	</div>

	<div class="quote">
		<p>There are a few popular shapes you can set by name, like rectangle</p>
	</div>

	<div class="centered">
		<canvas id="canvas-2" resize class="panorama"></canvas>
	</div>

	<div class="centered">
		<pre><code><key>var</key> cp<key> = new</key> CreasePattern().<v>rectangle</v>(<n>1.618</n>, <n>1</n>)</code></pre>
	</div>

	<div class="quote">
		<p>Any polygon can be made by supplying an array of points (convex &amp; clockwise winding).</strong></p>
	</div>

	<div class="centered">
		<pre><code><key>var</key> pointArray <key>=</key> [<br>&nbsp;<key>new</key> XY(<n>0.5</n>, <n>0.5</n>),<br>&nbsp;<key>new</key> XY(<n>0.0</n>, <n>1.0</n>), <br>&nbsp;<key>new</key> XY(<n>1.0</n>, <n>1.0</n>) ];<br><key>var</key> cp<key> = new</key> CreasePattern().<f>polygon</f>(pointArray)</code></pre>
	</div>

</section>

<h2>Thickness</h2>
<section></section>

<script>
	new OrigamiPaper("canvas-1", new CreasePattern()).zoomToFit(0.05);
	new OrigamiPaper("canvas-2", new CreasePattern().rectangle(1.618,1)).zoomToFit(0.05);
</script>


<?php include 'footer.php';?>