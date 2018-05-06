<?php include 'header.php';?>

<!-- <script type="text/javascript" src="../lib/p5.min.js"></script>
<script type="text/javascript" src="../src/cp.p5js.js"></script>
 -->

<!-- <h3 class="centered" style="padding-top:2em;">CHAPTER V.</h3> -->
<h1>SYMMETRY</h1>

<section id="intro">

	<div class="quote">
		<p>Classical origami designs make frequent use of bilaterial symmetry.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-mirror-book" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<v>bookSymmetry</v>()<br>cp.<v>diagonalSymmetry</v>()</code></pre>
	</div>

	<div class="quote">
		<p>After calling one of these functions, every crease will automatically be creased twice.</p>
	</div>

	<div class="centered">
		<canvas id="canvas-mirror" resize></canvas>
	</div>

	<div class="quote">
		<p>You can also specify a unique line of symmetry with two points</p>
	</div>

	<div class="centered">
		<canvas id="canvas-reflection" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>cp.<v>setSymmetryLine</v>(<arg>x1</arg>, <arg>y1</arg>, <arg>x2</arg>, <arg>y2</arg>)</code></pre>
	</div>

	<div class="quote">
		<p>This works like a state machine. Turn symmetry "on" and every fold's reflection will be creased also until the moment you turn symmetry off again.</p>
	</div>

	<div class="centered">
		<pre><code>cp.<v>noSymmetry</v>()</code></pre>
	</div>

</section>

<script src="../tests/mirror.js"></script>
<script src="../tests/mirror-book.js"></script>
<script src="../tests/reflection.js"></script>

<?php include 'footer.php';?>