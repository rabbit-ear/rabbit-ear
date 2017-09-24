<?php include 'header.php';?>

<h3>class</h3>
<h1>Matrix</h1>

	<div class="quote">
		<p>2x3 matrix to represent reflection, scale, and translation in 2D</p>
	</div>

<h2>Variables</h2>

	<div class="centered">
		<pre><code class="language-typescript">a:number; 
b:number; 
c:number;
d:number;
tx:number;
ty:number;</code></pre>
	</div>

<h2>Constructor</h2>

	<div class="centered">
		<pre><code class="language-typescript">constructor(a?:number, b?:number, c?:number, d?:number, tx?:number, ty?:number)</code></pre>
	</div>

<h2>Class Methods</h2>

	<div class="centered">
		<pre><code class="language-typescript">identity()
/** Returns a new matrix, the sum of this and the argument. Will not change this or the argument
 * @returns {Matrix} 
 */
mult(matrix:Matrix):Matrix
/** Calculates the matrix representation of a reflection across a line
 * @returns {Matrix} 
 */
reflection(a:XY, b:XY):Matrix
/** Deep-copy the Matrix and return it as a new object
 * @returns {Matrix} 
 */
copy():Matrix</code></pre>
	</div>

<?php include 'footer.php';?>