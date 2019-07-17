const SVG_NS = "http://www.w3.org/2000/svg";

const shadowFilter = function (id_name = "shadow") {
  const filter = document.createElementNS(SVG_NS, "filter");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "200%");
  filter.setAttribute("id", id_name);

  const blur = document.createElementNS(SVG_NS, "feGaussianBlur");
  blur.setAttribute("in", "SourceAlpha");
  blur.setAttribute("stdDeviation", "0.01");
  blur.setAttribute("result", "blur");

  const offset = document.createElementNS(SVG_NS, "feOffset");
  offset.setAttribute("in", "blur");
  offset.setAttribute("result", "offsetBlur");

  const flood = document.createElementNS(SVG_NS, "feFlood");
  flood.setAttribute("flood-color", "#000");
  flood.setAttribute("flood-opacity", "0.4");
  flood.setAttribute("result", "offsetColor");

  const composite = document.createElementNS(SVG_NS, "feComposite");
  composite.setAttribute("in", "offsetColor");
  composite.setAttribute("in2", "offsetBlur");
  composite.setAttribute("operator", "in");
  composite.setAttribute("result", "offsetBlur");

  const merge = document.createElementNS(SVG_NS, "feMerge");
  const mergeNode1 = document.createElementNS(SVG_NS, "feMergeNode");
  const mergeNode2 = document.createElementNS(SVG_NS, "feMergeNode");
  mergeNode2.setAttribute("in", "SourceGraphic");
  merge.appendChild(mergeNode1);
  merge.appendChild(mergeNode2);

  filter.appendChild(blur);
  filter.appendChild(offset);
  filter.appendChild(flood);
  filter.appendChild(composite);
  filter.appendChild(merge);
  return filter;
};

export {
  shadowFilter,
};
