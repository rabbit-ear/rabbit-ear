// file upload button manager
//
// 1) implement the callback function is "fileDidLoad(blob, mimeType)"
// 2) create an element: <a href="#" id="load-file">Open File</a>
//    (make sure this .js file is included AFTER that element)

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
document.addEventListener('change', function(){
	var input = $(this),
		numFiles = input.get(0).files ? input.get(0).files.length : 1,
		label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
	input.trigger('fileselect', [numFiles, label]);
	readBlob();
}, false);
function getMimeOrExtension(file){
	if(file.type !== undefined && file.type !== ""){ return file.type; }
	if(file.name !== undefined){ return file.name.substr((file.name.lastIndexOf('.') + 1)); }
}
function readBlob() {
	var files = document.getElementById('files').files;
	if (!files.length) {
		// they selected cancel
		return;
	}
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
}
