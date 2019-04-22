<?php include 'header.php';?>

<span style="color:#e44f2a"></span>
<span style="color:#ecb233"></span>
<span style="color:#6096bb"></span>

<h3 style="text-align:center;margin-top:3em;">CHAPTER IV.</h3>

<h1>RABBIT EAR</h1>

	<pre><code>&lt;<key>script</key> <v>src</v>=<str>"rabbit-ear.js"</str>&gt;&lt;/<key>script</key>&gt;</code></pre>

	<p class="quote">Everything is contained in this one file, rabbit-ear.js</p>

<div id="canvas-origami-fold"></div>

<section id="types">
	<h2>Library structure</h2>
	<!-- <p>This library contains a growing list of about ten primitives.</p> -->
	<div class="centered">
		<pre class="compact"><code><f>RabbitEar</f>
┃
┣━ <v>CreasePattern</v>
┣━ <v>Origami</v>
┣━ <v>Graph</v>
┣━ bases
┣━ math
┣━ svg
┗━ core</code></pre>
	</div>

	<p>The highlighted green are objects you can create. Bases, math, svg, and core are all containers themselves.</p>

	<p class="quote">The goal is to <b>not</b> have to go into "core". it's like opening up your engine.</p>

</section>

<section>
	
	<p>Before going too deep, here are some generally useful things:</p>

<h3>Convert between files</h3>

</section>

<section>

<h2>Objects</h2>

<h3>I. Origami</h3>


<h3>II. CreasePattern</h3>
	<div class="diptych">
		<img src="../rabbitear-site/images/one-fold-cp.svg">
	</div>


	<p>A crease pattern is an extended <a href="https://github.com/edemaine/fold">FOLD</a> object. This is where all the crease information is stored, meaning it follows the specification but with additional methods like adding creases, folding, and performing calculations.</p>

	<div class="centered">
		<pre><code><f>let</f> cp <key>=</key> <f>RabbitEar</f>.<f>CreasePattern</f>();</code></pre>
	</div>

	<div class="centered">
		<pre class="compact"><code><f>CreasePattern</f>
┃
┣━ <v>axiom1</v>
┣━ <v>axiom2</v>
┣━ <v>axiom3</v>
┣━ <v>axiom4</v>
┣━ <v>axiom5</v>
┣━ <v>axiom6</v>
┣━ <v>axiom7</v>
┣━ <v>creaseLine</v>
┣━ <v>creaseRay</v>
┣━ <v>creaseSegment</v>
┣━ <v>creaseThroughLayers</v>
┣━ <v>valleyFold</v>
┣━ <v>kawasaki</v>
┗━ core</code></pre>
	</div>

</section>


<section>
<h2>Containers</h2>
<h3>I. Core</h3>
<h3>II. Math</h3>
<h3>III. SVG</h3>
<h3>IV. bases</h3>

</section>

<section>

	<h2>CONTRIBUTING</h2>

	<p>If it wasn't obvious yet (then I succeeded), this library is not finished.</p>

	<p>The core of this library is in a good place; the data model follows the FOLD specification, graphics are in SVG, and the math library was written specifically for this project.</p>

	<p>But there's a lot of room left at the top for origami functionality. Here's how I do it:</p>

	<ul>
		<li>sketch out new ideas in working examples.</li>
		<li>if I can generalize the sketch enough I can sometimes find a way to absorb it into the main core.</li>
	</ul>

</section>

<section>

<h2>APPENDIX</h2>

	<div class="centered">
		<pre class="compact"><code><f>RabbitEar</f>.math
┃
┣━ Circle
┣━ ConvexPolygon
┣━ ...
┗━ <v>core</v></code></pre>
</section>

<script type="text/javascript" src="../tests/origami_fold.js"></script>

<?php include 'footer.php';?>
