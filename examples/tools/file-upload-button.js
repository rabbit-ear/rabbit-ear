// file upload button manager
//
// 1) implement the callback function is "fileDidLoad(blob, mimeType)"
// 2) create an element: <a href="#" id="load-file">Open File</a>

// creates an input dialog button
var fileDialogButton = document.createElement("input");
fileDialogButton.type = "file"
fileDialogButton.id = "files"
fileDialogButton.style = "display:none;";
document.body.appendChild(fileDialogButton);

document.getElementById("load-file").addEventListener("click", function(e){
	e.preventDefault();
	document.getElementById("files").click()
});
function getMimeOrExtension(file){
	if(file.type !== undefined && file.type !== ""){ return file.type; }
	if(file.name !== undefined){ return file.name.substr((file.name.lastIndexOf('.') + 1)); }
}
document.getElementById("files").onchange = function(){
	var files = document.getElementById('files').files;
	// if they selected cancel
	if (!files.length) { return; }
	var file = files[0];
	var reader = new FileReader();
	reader.onloadend = function(evt) {
		if (evt.target.readyState == FileReader.DONE){
			//byte range: ['Read ', file.size, ' byte file'].join('');
			fileDidLoad(evt.target.result, getMimeOrExtension(file));
		}
	};
	var blob = file.slice(0, file.size);
	reader.readAsBinaryString(blob);
	// reader.readAsText(file);
}
