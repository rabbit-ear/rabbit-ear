
export function XY(){
	let _x = 0;
	let _y = 0;

	let params = Array.from(arguments);
	// let functions = params.filter((arg) => typeof arg === "function");
	let numbers = params.filter((arg) => !isNaN(arg));
	// let element = params.filter((arg) => arg instanceof HTMLElement).shift();
	if(numbers.length >= 2){
		_x = numbers[0];
		_y = numbers[1];
	}

	const normalize = function(){
		let mag = Math.sqrt( Math.pow(_x,2) + Math.pow(_y,2) );
		return XY(_x / mag, _y / mag);
	}

	return Object.freeze({
		normalize,
		get x() { return _x; },
		get y() { return _y; },
	});
}
