declare const _default: {
    normalAxiom1: (point1: [number, number], point2: [number, number]) => [UniqueLine];
    axiom1: (point1: [number, number], point2: [number, number]) => [VecLine2];
    normalAxiom2: (point1: [number, number], point2: [number, number]) => [UniqueLine];
    axiom2: (point1: [number, number], point2: [number, number]) => [VecLine2];
    normalAxiom3: (line1: UniqueLine, line2: UniqueLine) => [UniqueLine?, UniqueLine?];
    axiom3: (line1: VecLine2, line2: VecLine2) => [VecLine2?, VecLine2?];
    normalAxiom4: (line: UniqueLine, point: [number, number]) => [UniqueLine];
    axiom4: ({ vector }: VecLine2, point: [number, number]) => [VecLine2];
    normalAxiom5: (line: UniqueLine, point1: [number, number], point2: [number, number]) => [UniqueLine?, UniqueLine?];
    axiom5: (line: VecLine2, point1: [number, number], point2: [number, number]) => VecLine2[];
    normalAxiom6: (line1: UniqueLine, line2: UniqueLine, point1: [number, number], point2: [number, number]) => UniqueLine[];
    axiom6: (line1: VecLine2, line2: VecLine2, point1: [number, number], point2: [number, number]) => VecLine2[];
    normalAxiom7: (line1: UniqueLine, line2: UniqueLine, point: [number, number]) => [UniqueLine?];
    axiom7: (line1: VecLine2, line2: VecLine2, point: [number, number]) => [VecLine2?];
};
export default _default;
