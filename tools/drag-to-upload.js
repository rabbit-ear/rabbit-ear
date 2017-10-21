// drag-to-upload file
// 1) implement the callback function is "fileDidLoad(blob, mimeType)"

// creates a div for the drop zone
var dropZone = document.createElement("div");
dropZone.innerHTML = "";
dropZone.id = "drop-zone"
dropZone.style = "background: black; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999; opacity: 0.6; visibility: hidden; display:flex; align-items:center; justify-content:center;";
document.body.appendChild(dropZone);
var cutout = document.createElement("div");
cutout.style = "pointer-events:none; border-width: 15px; border-style: dashed; border-color: white; width:90%; height:90%;";
dropZone.appendChild(cutout);

function showDropZone() { dropZone.style.visibility = "visible"; }
function hideDropZone() { dropZone.style.visibility = "hidden"; }
function allowDrag(e) {
	if (true) {  // Test that the item being dragged is a valid one
		e.dataTransfer.dropEffect = 'copy';
		e.preventDefault();
	}
}
function handleDrop(e) {
	Function.prototype.bindToEventHandler = function bindToEventHandler() {
		var handler = this;
		var boundParameters = Array.prototype.slice.call(arguments);
		return function (e) {
			e = e || window.event; // get window.event if e argument missing (in IE)   
			boundParameters.unshift(e);
			handler.apply(this, boundParameters);
		}
	};
	e.preventDefault();
	hideDropZone();
	var dt = e.dataTransfer;
	var files = dt.files;
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		var reader = new FileReader();
		//attach event handlers here...  
		reader.readAsDataURL(file);
		addEventHandler(reader, 'loadend', function (e, file) {
			// mime type
			var colonIndex = this.result.indexOf(':');
			var semicolonIndex = this.result.indexOf(';');
			var mimeType = this.result.substr(colonIndex + 1, semicolonIndex - (colonIndex + 1));
			// strip type header block from base 64 contents
			var b64 = this.result.split(',')[1];
			var decoded = window.atob(b64);
			fileDidLoad(decoded, mimeType);
		}.bindToEventHandler(file));
	}
	return true;
}
window.addEventListener('dragenter', function(e) { showDropZone(); });
dropZone.addEventListener('dragenter', allowDrag);
dropZone.addEventListener('dragover', allowDrag);
dropZone.addEventListener('dragleave', function(e) { hideDropZone(); });
dropZone.addEventListener('drop', handleDrop);
function addEventHandler(obj, evt, handler) {
	if (obj.addEventListener){ obj.addEventListener(evt, handler, false); } // w3c
	else if (obj.attachEvent) { obj.attachEvent('on' + evt, handler); } // ie
	else { obj['on' + evt] = handler; } // old
}
