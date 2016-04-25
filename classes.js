'use strict';

//Colors
var black = '#000000';
var grey = '#BBBBBB';


//classes + functions

function View(settings) {
	this.canvas = document.getElementById(settings.canvasId);
	this.ctx = canvas.getContext("2d");
	this.width = canvas.width;
	this.height = canvas.height;
	this.shapes = [];
	this.d = settings.d;
	this.origin = settings.origin;
	this.xUnit = settings.xUnit;
	this.yUnit = settings.yUnit;
	this.zUnit = settings.zUnit;
	this.drawCross();
}

View.prototype.getProjectionMatrix = function() {
	var m = [
		[this.xUnit[0], 		this.yUnit[0],   		this.zUnit[0],   		    this.origin.x],
		[this.xUnit[1], 		this.yUnit[1],   		this.zUnit[1],   		    this.origin.y],
		[0,             		0,               		0,          	  		                0],
		[this.zUnit[0]/this.d,  this.zUnit[1]/this.d,   (1-this.zUnit[2])/this.d, 	this.origin.w]
	];
	console.log(m);
	return m;
}

View.prototype.drawCross = function() {
	//x-as tekenen
	this.renderLine(0, this.origin.y, this.width, this.origin.y, {
		color: grey,
		width: 1
	});
	//y-as tekenen
	this.renderLine(this.origin.x, 0, this.origin.x, this.height, {
		color: grey,
		width: 1
	});
}

View.prototype.drawLine = function(line) {
	var v1 = line.p1.toVector();
	var v2 = line.p2.toVector();
	var proj1 = multiplyMatrix(v1, this.getProjectionMatrix());
	var proj2 = multiplyMatrix(v2, this.getProjectionMatrix());
	this.renderLine(proj1[0][0], proj1[1][0], proj2[0][0], proj2[1][0]);
}

View.prototype.drawShape = function(shape) {
	var draw = this.drawLine.bind(this);
	shape.lines.forEach(draw);
}

View.prototype.addShape = function(shape) {
	this.shapes.push(shape);
	this.invalidate();
}

View.prototype.invalidate = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
	this.drawCross();
	var draw = this.drawShape.bind(this);
	this.shapes.forEach(draw);
}

View.prototype.renderLine = function(x1, y1, x2, y2, settings) {
	this.ctx.beginPath();
	settings = settings || {};
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.strokeStyle = settings.color || black;
	this.ctx.lineWidth = settings.width || 2;
	this.ctx.stroke();
}


function Shape(lines) {
	this.lines = lines;
	this.transformation = new Transformation();
}

Shape.prototype.transform = function() {
	var self = this;
	this.lines.forEach(function(line) {
		line.transform(self.transformation);
	});
}

function Line(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
}

Line.prototype.transform = function(transformation) {
	this.p1.transform(transformation);
	this.p2.transform(transformation);
}

function Point(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = 1;
}

Point.prototype.transform = function(transformation) {
	var result = multiplyMatrix(this.toVector(), transformation.matrix);
	this.x = result[0][0];
	this.y = result[1][0];
	this.z = result[2][0];
	this.w = result[3][0];
}

Point.prototype.toVector = function() {
	return [
		[this.x],
		[this.y],
		[this.z],
		[this.w]
	];
}

function Transformation() {
	this.thetaX = this.thetaY = this.thetaZ = 0;
	this.scaleX = this.scaleY = this.scaleZ = 1;
	this.transX = this.transY = this.transZ = 0;
	this.refreshXRot();
	this.refreshYRot();
	this.refreshZRot();
	this.refreshScaleTrans();
	this.refreshMatrix();
}

Transformation.prototype.refreshXRot = function() {
	var delta = this.thetaX / 1000;
	this.xRotation = [
		[1, 0,               0,                0],
		[0, Math.cos(delta), -Math.sin(delta), 0],
		[0, Math.sin(delta), Math.cos(delta),  0],
		[0, 0,               0,                1],
	];
}

Transformation.prototype.refreshYRot = function() {
	var delta = this.thetaY / 1000;
	this.yRotation = [
		[Math.cos(delta), 		0,     Math.sin(delta),          0],
		[0, 					1, 	   0, 						 0],
		[-Math.sin(delta),		0, 	   Math.cos(delta),  		 0],
		[0, 					0,     0,                		 1],
	];
}

Transformation.prototype.refreshZRot = function() {
	var delta = this.thetaZ / 1000;
	this.zRotation = [
		[Math.cos(delta), -Math.sin(delta), 0, 0],
		[Math.sin(delta), Math.cos(delta),  0, 0],
		[0,               0,                1, 0],
		[0,               0,                0, 1]
	];
}

Transformation.prototype.refreshScaleTrans = function() {
	this.scaleTranslateMatrix = [
		[this.scaleX, 0, 0, this.transX],
		[0, this.scaleY, 0, this.transY],
		[0, 0, this.scaleZ, this.transZ],
		[0, 0, 0, 1]
	];
}

Transformation.prototype.refreshMatrix = function() {
	this.matrix = multiplyMatrix(this.scaleTranslateMatrix, multiplyMatrix(this.xRotation, multiplyMatrix(this.yRotation, this.zRotation)));
}

function multiplyMatrix(m1, m2) {
    var result = [];
    for(var j = 0; j < m2.length; j++) {
        result[j] = [];
        for(var k = 0; k < m1[0].length; k++) {
            var sum = 0;
            for(var i = 0; i < m1.length; i++) {
                sum += m1[i][k] * m2[j][i];
            }
            result[j].push(sum);
        }
    }
    return result;
}