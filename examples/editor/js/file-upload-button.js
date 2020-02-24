// file upload button manager
//
// 1) implement the callback function "fileDidLoad(blob, mimeType, filename, fileExtension)"
// 2) create an element: <a href="#" id="load-file">Open File</a>

// creates an input dialog button
(function () {
  var fileDialogButton = document.createElement("input");
  fileDialogButton.setAttribute("type", "file");
  fileDialogButton.setAttribute("id", "files");
  fileDialogButton.setAttribute("style", "display:none;");
  document.body.appendChild(fileDialogButton);

  document.getElementById("load-file").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("files").click();
  });

  document.getElementById("files").onchange = function () {
    var files = document.getElementById("files").files;
    var file = files[0];
    // if they selected cancel
    if (!file) { return; }
    var reader = new FileReader();
    reader.onloadend = function (evt) {
      if (evt.target.readyState === FileReader.DONE) {
        // byte range: ['Read ', file.size, ' byte file'].join('');
        fileDidLoad(evt.target.result, file.type, file.name, file.name.substr((file.name.lastIndexOf(".") + 1)));
      }
    };
    var blob = file.slice(0, file.size);
    reader.readAsBinaryString(blob);
    // reader.readAsText(file);
  };
}());
