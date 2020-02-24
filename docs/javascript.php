<?php include 'header.php';?>

<h3>Introduction to</h3>

<h1>Javascript</h1>

<p>
	Javascript has 3 primitive types: <b>string</b>, <b>numbers</b>, <b>booleans</b>.
</p>

<pre><code class="code"><f>var</f> str <key>=</key> <str>"hello"</str>;
<f>var</f> num <key>=</key> <n>3.14</n>;
<f>var</f> bool <key>=</key> <n>4</n> <key>&lt;</key> <n>5</n>;
</code></pre>

<p>
	...and 2 container types: <b>arrays</b>, <b>objects</b>.
</p>

<pre><code class="code"><f>var</f> arr <key>=</key> [<n>true</n>, <str>"hello"</str>, <n>5</n>];
<f>var</f> obj <key>=</key> {temperature: <n>59.2</n>, celsius: <n>false</n>};
</code></pre>

<p>
	...and a <b>function</b> type. Functions are <a href="https://en.wikipedia.org/wiki/First-class_function">first-class citizens</a>.
</p>

<pre><code class="code"><f>var</f> func <key>=</key> <f>function</f> <v>hello</v>() { <f>console</f>.<f>log</f>(<str>"hi"</str>); }
</code></pre>

<h2>strings</h2>

<p>
	Javascript is pretty great with strings, it can take <em>anything</em> from the Unicode specification, including emojis.
</p>

<h2>numbers</h2>

<p>
	Whole numbers and fractions (int, float) are the same type here. To convert use `Math.floor()` or `parseInt()`, <em>floor is quicker</em>. Floating point types are doubles (about 16 decimal places). Numbers include: `Infinity`, `-Infinity`, `NaN` for <b>not a number</b> where boolean comparison cannot work but instead use the built in function `isNaN(num)`.
</p>

<h2>arrays [ ]</h2>

<p>
	Javascript arrays are zero-based ordered containers. They're capable of adjusting their size later. They aren't type-strict, one array can contain multiple different types.
</p>

<pre><code class="code">var arr = ["mango", "pomegranate", "coconut"];
</code></pre>

<p>
	an expanded view of this example includes these indices.
</p>

<pre><code class="code">var arr = [
  0: "mango",
  1: "pomegranate",
  2: "coconut"
];
</code></pre>

<p>
	<em>You would never write an array this way! Please write it as in the first example.</em>
</p>

<h2>objects { }</h2>

<p>
	objects and arrays both have a related job of being containers, but an object's <em>indices</em> or <em>keys</em> are descriptive <b>strings</b>:
</p>

<pre><code class="code">var obj = {
  temperature: 59.2,
  celsius: false,
  city: "New York City"
};
</code></pre>

<h2>working with arrays and objects</h2>

<p>
	getting things inside and outside of an array:
</p>

<pre><code class="code">arr[2]
</code></pre>

<p>
	getting things inside and outside of an object:
</p>

<pre><code class="code">obj["temperature"]
obj.temperature
</code></pre>

<p>
	In arrays, there are a few ways for setting and getting elements
</p>

<ul>
	<li>`push` and `unshift` **append** to the back and front, respectively.</li>
	<li>`pop` and `shift` **remove** from the back and front, respectively.</li>
	<li>or you can manually set indices which were previously unset.</li>
</ul>

<pre><code class="code">arr.push("plum")
arr[4] = "banana";
</code></pre>

<p>
	Use the `delete` operator to remove entries from an object:
</p>

<pre><code class="code">delete obj.city;
</code></pre>

<p>
	Restrict your use of `delete` for objects, using it in arrays will create <b>holes in your array</b>.
</p>

<p>
	Iterating over elements in an array:
</p>

<pre><code class="code">for (var i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
</code></pre>

<p>
	or
</p>

<pre><code class="code">arr.forEach(el => console.log(el) );
</code></pre>

<p>
	Iterating over elements in an object:
</p>

<pre><code class="code">for (key in obj) {
	console.log(key, obj[key]);
}
</code></pre>

or

<pre><code class="code">Object.keys(obj).forEach(key => console.log(key, obj[key]) );
</code></pre>

<p>
	Object.keys creates an array of keys as <b>strings</b>. These two approaches are the fastest. There are other nuances about objects and their properties (in prototypes) worth eventually understanding.
</p>

<h2>undefined and null</h2>

<p>
	when you first create a variable, it is <b>undefined</b>
</p>

<pre><code class="code">var myVar;
console.log(myVar); // will print "undefined"
</code></pre>

<p>
	there is also the similar <b>null</b> state
</p>

<pre><code class="code">console.log(document.body.onclick) // will print "null"
</code></pre>

<p>
	to become an expert in Javascript you need to be able to navigate the weird relationships between comparing against these and other falsey values. good luck!
</p>

<h2>type checking</h2>

<pre><code class="code">typeof a
</code></pre>

<p>
	will print `"object"` if the variable is an <b>array</b>. Arrays need to be checked with:
</p>

<pre><code class="code">typeof a === "object" && a.constructor === Array
</code></pre>

<p>
	...otherwise, variables will give their expected types as a string, including `"function"`. Watch out for the undefined and null types `typeof null` is "object".
</p>

<h2>Appendix</h2>

<p>
	this guide teaches old Javascript (pre-ES6), modern syntax uses `let` and `const` instead of `var`, but this code is compatible.
</p>

<p>
	arrays are actually objects. the numerical indices are actually strings: "0", "1", "2".
</p>

<?php include 'footer.php';?>