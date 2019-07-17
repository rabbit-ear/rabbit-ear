const RabbitEar = require("../rabbit-ear");

test("svg style test", () => {
  // test that origami got created with an SVG
  const origami = RabbitEar.Origami({ view: "svg", autofit: false, style: ".boundary{fill:white;}" });
  const styleNode = Array.from(origami.svg.childNodes)
    .filter(node => node.tagName === "style")
    .shift();
  expect(styleNode).not.toBe(undefined);

  // test that the style was injected properly, should be the last few lines.
  const matchString = ".boundary{fill:white;}";
  const substring = styleNode.innerHTML.substring(styleNode.innerHTML.length - matchString.length);
  expect(substring).toBe(matchString);
});
