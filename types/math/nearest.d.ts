export function nearestPoint2(points: [number, number][], point: [number, number]): [number, number];
export function nearestPoint(points: number[][], point: number[]): number[];
export function nearestPointOnLine({ vector, origin }: VecLine, point: [number, number] | [number, number, number], clampFunc?: Function, epsilon?: number): [number, number] | [number, number, number];
export function nearestPointOnPolygon(polygon: [number, number][], point: [number, number]): object;
export function nearestPointOnCircle({ radius, origin }: Circle, point: [number, number]): [number, number];
