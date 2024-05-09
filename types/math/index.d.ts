declare const _default: {
    clipLineConvexPolygon: (poly: [number, number][], { vector, origin }: VecLine2, fnPoly?: Function, fnLine?: Function, epsilon?: number) => [number, number][];
    clipPolygonPolygon: (polygon1: number[][], polygon2: number[][], epsilon?: number) => number[][];
    intersectLineLine: (a: VecLine2, b: VecLine2, aDomain?: Function, bDomain?: Function, epsilon?: number) => {
        point: [number, number];
        a: number;
        b: number;
    };
    intersectCircleLine: (circle: Circle, line: VecLine2, _?: Function, lineDomain?: Function, epsilon?: number) => [number, number][];
    intersectPolygonLine: (polygon: ([number, number] | [number, number, number])[], line: VecLine2, domainFunc?: Function, epsilon?: number) => {
        a: number;
        point: [number, number];
    }[];
    overlapLinePoint: ({ vector, origin }: VecLine2, point: [number, number] | [number, number, number], lineDomain?: (_: number, __?: number) => boolean, epsilon?: number) => boolean;
    overlapConvexPolygonPoint: (polygon: ([number, number] | [number, number, number])[], point: [number, number] | [number, number, number], polyDomain?: Function, epsilon?: number) => {
        overlap: boolean;
        t: number[];
    };
    overlapConvexPolygons: (poly1: [number, number][], poly2: [number, number][], epsilon?: number) => boolean;
    overlapBoundingBoxes: (box1: Box, box2: Box, epsilon?: number) => boolean;
    pointInBoundingBox: (point: number[], box: Box, epsilon?: number) => boolean;
    enclosingBoundingBoxes: (outer: Box, inner: Box, epsilon?: number) => boolean;
    trilateration2: (pts: [[number, number], [number, number], [number, number]], radii: [number, number, number]) => [number, number];
    trilateration3: (pts: [[number, number, number], [number, number, number], [number, number, number]], radii: [number, number, number]) => [number, number, number];
    circumcircle: (a: [number, number], b: [number, number], c: [number, number]) => Circle;
    straightSkeleton: (points: [number, number][]) => any[];
    rangeUnion: (a: number[], b: number[]) => number[];
    doRangesOverlap: (a: number[], b: number[], epsilon?: number) => boolean;
    isCounterClockwiseBetween: (angle: number, floor: number, ceiling: number) => boolean;
    clockwiseAngleRadians: (a: number, b: number) => number;
    counterClockwiseAngleRadians: (a: number, b: number) => number;
    clockwiseAngle2: (a: [number, number], b: [number, number]) => number;
    counterClockwiseAngle2: (a: [number, number], b: [number, number]) => number;
    clockwiseBisect2: (a: [number, number], b: [number, number]) => [number, number];
    counterClockwiseBisect2: (a: [number, number], b: [number, number]) => [number, number];
    clockwiseSubsectRadians: (angleA: number, angleB: number, divisions: number) => number[];
    counterClockwiseSubsectRadians: (angleA: number, angleB: number, divisions: number) => number[];
    clockwiseSubsect2: (vectorA: [number, number], vectorB: [number, number], divisions: number) => [number, number][];
    counterClockwiseSubsect2: (vectorA: [number, number], vectorB: [number, number], divisions: number) => [number, number][];
    counterClockwiseOrderRadians: (radians: number[]) => number[];
    counterClockwiseOrder2: (vectors: [number, number][]) => number[];
    counterClockwiseSectorsRadians: (radians: number[]) => number[];
    counterClockwiseSectors2: (vectors: [number, number][]) => number[];
    threePointTurnDirection: (p0: [number, number], p1: [number, number], p2: [number, number], epsilon?: number) => number;
    makePolygonCircumradius: (sides?: number, circumradius?: number) => [number, number][];
    makePolygonCircumradiusSide: (sides?: number, circumradius?: number) => [number, number][];
    makePolygonInradius: (sides?: number, inradius?: number) => [number, number][];
    makePolygonInradiusSide: (sides?: number, inradius?: number) => [number, number][];
    makePolygonSideLength: (sides?: number, length?: number) => [number, number][];
    makePolygonSideLengthSide: (sides?: number, length?: number) => [number, number][];
    makePolygonNonCollinear: (polygon: ([number, number] | [number, number, number])[], epsilon?: number) => ([number, number] | [number, number, number])[];
    makePolygonNonCollinear3: (polygon: [number, number, number][], epsilon?: number) => [number, number, number][];
    signedArea: (points: [number, number][]) => number;
    centroid: (points: [number, number][]) => [number, number];
    boundingBox: (points: number[][], padding?: number) => Box;
    projectPointOnPlane: (point: [number, number] | [number, number, number], vector?: [number, number, number], origin?: [number, number, number]) => [number, number, number];
    nearestPoint2: (points: [number, number][], point: [number, number]) => [number, number];
    nearestPoint: (points: number[][], point: number[]) => number[];
    nearestPointOnLine: ({ vector, origin }: VecLine, point: [number, number] | [number, number, number], clampFunc?: Function, epsilon?: number) => [number, number] | [number, number, number];
    nearestPointOnPolygon: (polygon: [number, number][], point: [number, number]) => any;
    nearestPointOnCircle: ({ radius, origin }: Circle, point: [number, number]) => [number, number];
    clampLine: (dist: number) => number;
    clampRay: (dist: number) => number;
    clampSegment: (dist: number) => number;
    collinearPoints: (p0: number[], p1: number[], p2: number[], epsilon?: number) => boolean;
    collinearBetween: (p0: number[], p1: number[], p2: number[], inclusive?: boolean, epsilon?: number) => boolean;
    collinearLines2: (a: VecLine2, b: VecLine2, epsilon?: number) => boolean;
    collinearLines3: (a: VecLine3, b: VecLine3, epsilon?: number) => boolean;
    pleat: (a: VecLine2, b: VecLine2, count: number, epsilon?: number) => [VecLine2[], VecLine2[]];
    bisectLines2: (a: VecLine2, b: VecLine2, epsilon?: number) => [VecLine2?, VecLine2?];
    convexHullRadialSortPoints: (points: [number, number][], epsilon?: number) => number[][];
    convexHull: (points?: [number, number][], includeCollinear?: boolean, epsilon?: number) => number[];
    quaternionFromTwoVectors: (u: [number, number, number], v: [number, number, number]) => [number, number, number, number];
    matrix4FromQuaternion: (q: [number, number, number, number]) => number[];
    identity4x4: readonly number[];
    isIdentity4x4: (m: number[]) => boolean;
    multiplyMatrix4Vector3: (m: number[], vector: [number, number, number]) => [number, number, number];
    multiplyMatrix4Line3: (m: number[], vector: [number, number, number], origin: [number, number, number]) => VecLine;
    multiplyMatrices4: (m1: number[], m2: number[]) => number[];
    determinant4: (m: number[]) => number;
    invertMatrix4: (m: number[]) => number[];
    makeMatrix4Translate: (x?: number, y?: number, z?: number) => number[];
    makeMatrix4RotateX: (angle: number, origin?: [number, number, number]) => number[];
    makeMatrix4RotateY: (angle: number, origin?: [number, number, number]) => number[];
    makeMatrix4RotateZ: (angle: number, origin?: [number, number, number]) => number[];
    makeMatrix4Rotate: (angle: number, vector?: [number, number, number], origin?: [number, number, number]) => number[];
    makeMatrix4Scale: (scale?: [number, number, number], origin?: [number, number, number]) => number[];
    makeMatrix4UniformScale: (scale?: number, origin?: [number, number, number]) => number[];
    makeMatrix4ReflectZ: (vector: [number, number], origin?: [number, number]) => number[];
    makePerspectiveMatrix4: (FOV: number, aspect: number, near: number, far: number) => number[];
    makeOrthographicMatrix4: (top: number, right: number, bottom: number, left: number, near: number, far: number) => number[];
    makeLookAtMatrix4: (position: [number, number, number], target: [number, number, number], up: [number, number, number]) => number[];
    identity3x3: readonly number[];
    identity3x4: readonly number[];
    isIdentity3x4: (m: number[]) => boolean;
    multiplyMatrix3Vector3: (m: number[], vector: [number, number, number]) => [number, number, number];
    multiplyMatrix3Line3: (m: number[], vector: [number, number, number], origin: [number, number, number]) => VecLine;
    multiplyMatrices3: (m1: number[], m2: number[]) => number[];
    determinant3: (m: number[]) => number;
    invertMatrix3: (m: number[]) => number[];
    makeMatrix3Translate: (x?: number, y?: number, z?: number) => number[];
    makeMatrix3RotateX: (angle: number, origin?: [number, number, number]) => number[];
    makeMatrix3RotateY: (angle: number, origin?: [number, number, number]) => number[];
    makeMatrix3RotateZ: (angle: number, origin?: [number, number, number]) => number[];
    makeMatrix3Rotate: (angle: number, vector?: [number, number, number], origin?: [number, number, number]) => number[];
    makeMatrix3Scale: (scale?: [number, number, number], origin?: [number, number, number]) => number[];
    makeMatrix3UniformScale: (scale?: number, origin?: [number, number, number]) => number[];
    makeMatrix3ReflectZ: (vector: [number, number], origin?: [number, number]) => number[];
    identity2x2: number[];
    identity2x3: number[];
    multiplyMatrix2Vector2: (matrix: number[], vector: [number, number]) => [number, number];
    multiplyMatrix2Line2: (matrix: number[], { vector, origin }: VecLine2) => VecLine2;
    multiplyMatrices2: (m1: number[], m2: number[]) => number[];
    determinant2: (m: number[]) => number;
    invertMatrix2: (m: number[]) => number[];
    makeMatrix2Translate: (x?: number, y?: number) => number[];
    makeMatrix2Scale: (scale?: [number, number], origin?: [number, number]) => number[];
    makeMatrix2UniformScale: (scale?: number, origin?: [number, number]) => number[];
    makeMatrix2Rotate: (angle: number, origin?: [number, number]) => number[];
    makeMatrix2Reflect: (vector: [number, number], origin?: [number, number]) => number[];
    magnitude: (v: number[]) => number;
    magnitude2: (v: [number, number] | [number, number, number]) => number;
    magnitude3: (v: [number, number, number]) => number;
    magSquared2: (v: [number, number] | [number, number, number]) => number;
    magSquared: (v: number[]) => number;
    normalize: (v: number[]) => number[];
    normalize2: (v: [number, number] | [number, number, number]) => [number, number];
    normalize3: (v: [number, number, number]) => [number, number, number];
    scale: (v: number[], s: number) => number[];
    scale2: (v: [number, number] | [number, number, number], s: number) => [number, number];
    scale3: (v: [number, number, number], s: number) => [number, number, number];
    scaleNonUniform: (v: number[], s: number[]) => number[];
    scaleNonUniform2: (v: [number, number] | [number, number, number], s: [number, number] | [number, number, number]) => [number, number];
    scaleNonUniform3: (v: [number, number, number], s: [number, number, number]) => [number, number, number];
    add: (v: number[], u: number[]) => number[];
    add2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => [number, number];
    add3: (v: [number, number, number], u: [number, number, number]) => [number, number, number];
    subtract: (v: number[], u: number[]) => number[];
    subtract2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => [number, number];
    subtract3: (v: [number, number, number], u: [number, number, number]) => [number, number, number];
    dot: (v: number[], u: number[]) => number;
    dot2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => number;
    dot3: (v: [number, number, number], u: [number, number, number]) => number;
    midpoint: (v: number[], u: number[]) => number[];
    midpoint2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => [number, number];
    midpoint3: (v: [number, number, number], u: [number, number, number]) => [number, number, number];
    average: (...args: number[][]) => number[];
    average2: (...vectors: [number, number][]) => [number, number];
    average3: (...vectors: [number, number, number][]) => [number, number, number];
    lerp: (v: number[], u: number[], t?: number) => number[];
    cross2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => number;
    cross3: (v: [number, number, number], u: [number, number, number]) => [number, number, number];
    distance: (v: number[], u: number[]) => number;
    distance2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number]) => number;
    distance3: (v: [number, number, number], u: [number, number, number]) => number;
    flip: (v: number[]) => number[];
    flip2: (v: [number, number] | [number, number, number]) => [number, number];
    flip3: (v: [number, number, number]) => [number, number, number];
    rotate90: (v: [number, number] | [number, number, number]) => [number, number];
    rotate270: (v: [number, number] | [number, number, number]) => [number, number];
    degenerate: (v: number[], epsilon?: number) => boolean;
    parallelNormalized: (v: number[], u: number[], epsilon?: number) => boolean;
    parallel: (v: number[], u: number[], epsilon?: number) => boolean;
    parallel2: (v: [number, number] | [number, number, number], u: [number, number] | [number, number, number], epsilon?: number) => boolean;
    parallel3: (v: [number, number, number], u: [number, number, number], epsilon?: number) => boolean;
    resize: (dimension: number, vector: number[]) => number[];
    resize2: (vector: number[]) => [number, number];
    resize3: (vector: number[]) => [number, number, number];
    resizeUp: (a: number[], b: number[]) => number[][];
    basisVectors2: (vector?: [number, number] | [number, number, number]) => [number, number][];
    basisVectors3: (vector?: [number, number, number]) => [number, number, number][];
    basisVectors: (vector: number[]) => number[][];
    epsilonEqual: (a: number, b: number, epsilon?: number) => boolean;
    epsilonCompare: (a: number, b: number, epsilon?: number) => number;
    epsilonEqualVectors: (a: number[], b: number[], epsilon?: number) => boolean;
    include: (n: number, epsilon?: number) => boolean;
    exclude: (n: number, epsilon?: number) => boolean;
    includeL: (_: number, __?: number) => boolean;
    excludeL: (_: number, __?: number) => boolean;
    includeR: (n: number, epsilon?: number) => boolean;
    excludeR: (n: number, epsilon?: number) => boolean;
    includeS: (n: number, e?: number) => boolean;
    excludeS: (n: number, e?: number) => boolean;
    vectorToAngle: (v: [number, number]) => number;
    angleToVector: (a: number) => [number, number];
    pointsToLine2: (a: [number, number] | [number, number, number], b: [number, number] | [number, number, number]) => VecLine2;
    pointsToLine3: (a: [number, number, number], b: [number, number, number]) => VecLine3;
    pointsToLine: (a: [number, number] | [number, number, number], b: [number, number] | [number, number, number]) => VecLine;
    vecLineToUniqueLine: ({ vector, origin }: VecLine) => UniqueLine;
    uniqueLineToVecLine: ({ normal, distance }: UniqueLine) => VecLine2;
    EPSILON: 0.000001;
    R2D: number;
    D2R: number;
    TWO_PI: number;
};
export default _default;
//# sourceMappingURL=index.d.ts.map