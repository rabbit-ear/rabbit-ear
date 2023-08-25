/* svg (c) Kraft, MIT License */
import makeCoordinates from '../../../arguments/makeCoordinates.js';
import makeCurvePath from './makeCurvePath.js';

/**
 * SVG (c) Kraft
 */

const curveArguments = (...args) => [
	makeCurvePath(makeCoordinates(...args.flat())),
];

export { curveArguments as default };
