export namespace foldKeys {
    let file: string[];
    let frame: string[];
    let graph: string[];
    let orders: string[];
}
/**
 * @description All "file_classes" values according to the FOLD spec
 */
export const foldFileClasses: string[];
/**
 * @description All "frame_classes" values according to the FOLD spec
 */
export const foldFrameClasses: string[];
/**
 * @description All "frame_attributes" values according to the FOLD spec
 */
export const foldFrameAttributes: string[];
/**
 * @description Names of graph components
 * @constant {string[]}
 */
export const VEF: string[];
/**
 * @description All possible valid edge assignment characters
 * @constant {string[]}
 */
export const edgesAssignmentValues: string[];
export namespace edgesAssignmentNames {
    let B: string;
    let M: string;
    let V: string;
    let F: string;
    let J: string;
    let C: string;
    let U: string;
}
export namespace assignmentFlatFoldAngle {
    let B_1: number;
    export { B_1 as B };
    export let b: number;
    let M_1: number;
    export { M_1 as M };
    export let m: number;
    let V_1: number;
    export { V_1 as V };
    export let v: number;
    let F_1: number;
    export { F_1 as F };
    export let f: number;
    let J_1: number;
    export { J_1 as J };
    export let j: number;
    let C_1: number;
    export { C_1 as C };
    export let c: number;
    let U_1: number;
    export { U_1 as U };
    export let u: number;
}
export namespace assignmentCanBeFolded {
    let B_2: boolean;
    export { B_2 as B };
    let b_1: boolean;
    export { b_1 as b };
    let M_2: boolean;
    export { M_2 as M };
    let m_1: boolean;
    export { m_1 as m };
    let V_2: boolean;
    export { V_2 as V };
    let v_1: boolean;
    export { v_1 as v };
    let F_2: boolean;
    export { F_2 as F };
    let f_1: boolean;
    export { f_1 as f };
    let J_2: boolean;
    export { J_2 as J };
    let j_1: boolean;
    export { j_1 as j };
    let C_2: boolean;
    export { C_2 as C };
    let c_1: boolean;
    export { c_1 as c };
    let U_2: boolean;
    export { U_2 as U };
    let u_1: boolean;
    export { u_1 as u };
}
export namespace assignmentIsBoundary {
    let B_3: boolean;
    export { B_3 as B };
    let b_2: boolean;
    export { b_2 as b };
    let M_3: boolean;
    export { M_3 as M };
    let m_2: boolean;
    export { m_2 as m };
    let V_3: boolean;
    export { V_3 as V };
    let v_2: boolean;
    export { v_2 as v };
    let F_3: boolean;
    export { F_3 as F };
    let f_2: boolean;
    export { f_2 as f };
    let J_3: boolean;
    export { J_3 as J };
    let j_2: boolean;
    export { j_2 as j };
    let C_3: boolean;
    export { C_3 as C };
    let c_2: boolean;
    export { c_2 as c };
    let U_3: boolean;
    export { U_3 as U };
    let u_2: boolean;
    export { u_2 as u };
}
export function edgeAssignmentToFoldAngle(assignment: string): number;
export function edgeFoldAngleToAssignment(angle: number): string;
export function edgeFoldAngleIsFlatFolded(angle: number): boolean;
export function edgeFoldAngleIsFlat(angle: number): boolean;
export function edgesFoldAngleAreAllFlat({ edges_foldAngle }: FOLD): boolean;
export function filterKeysWithPrefix(obj: FOLD, prefix: string): string[];
export function filterKeysWithSuffix(obj: FOLD, suffix: string): string[];
export function getAllPrefixes(obj: FOLD): string[];
export function getAllSuffixes(obj: FOLD): string[];
export function transposeGraphArrays(graph: FOLD, geometry_key: string): object[];
export function transposeGraphArrayAtIndex(graph: FOLD, geometry_key: string, index: number): object;
export function isFoldObject(object?: FOLD): number;
export function getDimension({ vertices_coords }: FOLD, epsilon?: number): number;
export function getDimensionQuick({ vertices_coords }: FOLD): number | undefined;
export function isFoldedForm({ vertices_coords, edges_vertices, faces_vertices, faces_edges, frame_classes, file_classes, }: FOLD, epsilon?: number): boolean;
export function makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment }: FOLD): boolean[];
export function invertAssignment(assign: string): string;
export function invertAssignments(graph: FOLD): FOLD;
export function sortEdgesByAssignment({ edges_vertices, edges_assignment }: FOLD): {
    B?: number[];
    V?: number[];
    M?: number[];
    F?: number[];
    J?: number[];
    C?: number[];
    U?: number[];
};
export function getFileMetadata(FOLD?: FOLD): {
    file_spec?: number;
    file_creator?: string;
    file_author?: string;
    file_title?: string;
    file_description?: string;
    file_classes?: string[];
};
//# sourceMappingURL=spec.d.ts.map