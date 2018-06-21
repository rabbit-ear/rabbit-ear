<?php include 'header.php';?>

<!-- <h3 class="centered" style="padding-top:2em;">CHAPTER V.</h3> -->
<h1>WELCOME</h1>

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

<p class="quote">Imagine what this looks like, point (0.5, 1) is along the bottom edge, halfway across (inverted Y axis). This is a line from the top left corner to the bottom edge, halfway across.</p>

<p>Now for the fun part, let's fold the crease pattern.</p>

<div class="centered">
<pre><code><f>var</f> cp <key>=</key> <key>new</key> CreasePattern();<br>cp.<f>crease</f>(<n>0</n>, <n>0</n>, <n>0.5</n>, <n>1</n>);<br><f>var</f> svg <key>=</key> cp.<f>foldSVG</f>();<br><f>console.log</f>(svg);<br>
</code></pre>
</div>

<p class="quote">Browsers make locally downloading a file difficult, so I built an example with a download button.</p>

<p>For now, you can copy and paste the SVG contents from the console into a file to see your result. Paste it into an empty file called <strong>folded.svg</strong>.</p>

	<div class="centered">
		<img src="images/one-fold.svg">
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
<?php include 'footer.php';?>