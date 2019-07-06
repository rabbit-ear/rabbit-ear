/**
 * SVG in Javascript (c) Robby Kraft
 *
 * arrows!
 */

import window from "../environment/window";
import {
  line,
  bezier,
  polygon,
} from "./primitives";

const svgNS = "http://www.w3.org/2000/svg";

export const straightArrow = function (startPoint, endPoint, options) {
  const p = {
    color: "#000", // css
    strokeWidth: 0.5, // css
    strokeStyle: "",
    fillStyle: "",
    highlight: undefined,
    highlightStrokeStyle: "",
    highlightFillStyle: "",
    width: 0.5, // pixels. of the arrow head
    length: 2, // pixels. of the arrow head
    padding: 0.0, // %
    start: false,
    end: true,
  };
  if (typeof options === "object" && options !== null) {
    Object.assign(p, options);
  }

  const arrowFill = [
    "stroke:none",
    `fill:${p.color}`,
    p.fillStyle,
    "pointer-events:none",
  ].filter(a => a !== "").join(";");

  const arrowStroke = [
    "fill:none",
    `stroke:${p.color}`,
    `stroke-width:${p.strokeWidth}`,
    p.strokeStyle,
  ].filter(a => a !== "").join(";");

  const thinStroke = Math.floor(p.strokeWidth * 3) / 10;
  const thinSpace = Math.floor(p.strokeWidth * 6) / 10;
  const highlightStroke = [
    "fill:none",
    `stroke:${p.highlight}`,
    `stroke-width:${p.strokeWidth * 0.5}`,
    `stroke-dasharray:${thinStroke} ${thinSpace}`,
    "stroke-linecap:round",
    p.strokeStyle,
  ].filter(a => a !== "").join(";");

  const highlightFill = [
    "stroke:none",
    `fill:${p.highlight}`,
    p.fillStyle,
    "pointer-events:none",
  ].filter(a => a !== "").join(";");


  let start = startPoint;
  let end = endPoint;

  const vec = [end[0] - start[0], end[1] - start[1]];
  const arrowLength = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
  const arrowVector = [vec[0] / arrowLength, vec[1] / arrowLength];
  const arrow90 = [arrowVector[1], -arrowVector[0]];

  // adjust start and end if there's padding
  start = [
    startPoint[0] + arrowVector[0] * (p.start ? 1 : 0) * p.padding,
    startPoint[1] + arrowVector[1] * (p.start ? 1 : 0) * p.padding,
  ];
  end = [
    endPoint[0] - arrowVector[0] * (p.end ? 1 : 0) * p.padding,
    endPoint[1] - arrowVector[1] * (p.end ? 1 : 0) * p.padding,
  ];


  // black triangle
  const endHead = [
    [end[0] + arrow90[0] * p.width, end[1] + arrow90[1] * p.width],
    [end[0] - arrow90[0] * p.width, end[1] - arrow90[1] * p.width],
    [end[0] + arrowVector[0] * p.length, end[1] + arrowVector[1] * p.length],
  ];
  const startHead = [
    [start[0] - arrow90[0] * p.width, start[1] - arrow90[1] * p.width],
    [start[0] + arrow90[0] * p.width, start[1] + arrow90[1] * p.width],
    [start[0] - arrowVector[0] * p.length, start[1] - arrowVector[1] * p.length],
  ];
  const arrow = window.document.createElementNS(svgNS, "g");
  const l = line(start[0], start[1], end[0], end[1]);
  l.setAttribute("style", arrowStroke);
  arrow.appendChild(l);
  if (p.end) {
    const endArrowPoly = polygon(endHead);
    endArrowPoly.setAttribute("style", arrowFill);
    arrow.appendChild(endArrowPoly);
  }
  if (p.start) {
    const startArrowPoly = polygon(startHead);
    startArrowPoly.setAttribute("style", arrowFill);
    arrow.appendChild(startArrowPoly);
  }
  if (p.highlight !== undefined) {
    const hScale = 0.6;
    const centering = [
      arrowVector[0] * p.length * 0.09,
      arrowVector[1] * p.length * 0.09,
    ];
    const endHeadHighlight = [
      [centering[0] + end[0] + arrow90[0] * (p.width * hScale),
        centering[1] + end[1] + arrow90[1] * (p.width * hScale)],
      [centering[0] + end[0] - arrow90[0] * (p.width * hScale),
        centering[1] + end[1] - arrow90[1] * (p.width * hScale)],
      [centering[0] + end[0] + arrowVector[0] * (p.length * hScale),
        centering[1] + end[1] + arrowVector[1] * (p.length * hScale)],
    ];
    const startHeadHighlight = [
      [-centering[0] + start[0] - arrow90[0] * (p.width * hScale),
        -centering[1] + start[1] - arrow90[1] * (p.width * hScale)],
      [-centering[0] + start[0] + arrow90[0] * (p.width * hScale),
        -centering[1] + start[1] + arrow90[1] * (p.width * hScale)],
      [-centering[0] + start[0] - arrowVector[0] * (p.length * hScale),
        -centering[1] + start[1] - arrowVector[1] * (p.length * hScale)],
    ];
    const highline = line(start[0], start[1], end[0], end[1]);
    highline.setAttribute("style", highlightStroke);
    arrow.appendChild(highline);
    if (p.end) {
      const endArrowHighlight = polygon(endHeadHighlight);
      endArrowHighlight.setAttribute("style", highlightFill);
      arrow.appendChild(endArrowHighlight);
    }
    if (p.start) {
      const startArrowHighlight = polygon(startHeadHighlight);
      startArrowHighlight.setAttribute("style", highlightFill);
      arrow.appendChild(startArrowHighlight);
    }
  }
  return arrow;
};


