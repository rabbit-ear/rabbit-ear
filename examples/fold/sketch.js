
const origami = RabbitEar.Origami("crease-pattern", { padding: 0.1 });
const folded = RabbitEar.Origami("folded", { padding: 0.1, folding: true, autofit: false });
folded.fold();

function fileDidLoad(blob, mimeType, fileExtension) {
  origami.load(blob, function() {
    folded.load(origami);
    folded.preferences.autofit = true;
    folded.fold();
  });
}

folded.svg.onMouseMove = function (mouse) {
  if (mouse.isPressed) {
    origami.load(folded);
    origami.unfold();
  }
};
