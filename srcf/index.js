import {line, circle, polygon, group, addClass, removeClass} from './SimpleSVG.js';
import OrigamiView from './OrigamiView';
import * as Origami from './Origami.js';

window.OrigamiView = OrigamiView;
window.Origami = Origami;

export {
	OrigamiView, Origami,
	line, circle, polygon, group, addClass, removeClass
}