/**
 * the arrowheads use "fill" but the arc cannot, and must use "stroke"
 * therefore, to set the color, pass it in as one of the options
 * don't use .setAttribute()
 */
export const arcArrow = function (start, end, options) {
  // options:
  // - padding: the arrow backs off from the target by a tiny fraction
  // - color
  const p = {
    color: "#000", // css
    strokeWidth: 0.5, // css
    width: 0.5, // pixels. of the arrow head
    length: 2, // pixels. of the arrow head
    bend: 0.3, // %
    pinch: 0.618, // %
    padding: 0.5, // % of the arrow head "length"
    side: true,
    start: false,
    end: true,
    strokeStyle: "",
    fillStyle: "",
  };

  if (typeof options === "object" && options !== null) {
    Object.assign(p, options);
  }

  const arrowFill = [
    "stroke:none",
    `fill:${p.color}`,
    p.fillStyle,
  ].filter(a => a !== "").join(";");

  const arrowStroke = [
    "fill:none",
    `stroke:${p.color}`,
    `stroke-width:${p.strokeWidth}`,
    p.strokeStyle,
  ].filter(a => a !== "").join(";");

  let startPoint = start;
  let endPoint = end;
  let vector = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
  let midpoint = [startPoint[0] + vector[0] / 2, startPoint[1] + vector[1] / 2];
  // make sure arrow isn't too small
  let len = Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]);
  var minLength = (p.start ? (1+p.padding) : 0 + p.end ? (1+p.padding) : 0)
    * p.length * 2.5;
  if (len < minLength) {
    let minVec = [vector[0]/len * minLength, vector[1]/len * minLength];
    startPoint = [midpoint[0]-minVec[0]*0.5, midpoint[1]-minVec[1]*0.5];
    endPoint = [midpoint[0]+minVec[0]*0.5, midpoint[1]+minVec[1]*0.5];
    vector = [endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]];
  }
  let perpendicular = [vector[1], -vector[0]];
  let bezPoint = [
    midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
    midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
  ];

  let bezStart = [bezPoint[0] - startPoint[0], bezPoint[1] - startPoint[1]];
  let bezEnd = [bezPoint[0] - endPoint[0], bezPoint[1] - endPoint[1]];
  let bezStartLen = Math.sqrt(bezStart[0]*bezStart[0]+bezStart[1]*bezStart[1]);
  let bezEndLen = Math.sqrt(bezEnd[0]*bezEnd[0]+bezEnd[1]*bezEnd[1]);
  let bezStartNorm = [bezStart[0]/bezStartLen, bezStart[1]/bezStartLen];
  let bezEndNorm = [bezEnd[0]/bezEndLen, bezEnd[1]/bezEndLen];
  let startHeadVec = [-bezStartNorm[0], -bezStartNorm[1]];
  let endHeadVec = [-bezEndNorm[0], -bezEndNorm[1]];
  let startNormal = [startHeadVec[1], -startHeadVec[0]];
  let endNormal = [endHeadVec[1], -endHeadVec[0]];

  let arcStart = [
    startPoint[0] + bezStartNorm[0]*p.length*((p.start?1:0)+p.padding),
    startPoint[1] + bezStartNorm[1]*p.length*((p.start?1:0)+p.padding)
  ];
  let arcEnd = [
    endPoint[0] + bezEndNorm[0]*p.length*((p.end?1:0)+p.padding),
    endPoint[1] + bezEndNorm[1]*p.length*((p.end?1:0)+p.padding)
  ];
  // readjust bezier curve now that the arrow heads push inwards
  vector = [arcEnd[0]-arcStart[0], arcEnd[1]-arcStart[1]];
  perpendicular = [vector[1], -vector[0]];
  midpoint = [arcStart[0] + vector[0]/2, arcStart[1] + vector[1]/2];
  bezPoint = [
    midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
    midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
  ];
  // done adjust

  let controlStart = [
    arcStart[0] + (bezPoint[0] - arcStart[0]) * p.pinch,
    arcStart[1] + (bezPoint[1] - arcStart[1]) * p.pinch
  ];
  let controlEnd = [
    arcEnd[0] + (bezPoint[0] - arcEnd[0]) * p.pinch,
    arcEnd[1] + (bezPoint[1] - arcEnd[1]) * p.pinch
  ];


  let startHeadPoints = [
    [arcStart[0]+startNormal[0]*-p.width, arcStart[1]+startNormal[1]*-p.width],
    [arcStart[0]+startNormal[0]*p.width, arcStart[1]+startNormal[1]*p.width],
    [arcStart[0]+startHeadVec[0]*p.length,arcStart[1]+startHeadVec[1]*p.length]
  ];
  let endHeadPoints = [
    [arcEnd[0]+endNormal[0]*-p.width, arcEnd[1]+endNormal[1]*-p.width],
    [arcEnd[0]+endNormal[0]*p.width, arcEnd[1]+endNormal[1]*p.width],
    [arcEnd[0]+endHeadVec[0]*p.length, arcEnd[1]+endHeadVec[1]*p.length]
  ];

  // draw
  let arrowGroup = window.document.createElementNS(svgNS, "g");
  let arrowArc = bezier(
    arcStart[0], arcStart[1], controlStart[0], controlStart[1],
    controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]
  );
  arrowArc.setAttribute("style", arrowStroke);
  arrowGroup.appendChild(arrowArc);
  if (p.start) {
    let startHead = polygon(startHeadPoints);
    startHead.setAttribute("style", arrowFill);
    arrowGroup.appendChild(startHead);
  }
  if (p.end) {
    let endHead = polygon(endHeadPoints);
    endHead.setAttribute("style", arrowFill);
    arrowGroup.appendChild(endHead);
  }

  // ///////////////
  // debug
  // let debugYellowStyle = "stroke:#ecb233;stroke-width:0.005";
  // let debugBlueStyle = "stroke:#224c72;stroke-width:0.005";
  // let debugRedStyle = "stroke:#e14929;stroke-width:0.005";
  // arrowGroup.line(arcStart[0], arcStart[1], arcEnd[0], arcEnd[1])
  //  .setAttribute("style", debugYellowStyle);

  // arrowGroup.line(arcStart[0], arcStart[1], bezPoint[0], bezPoint[1])
  //  .setAttribute("style", debugBlueStyle);
  // arrowGroup.line(arcEnd[0], arcEnd[1], bezPoint[0], bezPoint[1])
  //  .setAttribute("style", debugBlueStyle);
  // arrowGroup.line(arcStart[0], arcStart[1], controlStart[0], controlStart[1])
  //  .setAttribute("style", debugRedStyle);
  // arrowGroup.line(arcEnd[0], arcEnd[1], controlEnd[0], controlEnd[1])
  //  .setAttribute("style", debugRedStyle);
  // arrowGroup.line(controlStart[0], controlStart[1], controlEnd[0], controlEnd[1])
  //  .setAttribute("style", debugRedStyle);

  return arrowGroup;
};
