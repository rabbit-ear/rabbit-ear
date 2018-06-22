<!DOCTYPE html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-121244028-1"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','UA-121244028-1');
</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" type="text/css" href="examples/lib/bootstrap/css/bootstrap.min.css">
<link href="https://fonts.googleapis.com/css?family=Montserrat:600" rel="stylesheet">
<style>
/*html,body{
	display:flex;
	justify-content: center;
	align-items: center;
	height:100%;
	margin:0;
	background-color: hsl(205.5, 74%, 30%);
	font-family: 'Montserrat';
}
.row{
	z-index:2;
	text-align: center;
	display:inline-block;
	width:100%;
}
canvas[resize]{
	width:40vmax;
	height:40vmax;
	display:inline-block;
}
*/
html, body {
	height:100%;
	width:100%;
	margin:0px;
	background-color: #FFF;
	display:flex;
	align-items: center;
	justify-content: center;
	background-color: hsl(205, 74%, 30%);
	font-family: 'Montserrat';
}
.row{ text-align: center; }
canvas[resize]{
	width:40vmax;
	height:40vmax;
	/*margin:2vmax;*/
	margin:auto;
}

.text{ 
	z-index:3;
	position: fixed;
	top:15px;
	left:15px;
	text-align: left;
	margin: 1.5em 3em;
}
p{
	font-size: 1.666em;
	padding:.25em;
	color: white;
	background-color: hsla(43, 88%, 46%, 0.9);
	/*background-color: hsl(14.4, 87%, 45%);*/
}
p a, p a:hover, p a:visited, p a:active{
	color:white;
	text-decoration: none;
	cursor: help;
	border-bottom: 3px dashed white;
	display: inline;
}
.footer{
	position: fixed;
	right:15px;
	bottom:15px;
}
.btn-outline-light:hover {
	color: black;
}
/*.circle{
	position: fixed;
	width:100vmin;
	height:100vmin;
	border-radius:50vmin;
	z-index: 1;
}
.red-circle{
	bottom:0;
	left:0;
	margin-left: -50vmin;
	margin-bottom: -50vmin;
	background-color: hsl(14.4, 87%, 45%);
}
.yellow-circle{
	top:0;
	right:0;
	margin-right: -50vmin;
	margin-top: -50vmin;
	background-color: hsl(43.2, 88%, 46%);
}*/

</style>
</head>
<body>
<!-- <div class="circle red-circle"></div>
<div class="circle yellow-circle"></div>
 -->
<div class="row">
	<canvas id="canvas-1" resize></canvas><canvas id="canvas-2" resize></canvas>
</div>

<div class="text">
	<p><a href="https://www.origami-resource-center.com/rabbit-ear-fold.html">Rabbit Ear</a> is a creative coding javascript library for designing origami.</p>
</div>

<div class="footer">
	<button type="button" class="btn btn-outline-light" id="showcase-button">demo</button>
	<button type="button" class="btn btn-outline-light" id="download-button">download</button>
	<button type="button" class="btn btn-outline-light" id="docs-button">documentation</button>
</div>

<script type="text/javascript" src="lib/paper-full.min.js"></script>
<script type="text/javascript" src="dist/cp.js"></script>
<script type="text/javascript" src="dist/cp.paperjs.js"></script>
<script type="text/javascript" src="lib/d3.min.js"></script>
<script type="text/javascript" src="lib/perlin.js"></script>
<!-- <script type="text/javascript" src="tests/two_colorable.js"></script> -->
<script>
document.getElementById("download-button").onclick = function(){
	// var zip_file_path = "rabbit-ear.zip";
	// var zip_file_name = "rabbit-ear.zip";
	// var a = document.createElement("a");
	// document.body.appendChild(a);
	// a.style = "display: none";
	// a.href = zip_file_path;
	// a.download = zip_file_name;
	// a.click();
	// document.body.removeChild(a);
	// window.location.href = "docs/introduction.php"
}
document.getElementById("docs-button").onclick = function(){
	window.location.href = "docs/"
}
document.getElementById("showcase-button").onclick = function(){
	// window.location.href = "showcase.php"
}
</script>
<script>
var folded = new OrigamiFold("canvas-2");
var origami = new OrigamiPaper("canvas-1");
folded.style = { face:{ fillColor:{ gray:0.0, alpha:0.2 } } };
folded.mouseZoom = false;
folded.rotation = 180;
folded.style.face.fillColor = {gray:1.0, alpha:0.5};

function updateFoldedState(cp){
	folded.cp = cp.copy();
	var topFace = folded.cp.nearest(0.5, 0.002).face;
	folded.draw( topFace );
	// folded.draw();
}

origami.onMouseMove = function(event){
	if(this.mouse.isPressed){
		this.centerNode.x = event.point.x;
		this.centerNode.y = event.point.y;
		var junction = this.centerNode.junction();
		var dir = junction.sectors[2].kawasakiCollapse();
		this.cp = this.template.copy();
		this.cp.crease( dir ).mountain();
		this.cp.clean();
		updateFoldedState(this.cp);
		this.draw();
	}
}

origami.reset = function(){
	this.template = new CreasePattern();
	this.centerpoint = [0.5, 0.48]
	this.endpoints = [
		[0,0],
		[0,1],
		[1,0]
	]
	var creases = this.endpoints.map(function(el){
		return this.template.crease(this.centerpoint[0], this.centerpoint[1], el[0], el[1]);
	},this).filter(function(el){ return el !== undefined; })
		.forEach(function(crease){crease.valley();},this);
	this.template.clean();
	var valleyCreases = this.template.edges.filter(function(el){return el.orientation==CreaseDirection.valley;});
	this.centerNode = valleyCreases[0].commonNodeWithEdge(valleyCreases[1]);
	this.cp = this.template.copy();
	this.cp.crease(this.centerpoint[0], this.centerpoint[1], 1, 1).mountain();
	updateFoldedState(this.cp);
	this.draw();
}
origami.reset();

</script>
</body>
</html>