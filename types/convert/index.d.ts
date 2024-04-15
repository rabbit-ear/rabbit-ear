declare const _default: {
    parseCSSStyleSheet: (sheet: CSSStyleSheet) => any;
    parseStyleElement: (style: SVGStyleElement) => any[];
    getStylesheetStyle: (key: any, nodeName: any, attributes: any, sheets?: any[]) => any;
    lineToSegments: (line: Element) => [number, number, number, number][];
    pathToSegments: (path: Element) => [number, number, number, number][];
    polygonToSegments: (polygon: Element) => [number, number, number, number][];
    polylineToSegments: (polyline: Element) => [number, number, number, number][];
    rectToSegments: (rect: Element) => [number, number, number, number][];
    facesVerticesPolygon: (graph: any, options: any) => SVGElement[];
    facesEdgesPolygon: (graph: any, options: any) => SVGElement[];
    drawFaces: (graph: any, options: any) => SVGElement | SVGElement[];
    edgesPaths: (graph: FOLD, options?: any) => SVGElement;
    edgesLines: (graph: FOLD, options?: any) => SVGElement;
    drawEdges: (graph: any, options: any) => SVGElement;
    drawVertices: (graph: any, options?: {}) => SVGElement;
    drawBoundaries: (graph: any, options?: {}) => SVGElement;
    colorToAssignment: (color: any, customAssignments: any) => any;
    opacityToFoldAngle: (opacity: any, assignment: any) => number;
    getEdgeStroke: (element: any, attributes: any) => string;
    getEdgeOpacity: (element: any, attributes: any) => number;
    setKeysAndValues: (el: Element, attributes?: any) => void;
    boundingBoxToViewBox: (box: Box) => string;
    getViewBox: (graph: FOLD) => string;
    getNthPercentileEdgeLength: ({ vertices_coords, edges_vertices, edges_length }: FOLD, n?: number) => number;
    getStrokeWidth: (graph: FOLD, vmax?: number) => number;
    planarizeGraph: (graph: FOLD, epsilon?: number) => FOLD;
    findEpsilonInObject: (graph: FOLD, object: any, key?: string) => number;
    invertVertical: (vertices_coords: [number, number][] | [number, number, number][]) => undefined;
    invisibleParent: (child: any) => any;
    foldToObj: (file: string | FOLD) => string;
    renderSVG: (graph: FOLD, element: SVGElement, options?: any) => SVGElement;
    foldToSvg: (file: string | FOLD, options?: {
        string?: boolean;
        vertices?: boolean;
        edges?: {
            mountain: any;
            valley: any;
        };
        faces?: {
            front: any;
            back: any;
        };
        boundaries?: any;
        viewBox?: boolean;
        strokeWidth?: number;
        radius?: number;
    }) => string | SVGElement;
    svgSegments: (svg: string | Element) => {
        element: Element;
        attributes?: {
            [key: string]: string;
        };
        segment: [number, number][];
        data: {
            assignment: string;
            foldAngle: string;
        };
        stroke: string;
        opacity: number;
    }[];
    svgEdgeGraph: (svg: string | Element, options: any) => FOLD;
    svgToFold: (file: string | SVGElement, options: any) => FOLD;
    opxEdgeGraph: (file: string) => FOLD;
    opxToFold: (file: string, options: number | {
        epsilon?: number;
        invertVertical?: boolean;
    }) => FOLD;
    objToFold: (file: string) => FOLD;
};
export default _default;
