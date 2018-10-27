import SVG from "./SimpleSVG";
import Origami from "./OrigamiView";
import * as fold from "./Folder";
import FoldView from "./FoldView";
import * as bases from "./OrigamiBases";
import * as math from './Geom';

window.Origami = Origami;

let addClass = SVG.addClass;
let removeClass = SVG.removeClass;
let setId = SVG.setId;
let removeChildren = SVG.removeChildren;

export {
	Origami, fold, SVG, FoldView, bases, math,
	addClass, removeClass, setId, removeChildren
};
