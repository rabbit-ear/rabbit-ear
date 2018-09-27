<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Rabbit Ear, origami and creative code</title>
<meta name="description" content="an origami creative coding library. design crease patterns in code">
<meta http-equiv="content-type" content="text/html;charset=UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
<link href="https://fonts.googleapis.com/css?family=Montserrat:600,900" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="../docs/css/code.css">
<link rel="stylesheet" type="text/css" href="css/byrne.css?version=0.2">
<link rel="stylesheet" type="text/css" href="css/page.css?version=0.2">
<link rel="stylesheet" type="text/css" href="css/cp-dark.css?version=0.2">

<div class="container">

<h1>DOWNLOAD</h1>

	<div class="column">
		<button class="btn btn-primary" id="download-button"><i class="fa fa-download"></i> rabbit-ear-0.1.zip</button>
		<p>381 kb</p>
	</div>

</div>

<div class="container">

<h1>YOUR FIRST APP</h1>

<section id="first-app">

	<p>It's easy to create a new project: copy and rename the "empty" folder in "sketches".</p>
	<div class="centered">
		<img src="images/new-project.gif">
	</div>

	<p>You can peek inside <strong>index.html</strong> and <strong>style.css</strong> if you like. But those are mostly for setting up the files.</p>

<div class="centered">
<pre><code>&lt;!<key>DOCTYPE</key> html&gt;<br>
<br>
&lt;<key>title</key>&gt;Rabbit Ear&lt;/<key>title</key>&gt;<br>
&lt;<key>meta</key> <v>charset</v>=<str>"UTF-8"</str>&gt;<br>
&lt;<key>link</key> <v>rel</v>=<str>"stylesheet"</str> <v>type</v>=<str>"text/css"</str> <v>href</v>=<str>"style.css"</str>&gt;<br>
<br>
&lt;<key>script</key> <v>type</v>=<str>"text/javascript"</str> <v>src=</v><str>"../../rabbit-ear.js"</str>&gt;&lt;/<key>script</key>&gt;<br>
&lt;<key>script</key> <v>type</v>=<str>"text/javascript"</str> <v>src=</v><str>"sketch.js"</str>&gt;&lt;/<key>script</key>&gt;<br>
</code></pre>
</div>

	<p>Most of your creative energy can be spent inside of <strong>sketch.js</strong></p>

<div class="centered">
<pre><code><f>var</f> origami <key>=</key> <key>new</key> OrigamiPaper();
<br><br><c>// respond to an event. these are optional:</c>
<br><f>origami</f>.<v>onMouseDown</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseUp</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseMove</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>onMouseDidBeginDrag</v> = <f>function</f>(<arg>event</arg>){
<br>}
<br><f>origami</f>.<v>animate</v> = <f>function</f>(<arg>event</arg>){
<br><c>&nbsp;&nbsp;&nbsp;// this will repeat ~60 times/second</c>
<br>}
</code></pre>
</div>

	<p>Open <strong>index.html</strong> you'll see an empty square piece paper. It assumes a square shape. You can change that later.</p>

	<img src="images/empty-paper.svg">

	<p>The origami paper comes from this one line of Javascript:</p>


<div class="centered">
<pre><code><f>var</f> origami <key>=</key> <key>new</key> OrigamiPaper();
</code></pre>
</div>


	<p>Let's fold the paper. To make a crease in Rabbit Ear we <em>add a crease onto the <strong>crease pattern object</strong> </em></p>

</section>

</div>

<div class="container">

<h1>CREASE PATTERN</h1>

<section>

	<p>The crease pattern object keeps track of all the crease lines and their endpoints (among other things). When you add a crease it will either add two endpoints or re-use another line's endpoints if they touch. It's smart like that.

	<div class="centered">
		<pre><code><f>var</f> cp <key>=</key> <key>new</key> CreasePattern();</code></pre>
	</div>

	<p>Let's put a crease into the piece of paper and ask the software to fold it.</p>


	<p>Erase everything inside of sketch.js, and replace it with:</p>

	<div class="centered">
		<pre><code><f>var</f> cp <key>=</key> <key>new</key> CreasePattern();<br>cp.<f>crease</f>(<n>0</n>, <n>0</n>, <n>0.5</n>, <n>1</n>).<f>valley</f>();<br><key>new</key> OrigamiPaper(cp);</code></pre>
	</div>

	<p>This puts a crease in the paper and gives it a valley assignment.</p>

	<p>The last line is the one we've seen before, it creates the origami paper on screen. But this time there's "cp" in parentheses, we're telling it to use our crease pattern.</p>

	<div class="centered">
		<img src="images/one-fold-cp.svg">
	</div>

	<p>In the last line, if you replace "OrigamiPaper" with "OrigamiFold" you get the folded form.</p>

	<div class="centered">
		<pre><code><f>var</f> cp <key>=</key> <key>new</key> CreasePattern();<br>cp.<f>crease</f>(<n>0</n>, <n>0</n>, <n>0.5</n>, <n>1</n>).<f>valley</f>();<br><key>new</key> OrigamiFold(cp);</code></pre>
	</div>

	<div class="centered">
		<img src="images/one-fold-folded.svg">
	</div>

</section>

</div>


<div class="container">

<h1>ORIGAMI PAPER</h1>

<section>

	<p>Try out this sketch:</p>


