export { SVG as default };
declare const SVG: ((...args: any[]) => SVGElement) & {
    window: any;
    svg: (...args: any[]) => SVGElement;
    defs: (...args: any[]) => SVGElement;
    desc: (...args: any[]) => SVGElement;
    filter: (...args: any[]) => SVGElement;
    metadata: (...args: any[]) => SVGElement;
    style: (...args: any[]) => SVGElement;
    script: (...args: any[]) => SVGElement;
    title: (...args: any[]) => SVGElement;
    view: (...args: any[]) => SVGElement;
    cdata: (...args: any[]) => SVGElement;
    g: (...args: any[]) => SVGElement;
    circle: (...args: any[]) => SVGElement;
    ellipse: (...args: any[]) => SVGElement;
    line: (...args: any[]) => SVGElement;
    path: (...args: any[]) => SVGElement;
    polygon: (...args: any[]) => SVGElement;
    polyline: (...args: any[]) => SVGElement;
    rect: (...args: any[]) => SVGElement;
    arc: (...args: any[]) => SVGElement;
    arrow: (...args: any[]) => SVGElement;
    curve: (...args: any[]) => SVGElement;
    parabola: (...args: any[]) => SVGElement;
    roundRect: (...args: any[]) => SVGElement;
    wedge: (...args: any[]) => SVGElement;
    origami: (...args: any[]) => SVGElement;
    text: (...args: any[]) => SVGElement;
    marker: (...args: any[]) => SVGElement;
    symbol: (...args: any[]) => SVGElement;
    clipPath: (...args: any[]) => SVGElement;
    mask: (...args: any[]) => SVGElement;
    linearGradient: (...args: any[]) => SVGElement;
    radialGradient: (...args: any[]) => SVGElement;
    pattern: (...args: any[]) => SVGElement;
    textPath: (...args: any[]) => SVGElement;
    tspan: (...args: any[]) => SVGElement;
    stop: (...args: any[]) => SVGElement;
    feBlend: (...args: any[]) => SVGElement;
    feColorMatrix: (...args: any[]) => SVGElement;
    feComponentTransfer: (...args: any[]) => SVGElement;
    feComposite: (...args: any[]) => SVGElement;
    feConvolveMatrix: (...args: any[]) => SVGElement;
    feDiffuseLighting: (...args: any[]) => SVGElement;
    feDisplacementMap: (...args: any[]) => SVGElement;
    feDistantLight: (...args: any[]) => SVGElement;
    feDropShadow: (...args: any[]) => SVGElement;
    feFlood: (...args: any[]) => SVGElement;
    feFuncA: (...args: any[]) => SVGElement;
    feFuncB: (...args: any[]) => SVGElement;
    feFuncG: (...args: any[]) => SVGElement;
    feFuncR: (...args: any[]) => SVGElement;
    feGaussianBlur: (...args: any[]) => SVGElement;
    feImage: (...args: any[]) => SVGElement;
    feMerge: (...args: any[]) => SVGElement;
    feMergeNode: (...args: any[]) => SVGElement;
    feMorphology: (...args: any[]) => SVGElement;
    feOffset: (...args: any[]) => SVGElement;
    fePointLight: (...args: any[]) => SVGElement;
    feSpecularLighting: (...args: any[]) => SVGElement;
    feSpotLight: (...args: any[]) => SVGElement;
    feTile: (...args: any[]) => SVGElement;
    feTurbulence: (...args: any[]) => SVGElement;
    convertToViewBox: (svg: any, x: any, y: any) => any[];
    foldToViewBox: ({ vertices_coords }: {
        vertices_coords: any;
    }) => string;
    getViewBox: (element: any) => any;
    setViewBox: (element: any, ...args: any[]) => any;
    parseTransform: (transform: string) => {
        transform: string;
        parameters: number[];
    }[];
    transformStringToMatrix: (string: any) => any;
    parsePathCommands: (d: string) => {
        command: string;
        values: number[];
    }[];
    parsePathCommandsWithEndpoints: (d: any) => {
        end: any;
        start: any;
        command: string;
        values: number[];
    }[];
    pathCommandNames: {
        m: string;
        l: string;
        v: string;
        h: string;
        a: string;
        c: string;
        s: string;
        q: string;
        t: string;
        z: string;
    };
    makeCDATASection: (text: string) => CDATASection;
    addClass: (el: Element, ...classes: string[]) => void;
    findElementTypeInParents: (element: Element, nodeName: string) => Element;
    flattenDomTree: (el: Element | ChildNode) => (Element | ChildNode)[];
    flattenDomTreeWithStyle: (element: Element | ChildNode, attributes?: any) => {
        element: Element | ChildNode;
        attributes: {
            [key: string]: string;
        };
    }[];
    getRootParent: (el: Element) => Element;
    xmlStringToElement: (input: string, mimeType?: string) => Element;
    svg_add2: (a: [number, number], b: [number, number]) => [number, number];
    svg_distance2: (a: [number, number], b: [number, number]) => number;
    svg_distanceSq2: (a: [number, number], b: [number, number]) => number;
    svg_magnitude2: (a: [number, number]) => number;
    svg_magnitudeSq2: (a: [number, number]) => number;
    svg_multiplyMatrices2: (m1: number[], m2: number[]) => number[];
    svg_polar_to_cart: (a: number, d: number) => [number, number];
    svg_scale2: (a: [number, number], s: number) => [number, number];
    svg_sub2: (a: [number, number], b: [number, number]) => [number, number];
    parseColorToHex: (string: string) => string;
    parseColorToRgb: (string: string) => number[];
    hexToRgb: (string: string) => number[];
    hslToRgb: (hue: number, saturation: number, lightness: number, alpha: number) => number[];
    rgbToHex: (red: number, green: number, blue: number, alpha: number) => string;
    cssColors: {
        black: string;
        silver: string;
        gray: string;
        white: string;
        maroon: string;
        red: string;
        purple: string;
        fuchsia: string;
        green: string;
        lime: string;
        olive: string;
        yellow: string;
        navy: string;
        blue: string;
        teal: string;
        aqua: string;
        orange: string;
        aliceblue: string;
        antiquewhite: string;
        aquamarine: string;
        azure: string;
        beige: string;
        bisque: string;
        blanchedalmond: string;
        blueviolet: string;
        brown: string;
        burlywood: string;
        cadetblue: string;
        chartreuse: string;
        chocolate: string;
        coral: string;
        cornflowerblue: string;
        cornsilk: string;
        crimson: string;
        cyan: string;
        darkblue: string;
        darkcyan: string;
        darkgoldenrod: string;
        darkgray: string;
        darkgreen: string;
        darkgrey: string;
        darkkhaki: string;
        darkmagenta: string;
        darkolivegreen: string;
        darkorange: string;
        darkorchid: string;
        darkred: string;
        darksalmon: string;
        darkseagreen: string;
        darkslateblue: string;
        darkslategray: string;
        darkslategrey: string;
        darkturquoise: string;
        darkviolet: string;
        deeppink: string;
        deepskyblue: string;
        dimgray: string;
        dimgrey: string;
        dodgerblue: string;
        firebrick: string;
        floralwhite: string;
        forestgreen: string;
        gainsboro: string;
        ghostwhite: string;
        gold: string;
        goldenrod: string;
        greenyellow: string;
        grey: string;
        honeydew: string;
        hotpink: string;
        indianred: string;
        indigo: string;
        ivory: string;
        khaki: string;
        lavender: string;
        lavenderblush: string;
        lawngreen: string;
        lemonchiffon: string;
        lightblue: string;
        lightcoral: string;
        lightcyan: string;
        lightgoldenrodyellow: string;
        lightgray: string;
        lightgreen: string;
        lightgrey: string;
        lightpink: string;
        lightsalmon: string;
        lightseagreen: string;
        lightskyblue: string;
        lightslategray: string;
        lightslategrey: string;
        lightsteelblue: string;
        lightyellow: string;
        limegreen: string;
        linen: string;
        magenta: string;
        mediumaquamarine: string;
        mediumblue: string;
        mediumorchid: string;
        mediumpurple: string;
        mediumseagreen: string;
        mediumslateblue: string;
        mediumspringgreen: string;
        mediumturquoise: string;
        mediumvioletred: string;
        midnightblue: string;
        mintcream: string;
        mistyrose: string;
        moccasin: string;
        navajowhite: string;
        oldlace: string;
        olivedrab: string;
        orangered: string;
        orchid: string;
        palegoldenrod: string;
        palegreen: string;
        paleturquoise: string;
        palevioletred: string;
        papayawhip: string;
        peachpuff: string;
        peru: string;
        pink: string;
        plum: string;
        powderblue: string;
        rosybrown: string;
        royalblue: string;
        saddlebrown: string;
        salmon: string;
        sandybrown: string;
        seagreen: string;
        seashell: string;
        sienna: string;
        skyblue: string;
        slateblue: string;
        slategray: string;
        slategrey: string;
        snow: string;
        springgreen: string;
        steelblue: string;
        tan: string;
        thistle: string;
        tomato: string;
        turquoise: string;
        violet: string;
        wheat: string;
        whitesmoke: string;
        yellowgreen: string;
    };
    NS: string;
    nodes_attributes: {
        svg: string[];
        line: string[];
        rect: string[];
        circle: string[];
        ellipse: string[];
        polygon: string[];
        polyline: string[];
        path: string[];
        text: string[];
        mask: string[];
        symbol: string[];
        clipPath: string[];
        marker: string[];
        linearGradient: string[];
        radialGradient: string[];
        stop: string[];
        pattern: string[];
    };
    nodes_children: {
        svg: string[];
        defs: string[];
        filter: string[];
        g: string[];
        text: string[];
        marker: string[];
        symbol: string[];
        clipPath: string[];
        mask: string[];
        linearGradient: string[];
        radialGradient: string[];
    };
    extensions: {
        origami: {
            nodeName: string;
            init: (parent: any, graph: any, options?: {}) => any;
            args: () => any[];
            methods: {
                appendTo: (element: any, parent: any) => any;
                removeChildren: (element: any) => any;
                setAttributes: (element: any, attrs: any) => any;
                clearTransform: (el: any) => any;
                vertices: (...args: any[]) => Element;
                edges: (...args: any[]) => Element;
                faces: (...args: any[]) => Element;
                boundaries: (...args: any[]) => Element;
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
            init: (parent: any, ...args: any[]) => any;
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
            init: (parent: any, a: any, b: any, c: any, d: any) => any;
            methods: {
                appendTo: (element: any, parent: any) => any;
                setAttributes: (element: any, attrs: any) => any;
                clearTransform: (el: any) => any;
            };
        };
        style: {
            init: (parent: any, text: any) => any;
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
            init: (_: any, ...args: any[]) => any;
        };
    };
};
//# sourceMappingURL=index.d.ts.map