export function makePolygonCircumradius(sides?: number, circumradius?: number): [number, number][];
export function makePolygonCircumradiusSide(sides?: number, circumradius?: number): [number, number][];
export function makePolygonInradius(sides?: number, inradius?: number): [number, number][];
export function makePolygonInradiusSide(sides?: number, inradius?: number): [number, number][];
export function makePolygonSideLength(sides?: number, length?: number): [number, number][];
export function makePolygonSideLengthSide(sides?: number, length?: number): [number, number][];
export function makePolygonNonCollinear(polygon: ([number, number] | [number, number, number])[], epsilon?: number): ([number, number] | [number, number, number])[];
export function makePolygonNonCollinear3(polygon: [number, number, number][], epsilon?: number): [number, number, number][];
export function signedArea(points: [number, number][]): number;
export function centroid(points: [number, number][]): [number, number];
export function boundingBox(points: number[][], padding?: number): Box | null;
//# sourceMappingURL=polygon.d.ts.map