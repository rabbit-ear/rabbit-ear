<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script language="javascript" type="text/javascript" src="../lib/jquery-3.1.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../lib/jquery-ui.min.js"></script>
<script language="javascript" type="text/javascript" src="../lib/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="../src/graph.js"></script>
<script language="javascript" type="text/javascript" src="../src/planarGraph.js"></script>
<script language="javascript" type="text/javascript" src="../src/creasePattern.js"></script>
<script language="javascript" type="text/javascript" src="../render.js"></script>
<script>
	$( function() {
		$( ".accordion" ).accordion({
			active: false,
			collapsible: true
		});
	} );
</script>
<!-- <link href="https://fonts.googleapis.com/css?family=Merriweather:400,700" rel="stylesheet"> -->
<link href="../dist/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
<link href="style.css" rel="stylesheet" />
</head>
<body>
	<nav>
		<ul>
		<li><a href="../editor/" class="link-fa"><i class="fa fa-pencil-square-o fa-2x"></i></a></li>
		<li><a href="index.php">Introduction</a></li>
		<li class="dropdown">
			<a href="graph.php" class="dropbtn">Graph</a>
			<div class="dropdown-content">
			<a href="graph.php">Introduction</a>
			<a href="graph.php">Add / Remove</a>
			<a href="graph.php">Functions</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="javascript:void(0)" class="dropbtn">Planar Graph</a>
			<div class="dropdown-content">
			<a href="addremove.php">Add</a>
			<a href="addremove">Remove</a>
			<a href="cleanup.php">Clean</a>
			<a href="intersections.php">Intersections</a>
			<a href="chop.php">Chop</a>
			<a href="faces.php">Find Faces</a>
			<a href="select.php">Neighbors</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="javascript:void(0)" class="dropbtn">Crease Pattern</a>
			<div class="dropdown-content">
			</div>
		</li>
		</ul>
	</nav>