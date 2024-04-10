export function getBranchStructure({ branches }: {
    branches: any;
}): any;
export function gather({ orders, branches }: {
    orders: any;
    branches: any;
}, pattern?: any[]): any[];
export function compile({ orders, branches }: {
    orders: any;
    branches: any;
}, pattern: any): any[];
export function gatherAll({ orders, branches }: {
    orders: {
        [key: string]: number;
    };
    branches?: LayerBranch[];
}): {
    [key: string]: number;
}[][];
export function compileAll({ orders, branches }: {
    orders: any;
    branches: any;
}): {
    [key: string]: number;
}[][];
export namespace LayerPrototype {
    function count(): any;
    function structure(): any;
    function leaves(): any;
    function gather(...pattern: any[]): any;
    function gatherAll(): any;
    function compile(...pattern: any[]): any;
    function compileAll(): any;
    function faceOrders(...pattern: any[]): any;
}
