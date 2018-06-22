<?php include 'header.php';?>
<!-- <link rel="stylesheet" type="text/css" href="css/buttons.css"> -->

<style>
.btn{
	background-color: DodgerBlue;
	border: none;
	color: white;
	padding: 12px 30px;
	font-size: 16px;
	cursor: pointer;
	font-size: 20px;
}
.btn:hover{ background-color: black; }	
</style>
<!-- <h3 class="centered" style="padding-top:2em;">CHAPTER V.</h3> -->
<h1>WELCOME</h1>

<section>
	<div class="centered">
		<button class="btn btn-dark" id="download-button"><i class="fa fa-download"></i> Download</button>
	</div>
	<p class="quote">rabbit-ear.zip (700kb)</p>
</section>

<section id="first-app">
<h2>YOUR FIRST APP</h2>

	<p>A typical new project workflow might begin by copying the "empty" folder in "my-designs".</p>
	<div class="centered">
		<img src="images/new-project.gif">
	</div>

	<p>All your time can be spent inside one file: <strong>sketch.js</strong></p>

<div class="centered">
<pre><code><f>var</f> origami <key>=</key> <key>new</key> OrigamiPaper(<str>"canvas"</str>);
<br><br><c>// event handlers for touch input</c>
<br><f>origami</f>.<v>onMouseDown</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseUp</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseMove</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseDidBeginDrag</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><c>// the animation function, this runs many times per second</c>
<br><f>origami</f>.<v>onFrame</v> = <f>function</f>(<arg>event</arg>){
<br>}
</code></pre>
</div>

<p>Before we go further, it's helpful to understand the CreasePattern object.</p>

</section>

<section>
<h2>Crease Pattern</h2>

<p>Just for a moment, erase everything inside of sketch.js, and replace it with one line</p>

<div class="centered">
<pre><code><f>var</f> cp <key>=</key> <key>new</key> CreasePattern();</code></pre>
</div>

<p>This is a crease pattern. It's a virtual object, it doesn't use PaperJS, it can't draw itself onscreen. It has only one file requirement: <strong>cp.js</strong>.</p>

<p>Add a second line, run it and open up your browser's Javascript console and peek around.</p>

<div class="centered">
<pre><code><f>var</f> cp <key>=</key> <key>new</key> CreasePattern();<br><f>console.log</f>(cp);</code></pre>
</div>


<p class="explain">This creates a unit-square with a boundary between 0 and 1 on both X and Y axes.</p>

<p>Let's add a crease between two points (0,0) and (0.5, 1). This can be done in a variety of ways. Pick <strong>just one</strong>.</p>

<div class="centered">
<pre><code>
cp.<f>crease</f>(<n>0</n>, <n>0</n>, <n>0.5</n>, <n>1</n>);<br>
cp.<f>crease</f>( {x:<n>0</n>,y:<n>0</n>}, {x:<n>0.5</n>,y:<n>1</n>} );<br>
cp.<f>crease</f>( [[<n>0</n>,<n>0</n>], [<n>0.5</n>,<n>1</n>]] );</code></pre>
</div>

<p class="quote">Imagine what this looks like: a line from the top left corner to the midpoint of the bottom edge. Point (0.5, 1) is along the bottom edge due to an inverted Y axis.</p>

<p>Now for the fun part, let's fold the crease pattern.</p>


<p class="quote">notice the additional <strong>valley()</strong></p>

<div class="centered">
<pre><code><f>var</f> cp <key>=</key> <key>new</key> CreasePattern();<br>cp.<f>crease</f>(<n>0</n>, <n>0</n>, <n>0.5</n>, <n>1</n>).<f>valley</f>();<br><f>var</f> svg <key>=</key> cp.<f>foldSVG</f>();<br><f>console.log</f>(svg);<br>
</code></pre>
</div>

<p class="quote">This makes an SVG file, but browsers make downloading a file a little complicated.</p>

<p>Open the Javascript console to find your SVG file. Copy and paste it into an empty file called <strong>folded.svg</strong>.</p>

	<div class="centered">
		<img src="images/one-fold.svg">
	</div>


<p>Copying and pasting gets old fast. Don't worry about what the following does - to make your SVG automatically download paste this at the very end of your sketch.</p>

<div class="centered">
<pre><code>
<f>var</f> element <key>=</key> <f>document</f>.<f>createElement</f>(<str>'a'</str>);<br>
element.<f>setAttribute</f>(<str>'href'</str>, <str>'data:text/plain;charset=utf-8,'</str> + <f>encodeURIComponent</f>(svg));<br>
element.<f>setAttribute</f>(<str>'download'</str>, <str>'folded.svg'</str>);<br>
<f>document</f>.<f>body</f>.<f>appendChild</f>(element);<br>
element.<f>click</f>();<br>
<f>document</f>.<f>body</f>.<f>removeChild</f>(element);<br>
</code></pre>
</div>

</section>

<section>
<h2>Origami Paper</h2>

<p>Let's go back to our original app. The OrigamiPaper object is a visualization of the CreasePattern, and it's very intertwined with PaperJS. In computer engineering terms, OrigamiPaper is the view to the CreasePattern model.</p>


<div class="centered">
<pre><code><f>var</f> origami <key>=</key> <key>new</key> OrigamiPaper(<str>"canvas"</str>);
<br><br><c>// event handlers for touch input</c>
<br><f>origami</f>.<v>onMouseDown</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseUp</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseMove</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseDidBeginDrag</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><c>// the animation function, this runs many times per second</c>
<br><f>origami</f>.<v>onFrame</v> = <f>function</f>(<arg>event</arg>){
<br>}
</code></pre>
</div>

<p>The OrigamiPaper comes with a CreasePattern object.</p>


<div class="centered">
	<pre><code><f>var</f> origami <key>=</key> <key>new</key> OrigamiPaper(<str>"canvas"</str>);<br>origami.cp; <c>// the crease pattern</c></code></pre>
</div>

<p>Now it should be clear how to add a crease.</p>

<div class="centered">
	<pre><code><f>var</f> origami <key>=</key> <key>new</key> OrigamiPaper(<str>"canvas"</str>);<br>origami.cp.<f>crease</f>(<n>0</n>, <n>0</n>, <n>0.5</n>, <n>1</n>);<br>origami.draw(); <c>// draw the changes to the screen</c></code></pre>
</div>

<p class="explain">Calling the draw() function is easy to forget. I'm working on a way to detect and automatically call this function.</p>

</section>

<section>

	<p>Check out the examples folder</p>

	<div class="centered">
		<canvas id="canvas-folded-crane" resize></canvas>
	</div>

	<div class="centered">
		<pre><code><key>new</key> OrigamiFold(<str>"folded-crane"</str>).<f>load</f>(<str>"crane.svg"</str>);</code></pre>
	</div>

</section>

<script>
new OrigamiFold("canvas-folded-crane").load("../files/svg/crane.svg");
</script>

<script type="text/javascript">
document.getElementById("download-button").onclick = function(e){
	var zip_file_path = "../rabbit-ear.zip";
	var zip_file_name = "rabbit-ear.zip";
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	a.href = zip_file_path;
	a.download = zip_file_name;
	a.click();
	document.body.removeChild(a);	
}
</script>
<?php include 'footer.php';?>