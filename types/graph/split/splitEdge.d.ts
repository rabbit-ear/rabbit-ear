export function splitEdge(graph: FOLD, oldEdge: number, coords?: number[]): {
    vertex: number;
    edges: {
        map: (number | number[])[];
        add: [number, number];
        remove: number;
    };
};
