export { textDef as default };
declare namespace textDef {
    namespace text {
        function args(a: any, b: any, c: any): any[];
        function init(parent: any, a: any, b: any, c: any, d: any): any;
        let methods: {
            appendTo: (element: any, parent: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
        };
    }
}
