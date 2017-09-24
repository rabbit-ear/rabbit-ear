<?php include 'header.php';?>

<h3>class</h3>
<h1>XY</h1>

	<div class="quote">
		<p>Can be a point, vector, anything that is represented by a pair of numbers: x and y</p>
	</div>

<h2>Variables</h2>

	<div class="centered">
		<pre><code class="language-typescript">x:number
y:number</code></pre>
	</div>

<h2>Constructor</h2>

	<div class="centered">
		<pre><code class="language-typescript">constructor(x:number, y:number)</code></pre>
	</div>

<h2>Class Methods</h2>

	<div class="centered">
		<pre><code class="language-typescript">values():[number, number]
normalize():XY 
rotate90():XY 
rotate(origin:XY, angle:number)
dot(point:XY):number 
cross(vector:XY):number
mag():number 
equivalent(point:XY, epsilon?:number):boolean
transform(matrix):XY
reflect(a:XY,b:XY):XY
distance(a:XY):number</code></pre>
	</div>

<?php include 'footer.php';?>