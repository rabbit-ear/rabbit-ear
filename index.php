<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" type="text/css" href="examples/lib/bootstrap/css/bootstrap.min.css">
<link href="https://fonts.googleapis.com/css?family=Montserrat:300" rel="stylesheet">
<style>
html,body{
	display:flex;
	justify-content: center;
	align-items: center;
	height:100%;
	margin:0;
	background-color: hsl(205.5, 74%, 30%);
	font-family: 'Montserrat';
}
.main{
	padding: 4.5em 0 3em 0;
	background: #ffffff;
	border-radius: 4px;
	cursor: default;
	max-width: 100%;
	opacity: 0.95;
	position: relative;
	text-align: center;
	width: 27em;
}
.circle{
	position: fixed;
	width:100vmin;
	height:100vmin;
	border-radius:50vmin;
	/*z-index: -1;*/
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
}
canvas[resize]{
	width:200px;
	height:200px;
}
.text{ 
	text-align: left;
	margin: 1.5em 3em;
}
p{ margin:0.25em 0; }
.mission{
	text-align:center;
	font-style: italic;
	font-weight: bold;
}
</style>
</head>
<body>
<div class="circle red-circle"></div>
<div class="circle yellow-circle"></div>
<div class="main">
	<canvas id="canvas" resize></canvas>
	<div class="text">
		<p>Hello friend,<br>This is Rabbit Ear, a creative coding library for designing origami.</p>
<!-- 		<p class="mission">with a grand mission:</p>
		<p>☞ to introduce newcomers to origami, ☞ make students into teachers, ☞ and infiltrate math education.</p> -->
	</div>
	<div class="footer">
		<button type="button" class="btn btn-outline-dark" id="download-button">download</button>
		<button type="button" class="btn btn-outline-dark" id="docs-button">information</button>
		<button type="button" class="btn btn-outline-dark" id="showcase-button">showcase</button>
	</div>
</div>
<script type="text/javascript" src="lib/paper-full.min.js"></script>
<script type="text/javascript" src="dist/cp.js"></script>
<script type="text/javascript" src="dist/cp.paperjs.js"></script>
<script type="text/javascript" src="lib/d3.min.js"></script>
<script type="text/javascript" src="lib/perlin.js"></script>
<!-- <script type="text/javascript" src="tests/two_colorable.js"></script> -->
<script>
document.getElementById("download-button").onclick = function(){
	var zip_file_path = "rabbit-ear.zip";
	var zip_file_name = "rabbit-ear.zip";
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	a.href = zip_file_path;
	a.download = zip_file_name;
	a.click();
	document.body.removeChild(a);
	window.location.href = "docs/introduction.php"
}
document.getElementById("docs-button").onclick = function(){
	window.location.href = "docs/"
}
document.getElementById("showcase-button").onclick = function(){
	window.location.href = "https://origami.tools"
}
</script>
<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script>
var filenames = [
	"two_colorable.js",
	"face_tree.js",
	// "faces_animate.js",
	// "fragment.js",
	"minimum_path.js",
	"interior_angles.js",
	"twist_triangle.js",
	"voronoi.js"
];
var scriptName = filenames[ parseInt(Math.random()*filenames.length) ];
$.getScript("tests/" + scriptName, function(arg){});
</script>
</body>
</html>