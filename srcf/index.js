import SVG from "./SimpleSVG";
import Origami from "./OrigamiView";
import * as Folder from "./Folder";
import FoldView from "./FoldView";

window.Origami = Origami;

let addClass = SVG.addClass;
let removeClass = SVG.removeClass;
let setId = SVG.setId;
let removeChildren = SVG.removeChildren;

export {
	Origami, Folder, SVG, FoldView,
	addClass, removeClass, setId, removeChildren
};
