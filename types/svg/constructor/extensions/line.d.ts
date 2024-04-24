export { lineDef as default };
declare namespace lineDef {
    namespace line {
        export { Args as args };
        export let methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            setPoints: (element: any, ...args: any[]) => any;
        };
    }
}
/**
 * Rabbit Ear (c) Kraft
 */
declare function Args(...args: any[]): any[];
//# sourceMappingURL=line.d.ts.map