export function transferPoint(from: FOLD, to: FOLD, { vertex, edge, face, point, b }: object): number[];
export function foldGraphIntoSubgraph(cp: FOLD, folded: FOLD, line: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], assignment?: string, foldAngle?: number, epsilon?: number): {
    vertices_coords: number[][];
    edges_vertices: number[][];
    edges_assignment: string[];
    edges_foldAngle: number[];
};
//# sourceMappingURL=foldGraphIntoSubgraph.d.ts.map