<div class="centered">
<pre><code><f>var</f> origami <key>=</key> <key>new</key> OrigamiPaper();
<br>
<br><f>origami</f>.<v>onMouseMove</v> = <f>function</f>(<arg>event</arg>){
<br>&nbsp;&nbsp;<arg>this</arg>.cp.<f>clear</f>();
<br>&nbsp;&nbsp;<arg>this</arg>.cp.<f>crease</f>(<n>0</n>, <n>0</n>, event.point.x, event.point.y);
<br>&nbsp;&nbsp;<arg>this</arg>.cp.<f>crease</f>(<n>0</n>, <n>1</n>, event.point.x, event.point.y);
<br>&nbsp;&nbsp;<arg>this</arg>.cp.<f>crease</f>(<n>1</n>, <n>0</n>, event.point.x, event.point.y);
<br>&nbsp;&nbsp;<arg>this</arg>.cp.<f>kawasakiCollapse</f>(event.point);
<br>}</code></pre>
</div>

	<p class="explain">The <strong><arg>this</arg>.cp</strong> is the same as typing <strong>origami.cp</strong> here. <strong><arg>this</arg></strong> can be used interchangeably with <strong>origami</strong> when you're inside an OrigamiPaper function.</p>

	<p>Notice the three crease operations. The creases go from corners of the square to the mouse pointer. Then there is a fourth crease operation:</p>

	<div class="centered">
		<pre><code><arg>this</arg>.cp.<f>kawasakiCollapse</f>(event.point);</code></pre>
	</div>

	<p>This locates a fourth angle which when added to these three satisfies <em>Kawasaki's theorem of flat foldability</em>.</p>

	<div class="centered">
		<div id="kawasaki-collapse-example" resize></div>
	</div>

	<div class="centered">
		<p><em>move the cursor over this paper</em></p>
	</div>

	<p>Rabbit Ear renders these image on the webpage as .svg content, so it's really easy to save your work as an .svg file:</p>

	<div class="column">
		<button type="button" class="btn btn-dark" id="download-example-button">download .svg file</button>
	</div>

	<p>This code we just wrote is called <strong>flat-fold</strong> inside the <strong>examples/</strong> folder. Check out the other examples to get a quick sense about what is possible.</p>

	<div class="centered">
		<div id="div-folded-crane" resize></div>
	</div>

	<div class="centered">
		<pre><code><key>new</key> OrigamiFold().<f>load</f>(<str>"crane.svg"</str>);</code></pre>
	</div>

</section>

</div>


<div class="container">

<h1>DOWNLOAD</h1>

	<div class="column">
		<button class="btn btn-primary" id="download-button"><i class="fa fa-download"></i> rabbit-ear-0.1.zip</button>
	</div>

</div>


<script type="text/javascript" src="js/rabbit-ear.min.js"></script>
<script>
// flat fold example: kawasaki collapse, crease pattern and folded form
var kawasakiPaper = new OrigamiPaper("kawasaki-collapse-example");
kawasakiPaper.onMouseMove = function(event){
	this.cp.clear();
	this.cp.crease(0, 0, event.point.x, event.point.y).mountain();
	this.cp.crease(1, 1, event.point.x, event.point.y).mountain();
	var cornerCrease = this.cp.crease(1, 0, event.point.x, event.point.y);
	var kawasakiCrease = this.cp.kawasakiCollapse(event.point);
	var a = {x:0,y:0};
	var b = {x:1,y:1};
	var cross = (b.x - a.x)*(event.point.y - a.y) > (b.y - a.y)*(event.point.x - a.x);
	// console.log(cross)
	if((b.x - a.x)*(event.point.y - a.y) > (b.y - a.y)*(event.point.x - a.x)){ 
		cornerCrease.valley(); kawasakiCrease.mountain();
	} else{
		kawasakiCrease.valley(); cornerCrease.mountain();
	}
	this.draw();
	kawasakiFolded.cp = this.cp.copy();
	kawasakiFolded.draw();
}
var kawasakiFolded = new OrigamiFold("kawasaki-collapse-example");
kawasakiFolded.holdPoint = {x:0.5, y:0.0001};
kawasakiFolded.rotation = 180;
kawasakiPaper.onMouseMove( {point:{x:0.5,y:0.55}} );

</script>

<script>
// download flat fold example folded form
function download(text, filename){
	var blob = new Blob([text], {type: "image/svg+xml"});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
document.getElementById("download-example-button").onclick = function(event){
	var svg = kawasakiFolded.cp.foldSVG();
	download(svg, "rabbit-ear.js example.svg");
}


</script>

<script>
// folded crane
var craneFold = new OrigamiFold("div-folded-crane").load("../files/svg/crane.svg", function(){
	craneFold.foldedCP.faces_vertices
		.map(function(face){
			return face.map(function(nodeIndex){
				return craneFold.foldedCP.vertices_coords[nodeIndex];
			},this);
		},this)
		.forEach(function(vertices, index){
			var polygon = craneFold.polygon(vertices, 'folded-paper-color', 'face-' + index);
			craneFold.colorLayer.appendChild(polygon);
		},this);
});
craneFold.svg.setAttributeNS(null, 'id', 'folded-crane');
craneFold.colorLayer = craneFold.group(undefined, "color-layer");
craneFold.svg.appendChild(craneFold.colorLayer);
craneFold.svg.appendChild(craneFold.facesLayer);
</script>

<script type="text/javascript">
document.getElementById("download-button").onclick = function(e){
	var zip_file_path = "https://github.com/robbykraft/Origami/releases/download/untagged-1fdecd22aca74a9d72a0/rabbit-ear-0.1.zip";
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
