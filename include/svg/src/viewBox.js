/**
 * SVG in Javascript (c) Robby Kraft
 */

export const setViewBox = function (svg, x, y, width, height, padding = 0) {
  const scale = 1.0;
  const d = (width / scale) - width;
  const X = (x - d) - padding;
  const Y = (y - d) - padding;
  const W = (width + d * 2) + padding * 2;
  const H = (height + d * 2) + padding * 2;
  const viewBoxString = [X, Y, W, H].join(" ");
  svg.setAttributeNS(null, "viewBox", viewBoxString);
};

const setDefaultViewBox = function (svg) {
  const size = svg.getBoundingClientRect();
  const width = (size.width === 0 ? 640 : size.width);
  const height = (size.height === 0 ? 480 : size.height);
  setViewBox(svg, 0, 0, width, height);
};

export const getViewBox = function (svg) {
  const vb = svg.getAttribute("viewBox");
  return (vb == null
    ? undefined
    : vb.split(" ").map(n => parseFloat(n)));
};

export const scaleViewBox = function (svg, scale, origin_x = 0, origin_y = 0) {
  if (scale < 1e-8) { scale = 0.01; }
  const matrix = svg.createSVGMatrix()
    .translate(origin_x, origin_y)
    .scale(1 / scale)
    .translate(-origin_x, -origin_y);
  const viewBox = getViewBox(svg);
  if (viewBox == null) {
    setDefaultViewBox(svg);
  }
  const top_left = svg.createSVGPoint();
  const bot_right = svg.createSVGPoint();
  [top_left.x, top_left.y] = viewBox;
  bot_right.x = viewBox[0] + viewBox[2];
  bot_right.y = viewBox[1] + viewBox[3];
  const new_top_left = top_left.matrixTransform(matrix);
  const new_bot_right = bot_right.matrixTransform(matrix);
  setViewBox(svg,
    new_top_left.x,
    new_top_left.y,
    new_bot_right.x - new_top_left.x,
    new_bot_right.y - new_top_left.y);
};

export const translateViewBox = function (svg, dx, dy) {
  const viewBox = getViewBox(svg);
  if (viewBox == null) {
    setDefaultViewBox(svg);
  }
  viewBox[0] += dx;
  viewBox[1] += dy;
  svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
};

export const convertToViewBox = function (svg, x, y) {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
  const array = [svgPoint.x, svgPoint.y];
  array.x = svgPoint.x;
  array.y = svgPoint.y;
  return array;
};
