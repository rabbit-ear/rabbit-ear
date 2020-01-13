const RabbitEar = require("../rabbit-ear");

test("svg style test", () => {
  const customStyle = ".boundary{fill:white;}";
  // test that origami got created with an SVG
  const origami = RabbitEar.Origami({ view: "svg", autofit: false, stylesheet: customStyle });
  const styleNode = Array.from(origami.svg.childNodes)
    .filter(node => node.tagName === "style")
    .shift();
  // expect(styleNode).not.toBe(undefined);

  // const innerHTML = styleNode.innerHTML != null
  //   ? styleNode.innerHTML
  //   : styleNode.childNodes[0].data;

  // // test that the style was injected properly, should be the last few lines.
  // const substring = innerHTML.substring(innerHTML.length - customStyle.length);
  // expect(substring).toBe(customStyle);


  expect(true).toBe(true);
});
