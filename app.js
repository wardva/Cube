//Points
//Lower square
var p0 = new Point(-100, -100, -100);
var p1 = new Point(-100, 100, -100);
var p2 = new Point(100, 100, -100);
var p3 = new Point(100, -100, -100);
//Upper square
var p4 = new Point(-100, -100, 100);
var p5 = new Point(-100, 100, 100);
var p6 = new Point(100, 100, 100);
var p7 = new Point(100, -100, 100);

//Lines
//Lower square
var l0 = new Line(p0, p1);
var l1 = new Line(p0, p3);
var l2 = new Line(p1, p2);
var l3 = new Line(p2, p3);
//Upper square
var l4 = new Line(p4, p5);
var l5 = new Line(p4, p7);
var l6 = new Line(p5, p6);
var l7 = new Line(p6, p7);
//Connections between square
var l8 = new Line(p0, p4);
var l9 = new Line(p1, p5);
var l10 = new Line(p2, p6);
var l11 = new Line(p3, p7);

//Making collection
var lines = [l0, l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11];

//Making the cube
var cube = new Shape(lines);

var view = new View({
	canvasId: 'canvas',
	origin: new Point(400,400,400),
	d: -200,
	xUnit: [1,0,0],
	yUnit: [0,1,0],
	zUnit: [0,0,1]
});

view.addShape(cube);
view.invalidate();

var transform = function() {
	cube.transform();
	view.invalidate();
}

var interval = setInterval(transform, 10);

function xOriginChange(value) {
	view.origin.x = value;
	view.invalidate();
}

function yOriginChange(value) {
	view.origin.y = value;
	view.invalidate();
}

function fpsChange(value) {
	clearInterval(interval);
	interval=setInterval(transform, 1000/value);
}

function rotChange(value, axis) {
	switch(axis) {
		case 'x': {
			cube.transformation.thetaX = value;
			cube.transformation.refreshXRot();
		} 
		case 'y': {
			cube.transformation.thetaY = value;
			cube.transformation.refreshYRot();
		} 
		case 'z': {
			cube.transformation.thetaZ = value;
			cube.transformation.refreshZRot();
		}
	}
	cube.transformation.refreshMatrix();
}

function transChange(value, axis) {
	switch(axis) {
		case 'x': {
			cube.transformation.transX = value;
		} 
		case 'y': {
			cube.transformation.transY = value;
		} 
		case 'z': {
			cube.transformation.transZ = value;
		}
	}
	cube.transformation.refreshScaleTrans();
	cube.transformation.refreshMatrix();
}

function scaleChange(value) {
	cube.transformation.scaleX = value;
	cube.transformation.scaleY = value;
	cube.transformation.scaleZ = value;
	cube.transformation.refreshScaleTrans();
	cube.transformation.refreshMatrix();
}

function dChange(value) {
	view.d = value;
}