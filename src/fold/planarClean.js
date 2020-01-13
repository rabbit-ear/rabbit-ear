import clean from "./clean";
import remove from "./remove";
import * as Collinear from "./collinear";
import * as Isolated from "./isolated";

const planarClean = function (graph) {
  clean(graph);
  if (Collinear.remove_all_collinear_vertices(graph)) {
    clean(graph);
  }
  remove(graph, "vertices", Isolated.find_isolated_vertices(graph));
};

export default planarClean;
