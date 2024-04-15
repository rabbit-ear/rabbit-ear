export function splitCircularArray(array: any[], indices: number[]): any[][];
export function splitArrayWithLeaf(array: any[], spliceIndex: number, newElement: any): any[];
export function getAdjacencySpliceIndex(cycle: any, adjacent: any, vertex: any): any;
export function makeVerticesToEdgeLookup({ edges_vertices }: {
    edges_vertices: any;
}, edges: any): {};
export function makeVerticesToFacesLookup({ faces_vertices }: FOLD, faces: number[]): number[][];
export function makeEdgesFacesSubarray({ faces_edges }: {
    faces_edges: any;
}, faces: any): any[];
