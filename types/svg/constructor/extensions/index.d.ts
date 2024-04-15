export { extensions as default };
/**
 * Rabbit Ear (c) Kraft
 */
/**
 * in each of these instances, arguments maps the arguments to attributes
 * as the attributes are listed in the "attributes" folder.
 *
 * arguments: function. this should convert the array of arguments into
 * an array of (processed) arguments. 1:1. arguments into arguments.
 * make sure it is returning an array.
 *
 */
declare const extensions: {
    origami: {
        nodeName: string;
        init: (graph: any, ...args: any[]) => any;
        args: () => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
        };
    };
    wedge: {
        nodeName: string;
        args: (a: any, b: any, c: any, d: any, e: any) => string[];
        attributes: string[];
        methods: {
            clearTransform: (el: any) => any;
            setArc: (el: any, ...args: any[]) => any;
        };
    };
    curve: {
        nodeName: string;
        attributes: string[];
        args: (...args: any[]) => string[];
        methods: {
            clearTransform: (el: any) => any;
            setPoints: (element: any, ...args: any[]) => any;
            bend: (element: any, amount: any) => any;
            pinch: (element: any, amount: any) => any;
        };
    };
    arrow: {
        nodeName: string;
        attributes: any[];
        args: () => any[];
        methods: {
            clearTransform: (el: any) => any;
            setPoints: (element: any, ...args: any[]) => any;
            points: (element: any, ...args: any[]) => any;
            bend: (element: any, amount: any) => any;
            pinch: (element: any, amount: any) => any;
            padding: (element: any, amount: any) => any;
            head: (element: any, options: any) => any;
            tail: (element: any, options: any) => any;
            getLine: (element: any) => any;
            getHead: (element: any) => any;
            getTail: (element: any) => any;
        };
        init: (...args: any[]) => any;
    };
    arc: {
        nodeName: string;
        attributes: string[];
        args: (a: any, b: any, c: any, d: any, e: any) => string[];
        methods: {
            clearTransform: (el: any) => any;
            setArc: (el: any, ...args: any[]) => any;
        };
    };
    polyline: {
        args: (...args: any[]) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            setPoints: (element: any, ...args: any[]) => any;
            addPoint: (element: any, ...args: any[]) => any;
        };
    };
    polygon: {
        args: (...args: any[]) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            setPoints: (element: any, ...args: any[]) => any;
            addPoint: (element: any, ...args: any[]) => any;
        };
    };
    mask: {
        args: (...args: any[]) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
        };
    };
    clipPath: {
        args: (...args: any[]) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
        };
    };
    symbol: {
        args: (...args: any[]) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
        };
    };
    marker: {
        args: (...args: any[]) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            size: (element: any, ...args: any[]) => any;
            setViewBox: (element: any, ...args: any[]) => any;
        };
    };
    text: {
        args: (a: any, b: any, c: any) => any[];
        init: (a: any, b: any, c: any, d: any) => any;
        methods: {
            appendTo: (element: any, parent: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
        };
    };
    style: {
        init: (text: any) => any;
        methods: {
            setTextContent: (el: any, text: any) => any;
        };
    };
    rect: {
        args: (a: any, b: any, c: any, d: any) => any;
        methods: {
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
    };
    path: {
        methods: {
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
    };
    line: {
        args: (...args: any[]) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            setPoints: (element: any, ...args: any[]) => any;
        };
    };
    ellipse: {
        args: (a: any, b: any, c: any, d: any) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            radius: (el: any, rx: any, ry: any) => any;
            setRadius: (el: any, rx: any, ry: any) => any;
            origin: (el: any, a: any, b: any) => any;
            setOrigin: (el: any, a: any, b: any) => any;
            center: (el: any, a: any, b: any) => any;
            setCenter: (el: any, a: any, b: any) => any;
            position: (el: any, a: any, b: any) => any;
            setPosition: (el: any, a: any, b: any) => any;
        };
    };
    circle: {
        args: (a: any, b: any, c: any, d: any) => any[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            radius: (el: any, r: any) => any;
            setRadius: (el: any, r: any) => any;
            origin: (el: any, a: any, b: any) => any;
            setOrigin: (el: any, a: any, b: any) => any;
            center: (el: any, a: any, b: any) => any;
            setCenter: (el: any, a: any, b: any) => any;
            position: (el: any, a: any, b: any) => any;
            setPosition: (el: any, a: any, b: any) => any;
        };
    };
    g: {
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
        };
    };
    svg: {
        args: (...args: any[]) => string[];
        methods: {
            appendTo: (element: any, parent: any) => any;
            removeChildren: (element: any) => any;
            setAttributes: (element: any, attrs: any) => any;
            clearTransform: (el: any) => any;
            clear: (element: any) => any;
            size: (element: any, ...args: any[]) => any;
            setViewBox: (element: any, ...args: any[]) => any;
            getViewBox: (element: any) => any;
            padding: (element: any, padding: any) => any;
            background: (element: any, color: any) => any;
            getWidth: (el: any) => any;
            getHeight: (el: any) => any;
            stylesheet: (el: any, text: any) => any;
        };
        init: (...args: any[]) => any;
    };
};
