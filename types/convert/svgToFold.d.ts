export function svgSegments(svg: Element | string): {
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
export function svgEdgeGraph(svg: Element | string, options: any): FOLD;
export function svgToFold(file: string | SVGElement, options: number | object): FOLD;
