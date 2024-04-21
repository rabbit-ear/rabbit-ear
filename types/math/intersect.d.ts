export function intersectLineLine(a: VecLine2, b: VecLine2, aDomain?: Function, bDomain?: Function, epsilon?: number): {
    point: ([number, number] | undefined);
    a: (number | undefined);
    b: (number | undefined);
};
export function intersectCircleLine(circle: Circle, line: VecLine2, _?: Function, lineDomain?: Function, epsilon?: number): [number, number][];
export function intersectPolygonLine(polygon: ([number, number] | [number, number, number])[], line: VecLine2, domainFunc?: Function, epsilon?: number): {
    a: number;
    point: [number, number];
}[];
