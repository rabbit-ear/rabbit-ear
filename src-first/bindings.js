// function getAllMethods(object) {
// 	return Object.getOwnPropertyNames(object).filter(function(property) {
// 		return typeof object[property] == 'function';
// 	});
// }
// console.log(getAllMethods(CreasePattern.prototype));

// var boundCrease = cp.crease.bind(cp)
// window.creaseRay = cp.creaseRay;

import CreasePattern from './CreasePattern.js'
import OrigamiPaper from './OrigamiPaper.js'
import OrigamiFold from './OrigamiFold.js'

window.CreasePattern = CreasePattern;
window.OrigamiPaper = OrigamiPaper;
window.OrigamiFold = OrigamiFold;
