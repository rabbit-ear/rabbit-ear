import css_colors from "./css_colors";

const css_color_names = Object.keys(css_colors);

const hexToComponents = function (h) {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 255;
  // 3 digits
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  // 6 digits
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  } else if (h.length === 5) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
    a = `0x${h[4]}${h[4]}`;
  } else if (h.length === 9) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
    a = `0x${h[7]}${h[8]}`;
  }
  return [+(r / 255), +(g / 255), +(b / 255), +(a / 255)];
};

const color_to_assignment = function (string) {
  if (string == null || typeof string !== "string") {
    return "U";
  }
  // cannot discern between mark and boundary
  // boundary has to be decided by planar analysis
  let c = [0, 0, 0, 1];
  if (string[0] === "#") {
    c = hexToComponents(string);
  } else if (css_color_names.indexOf(string) !== -1) {
    c = hexToComponents(css_colors[string]);
  }
  const ep = 0.05;
  // black
  if (c[0] < ep && c[1] < ep && c[2] < ep) { return "U"; }
  // red and blue
  if (c[0] > c[1] && (c[0] - c[2]) > ep) { return "M"; }
  if (c[2] > c[1] && (c[2] - c[0]) > ep) { return "V"; }
  return "U";
};

export default color_to_assignment;
