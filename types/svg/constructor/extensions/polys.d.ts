export { polyDefs as default };
declare namespace polyDefs {
    namespace polyline {
        export { Args as args };
        export let methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            setPoints: (element: any, ...args: any[]) => any;
            addPoint: (element: any, ...args: any[]) => any;
        };
    }
    namespace polygon {
        export { Args as args };
        let methods_1: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            setPoints: (element: any, ...args: any[]) => any;
            addPoint: (element: any, ...args: any[]) => any;
        };
        export { methods_1 as methods };
    }
}
declare function Args(...args: any[]): any[];
