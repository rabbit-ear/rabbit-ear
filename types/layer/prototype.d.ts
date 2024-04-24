export function getBranchStructure({ branches }: LayerSolverSolution): any;
export function gather({ orders, branches }: LayerSolverSolution, pattern?: number[]): any;
export function compile({ orders, branches }: LayerSolverSolution, pattern?: number[]): any;
export function gatherAll({ orders, branches }: LayerSolverSolution): {
    [key: string]: number;
}[][];
export function compileAll({ orders, branches }: LayerSolverSolution): {
    [key: string]: number;
}[][];
export namespace LayerPrototype {
    function count(this: LayerFork): any;
    function structure(this: LayerFork): any;
    function leaves(this: LayerFork): any;
    function gather(this: LayerFork, ...pattern: number[]): any;
    function gatherAll(this: LayerFork): {
        [key: string]: number;
    }[][];
    function compile(this: LayerFork, ...pattern: number[]): any;
    function compileAll(this: LayerFork): {
        [key: string]: number;
    }[][];
    function faceOrders(this: LayerFork, ...pattern: number[]): any;
}
//# sourceMappingURL=prototype.d.ts.map