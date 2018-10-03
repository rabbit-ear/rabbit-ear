import {line, circle, polygon, group, addClass, removeClass} from './SimpleSVG.js';
import OrigamiView from './OrigamiView';
import * as Origami from './Origami.js';

// for convenience, bind these to the window
window.OrigamiView = OrigamiView;
window.Origami = Origami;

// figure out how to insert comment header "// Rabbit Ear https://rabbitear.org v0.1.1 Copyright 2018 Robby Kraft";
export {
	OrigamiView, Origami,
	line, circle, polygon, group, addClass, removeClass
}
