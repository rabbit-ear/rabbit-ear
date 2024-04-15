export { rectDef as default };
declare namespace rectDef {
    namespace rect {
        function args(a: any, b: any, c: any, d: any): any;
        let methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            origin: (el: any, a: any, b: any) => any;
            setOrigin: (el: any, a: any, b: any) => any;
            center: (el: any, a: any, b: any) => any;
            setCenter: (el: any, a: any, b: any) => any;
            size: (el: any, rx: any, ry: any) => any;
            setSize: (el: any, rx: any, ry: any) => any;
        };
    }
}
