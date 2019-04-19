// HTML element we want to attach to
var div = document.getElementsByClassName("row")[0];

// var origami = new RabbitEar.FoldView(div).setPadding(0.1).load("../../files/fold/one-valley.fold");

// uhhh let's skip having to run a server to load a file
var foldFile = {"file_spec":1.1,"file_creator":"Rabbit Ear","file_author":"Robby Kraft","file_classes":["singleModel"],"frame_attributes":["2D"],"frame_title":"one valley crease","frame_classes":["foldedForm"],"vertices_coords":[[0.62607055447,1.172217339808],[1.182184366474,0.341111192497],[1,1],[0,1],[1,0.21920709774914016],[0,0.7532979469531602]],"vertices_vertices":[[1,3],[4,0],[3,4],[0,2],[2,5,1],[0,4,3]],"vertices_faces":[[0],[0],[1],[1],[1,0],[0,1]],"edges_vertices":[[0,1],[1,4],[4,5],[5,0],[4,2],[2,3],[3,5]],"edges_faces":[[0],[0],[1,0],[0],[1],[1],[1]],"edges_assignment":["B","B","V","B","B","B","B"],"edges_foldAngle":[0,0,180,0,0,0,0],"faces_vertices":[[0,1,4,5],[2,3,5,4]],"faces_edges":[[0,1,2,3],[5,6,2,4]],"faces_layer":[0,1],"faces_matrix":[[0.5561138120038558,-0.8311061473112445,-0.8311061473112445,-0.5561138120038558,0.6260705544697115,1.172217339807961],[1,0,0,1,0,0]],"file_frames":[{"frame_classes":["creasePattern"],"parent":0,"inherit":true,"vertices_coords":[[0,0],[1,0],[1,1],[0,1],[1,0.21920709774914016],[0,0.7532979469531602]],"edges_foldAngle":[0,0,0,0,0,0,0],"faces_layer":[0,1],"faces_matrix":[[1,0,0,1,0,0],[1,0,0,1,0,0]]}]
}

var origami = new RabbitEar.FoldView(div, foldFile).setPadding(0.1);
