
const CleanPrototype = function () {
  const proto = Object.create(null);
  const join = function (report) {
    if (report == null) { return this; }
    this.nodes.total += report.nodes.total;
    this.edges.total += report.edges.total;
    this.nodes.isolated += report.nodes.isolated;
    this.edges.duplicate += report.edges.duplicate;
    this.edges.circular += report.edges.circular;
    return this;
  };
  const isolatedNodes = function (num) {
    this.nodes.isolated = num;
    this.nodes.total += num;
    return this;
  };
  const duplicateEdges = function (num) {
    this.edges.duplicate = num;
    this.edges.total += num;
    return this;
  };
  const circularEdges = function (num) {
    this.edges.circular = num;
    this.edges.total += num;
    return this;
  };
  Object.defineProperty(proto, "join", { value: join });
  Object.defineProperty(proto, "isolatedNodes", { value: isolatedNodes });
  Object.defineProperty(proto, "duplicateEdges", { value: duplicateEdges });
  Object.defineProperty(proto, "circularEdges", { value: circularEdges });
  return Object.freeze(proto);
};

/** A survey of the properties removed from a graph after an operation */
const GraphClean = function (numNodes, numEdges) {
  // "total" must be greater than or equal to the other members of each object
  // "total" can include removed edges/nodes which don't count
  //   as "duplicate" or "circular"
  const clean = Object.create(CleanPrototype());
  clean.nodes = { total: 0, isolated: 0 };
  clean.edges = { total: 0, duplicate: 0, circular: 0 };
  if (numNodes != null) { clean.nodes.total = numNodes; }
  if (numEdges != null) { clean.edges.total = numEdges; }
  return clean;
};

export default GraphClean;


/** A survey of the objects removed from a planar graph after a function is performed */
// export class PlanarClean extends GraphClean {
//   // edges;
//   // nodes;
//   //   isolated;// nodes removed for being unattached to any edge
//   //   fragment;  // nodes added at intersection of 2 lines, from fragment()
//   //   collinear; // nodes removed due to being collinear
//   //   duplicate; // nodes removed due to occupying the same space
//   constructor(numNodes, numEdges){
//     super(numNodes, numEdges);
//     this.edges = { total: 0, duplicate: 0, circular: 0 };
//     this.nodes = {
//       total:0,
//       isolated:0,
//       fragment:[],
//       collinear:[],
//       duplicate:[]
//     }
//     if(numNodes != undefined){ this.nodes.total += numNodes; }
//     if(numEdges != undefined){ this.edges.total += numEdges; }
//   }
//   fragmentedNodes(nodes){
//     this.nodes.fragment = nodes; this.nodes.total += nodes.length; return this;
//   }
//   collinearNodes(nodes){
//     this.nodes.collinear = nodes; this.nodes.total += nodes.length; return this;
//   }
//   duplicateNodes(nodes){
//     this.nodes.duplicate = nodes; this.nodes.total += nodes.length; return this;
//   }
//   join(report){
//     this.nodes.total += report.nodes.total;
//     this.edges.total += report.edges.total;
//     this.nodes.isolated += report.nodes.isolated;
//     this.edges.duplicate += report.edges.duplicate;
//     this.edges.circular += report.edges.circular;
//     // if we are merging 2 planar clean reports, type cast this variable and check properties
//     var planarReport = report;
//     if(planarReport.nodes.fragment != undefined){ 
//       this.nodes.fragment = this.nodes.fragment.concat(planarReport.nodes.fragment); 
//     }
//     if(planarReport.nodes.collinear != undefined){ 
//       this.nodes.collinear = this.nodes.collinear.concat(planarReport.nodes.collinear);
//     }
//     if(planarReport.nodes.duplicate != undefined){ 
//       this.nodes.duplicate = this.nodes.duplicate.concat(planarReport.nodes.duplicate);
//     }
//     return this;
//   }
// }
