// file upload button manager
//
// 1) implement the callback function "fileDidLoad(blob, mimeType, filename, fileExtension)"
// 2) create an element: <a href="#" id="load-file">Open File</a>

// creates an input dialog button
(function () {
  const fileDialogButton = document.createElement("input");
  fileDialogButton.type = "file";
  fileDialogButton.id = "files";
  fileDialogButton.style = "display:none;";
  document.body.appendChild(fileDialogButton);

  document.getElementById("load-file").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("files").click();
  });

  document.getElementById("files").onchange = function () {
    const { files } = document.getElementById("files");
    // if they selected cancel
    if (!files.length) { return; }
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = function (evt) {
      if (evt.target.readyState === FileReader.DONE) {
        // byte range: ['Read ', file.size, ' byte file'].join('');
        fileDidLoad(evt.target.result, file.type, file.name, file.name.substr((file.name.lastIndexOf(".") + 1)));
      }
    };
    const blob = file.slice(0, file.size);
    reader.readAsBinaryString(blob);
    // reader.readAsText(file);
  };
}());
