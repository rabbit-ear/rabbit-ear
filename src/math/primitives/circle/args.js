/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
import { getCircle } from "../../general/get.js";
/**
 * circle constructors:
 * circle(1, [4,5]) radius:1, origin:4,5
 * circle([4,5], 1) radius:1, origin:4,5
 * circle(1, 2) radius: 2, origin:1
 * circle(1, 2, 3) radius: 3, origin:1,2
 * circle(1, 2, 3, 4) radius: 4, origin:1,2,3
 * circle([1,2], [3,4]) radius:(dist between pts), origin:1,2
 * circle([1,2], [3,4], [5,6]) circumcenter between 3 points
 */

const CircleArgs = function () {
	const circle = getCircle(...arguments);
	this.radius = circle.radius;
	this.origin = Constructors.vector(...circle.origin);
};

export default CircleArgs;
