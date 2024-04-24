export { pathDef as default };
declare namespace pathDef {
    namespace path {
        export { path_methods as methods };
    }
}
declare const path_methods: {
    appendTo: (element: any, parent: any) => any;
    removeChildren: (element: any) => any;
    setAttributes: (element: any, attrs: any) => any;
    clearTransform: (el: any) => any;
    addCommand: (el: any, command: any, ...args: any[]) => any;
    appendCommand: (el: any, command: any, ...args: any[]) => any;
    clear: (element: any) => any;
    getCommands: (element: any) => {
        command: string;
        values: number[];
    }[];
    get: (element: any) => {
        command: string;
        values: number[];
    }[];
    getD: (el: any) => any;
};
//# sourceMappingURL=path.d.ts.map