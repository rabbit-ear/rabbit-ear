export function renderSVG(graph: FOLD, element: SVGElement, options?: object): SVGElement;
export function foldToSvg(file: FOLD | string, options?: {
    string?: boolean;
    vertices?: boolean;
    edges?: {
        mountain: object;
        valley: object;
    };
    faces?: {
        front: object;
        back: object;
    };
    boundaries?: object;
    viewBox?: boolean;
    strokeWidth?: number;
    radius?: number;
}): SVGElement | string;
//# sourceMappingURL=foldToSvg.d.ts.map