const JSONPanel = function (parent) {
  const { jsonView } = window;

  const panel = document.createElement("div");
  panel.setAttribute("class", "grid-json code");
  parent.appendChild(panel);

  // json code section
  const pre = document.createElement("pre");
  const div = document.createElement("div");
  div.setAttribute("class", "root");
  pre.appendChild(div);
  panel.appendChild(pre);

  const load = function (json) {
    // make the display JSON nice
    const data = JSON.parse(json);
    delete data["faces_re:matrix"];
    delete data["faces_re:layer"];
    const codeWindow = document.querySelectorAll(".root")[0];
    while (codeWindow.children.length > 0) {
      codeWindow.removeChild(codeWindow.children[0]);
    }
    jsonView.format(JSON.stringify(data), ".root");
    const first = document.querySelectorAll(".root")[0].childNodes[0];
    if (first) {
      first.querySelectorAll(".json-type")[0].innerHTML = "FOLD representation";
      first.querySelectorAll(".json-size")[0].innerHTML = "";
    }
  };

  return {
    panel,
    load
  };
};
