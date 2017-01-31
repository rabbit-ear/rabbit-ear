<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script language="javascript" type="text/javascript" src="../lib/jquery-3.1.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../lib/jquery-ui.min.js"></script>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../graph.js"></script>
<script language="javascript" type="text/javascript" src="../planarGraph.js"></script>
<script language="javascript" type="text/javascript" src="../render.js"></script>
<script>
	$( function() {
		$( ".accordion" ).accordion({
			active: false,
			collapsible: true
		});
	} );
</script>
<link href="https://fonts.googleapis.com/css?family=Merriweather:400,700" rel="stylesheet">
<link href="style.css" rel="stylesheet" />
</head>
<body>
	<nav>
		<ul>
		<li><a href="introduction.php">Introduction</a></li>
		<li class="dropdown">
			<a href="javascript:void(0)" class="dropbtn">Background</a>
			<div class="dropdown-content">
			<a href="graph.php">Graph</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="javascript:void(0)" class="dropbtn">Crease Lines</a>
			<div class="dropdown-content">
			<a href="addremove.php">Add</a>
			<a href="addremove.php">Remove</a>
			<a href="cleanup.php">Clean</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="javascript:void(0)" class="dropbtn">Intersections</a>
			<div class="dropdown-content">
			<a href="intersections.php">Intersections</a>
			<a href="chop.php">Chop</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="javascript:void(0)" class="dropbtn">Faces</a>
			<div class="dropdown-content">
			<a href="addremove.php">Find Faces</a>
			<a href="#">Neighbors</a>
			<a href="#"></a>
			</div>
		</li>
		<li><a href="#">Complex</a></li>
		</ul>
	</nav>