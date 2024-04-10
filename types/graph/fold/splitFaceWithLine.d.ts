export function intersectConvexFaceLine({ vertices_coords, edges_vertices, faces_vertices, faces_edges, }: FOLD, face: number, { vector, origin }: number[], epsilon?: number): object | undefined;
export function update_vertices_vertices({ vertices_coords, vertices_vertices, edges_vertices, }: object, edge: any): void;
export function update_vertices_edges({ edges_vertices, vertices_edges, vertices_vertices, }: {
    edges_vertices: any;
    vertices_edges: any;
    vertices_vertices: any;
}, edge: any): void;
export function update_vertices_faces(graph: any, old_face: any, new_faces: any): void;
export function update_edges_faces(graph: any, old_face: any, new_edge: any, new_faces: any): void;
export function update_faces_faces({ faces_vertices, faces_faces }: {
    faces_vertices: any;
    faces_faces: any;
}, old_face: any, new_faces: any): void;
export function splitFaceWithLine(graph: FOLD, face: number, line: VecLine, epsilon?: number): object | undefined;
