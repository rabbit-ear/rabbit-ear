
// 1) include this anywhere in your .html
// 2) the callback function is "fileBlobLoaded(blob)". Implement it

// create a div for the drop zone: <div id="dropZone"></div>
var dropZone = document.createElement("div");
dropZone.innerHTML = "";
dropZone.id = "dropZone"
dropZone.style = "background: black; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999; opacity: 0.6; visibility: hidden;";
document.getElementsByTagName('body')[0].appendChild(dropZone);
// or capture it if it already exists
// var dropZone = document.getElementById('dropZone');

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
		//create closure
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
			var bin = this.result;
			var decoded = window.atob(this.result.substring(26));
			fileBlobLoaded(decoded);
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
	// w3c
	if (obj.addEventListener){ obj.addEventListener(evt, handler, false); }
	// ie
	else if (obj.attachEvent) { obj.attachEvent('on' + evt, handler); }
	// old
	else { obj['on' + evt] = handler; }
}
