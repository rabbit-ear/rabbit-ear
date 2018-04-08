<?php include 'header.php';?>

<!-- <h3 class="centered" style="padding-top:2em;">CHAPTER V.</h3> -->
<h1>DOWNLOAD</h1>

<section id="intro">

	<p>To install, download <a href="">this .zip file</a>. That is all.</p>

	<p>folder contents:</p>
	<ul>
		<li><b>creasepattern.js / creasepattern.min.js</b>: the source</li>
		<li><b>mine/</b>: a folder for your sketches. look for the example in here.</li>
		<li><b>examples/</b>: fully-functional examples, run these in your browser.</li>
		<li><b>files/</b>: some crease patterns in .svg, .opx, .fold formats.</li>
	</ul>

	<p class="explain">This folder can live anywhere on your computer, as long as the files inside the folder are preserved.</p>

</section>


<section id="template">
<h2>YOUR FIRST APP</h2>

<div class="centered">
<pre><code><key>var</key> project <key>=</key> new OrigamiPaper("canvas");
<br>project.reset = function(){
<br>	// this.cp
<br>	// this.draw();
<br>}
<br>project.reset();
<br>project.onFrame = function(event) { }
<br>project.onResize = function(event) { }
<br>project.onMouseDown = function(event){ }
<br>project.onMouseUp = function(event){ }
<br>project.onMouseMove = function(event) { }</code></pre>
</div>

</section>



<section id="template">
<h2>OFFLINE USE</h2>

	<p>This crease pattern data structures are fully self-contained and will run offline. Visualization however is made possible by <a href="">Paper.js</a>.</p>

	<p>The examples link to Paper.js on a server-hosted CDN, if you download paper.js separately, and place it alongside this library, all content is able to be run and visualized offline.</p>

</section>
<?php include 'footer.php';?>