export function intersectLineLine(a: VecLine2, b: VecLine2, aDomain?: Function, bDomain?: Function, epsilon?: number): {
    point: ([number, number] | undefined);
    a: (number | undefined);
    b: (number | undefined);
};
export function intersectCircleLine(circle: Circle, line: VecLine2, circleDomain?: (n: number, epsilon?: number) => boolean, lineDomain?: Function, epsilon?: number): [number, number][];
