
function Gaussian(median, sigma2){
	this.median = median;
	this.sigma2 = sigma2

	this.minX = -10;
    this.minY = -10;
    this.maxX = 10;
    this.maxY = 10;

	this.iteration = 0.1;

	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');


	this.canvas.width = 500;
	this.canvas.height = 500;

	this.scaleX = this.canvas.width / (this.maxX - this.minX);
    this.scaleY = this.canvas.height / (this.maxY - this.minY);

   this.centerY = Math.abs(this.minY / (this.maxY - this.minY)) * this.canvas.height;
    this.centerX = Math.abs(this.minX / (this.maxX - this.minX)) * this.canvas.width;
}

Gaussian.prototype.transformContext = function(){
    var canvas = this.canvas;
    var context = this.ctx;

    // move context to center of canvas
    this.ctx.translate(this.centerX, this.centerY);

    // stretch grid to fit the canvas window, and 
    // invert the y scale so that that increments
    // as you move upwards
    context.scale(this.scaleX, -this.scaleY);
};

Gaussian.prototype.plot = function(target, color, thickness){
    var canvas = this.canvas;
    var context = this.ctx;

 	var mu = this.median;
	var sigma2 = this.sigma2;

	// Store the current transformation matrix
	this.ctx.save();

	// Use the identity matrix while clearing the canvas
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	this.ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	this.ctx.restore();

	context.save();
    this.transformContext();

    context.beginPath();

	var p1 = 1.0/Math.sqrt(2.0*Math.PI*sigma2);

 //   context.moveTo(this.minX, 100*p1*Math.exp((-0.5*Math.pow((this.minX-mu),2.0)) / sigma2));

    for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
		var p2 = Math.exp((-0.5*Math.pow((x-mu),2.0)) / sigma2);
		context.lineTo(x, 10*p1*p2);
    }

    context.restore();
    context.lineJoin = "round";
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();

	target.getContext("2d").drawImage(canvas, 0, 0);

	//console.log("Done");

};

Gaussian.prototype.isPointInPath = function(x,y){
    var canvas = this.canvas;
    var context = this.ctx;

 	return context.isPointInPath(x,y);

};

Gaussian.prototype.isInCircle = function(xc,yc,radius){
    var canvas = this.canvas;
    var context = this.ctx;

var mu = this.median;
var sigma2 = this.sigma2;

	var p1 = 1.0/Math.sqrt(2.0*Math.PI*this.sigma2);


    xc = xc - this.minX;
    yc = yc - 100*p1*Math.exp((-0.5*Math.pow((this.minX-mu),2.0)) / sigma2);

    for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {

		var p2 = Math.exp((-0.5*Math.pow((x-mu),2.0)) / sigma2);

	 	var d = Math.sqrt(Math.pow(xc - x, 2) + Math.pow(yc - 10*p1*p2, 2))



		if(d < radius){
		// console.log("##########################"+d < radius);
			return true;
		}

    }

    //console.log(xc+" "+yc+" "+x+" "+10*p1*p2);

	return false;
};

Gaussian.prototype.join = function(gaussian){

	var n_mu = (this.median * gaussian.sigma2 + this.sigma2 * gaussian.median) / (this.sigma2 + gaussian.sigma2);

	var n_sigma2 = 1 / ((1 / gaussian.sigma2) + (1/ this.sigma2));

	return new Gaussian(n_mu,n_sigma2);

};

function Graph(config){
    this.canvas = config.canvas;
    this.minX = config.minX;
    this.minY = config.minY;
    this.maxX = config.maxX;
    this.maxY = config.maxY;

    this.context = this.canvas.getContext("2d");
    this.centerY = Math.abs(this.minY / (this.maxY - this.minY)) * this.canvas.height;
    this.centerX = Math.abs(this.minX / (this.maxX - this.minX)) * this.canvas.width;
    this.iteration = 0.1;
    this.numXTicks = 10;
    this.numYTicks = 10;
    this.xTickHeight = 20;
    this.yTickWidth = 20;
    this.scaleX = this.canvas.width / (this.maxX - this.minX);
    this.scaleY = this.canvas.height / (this.maxY - this.minY);
    this.axisColor = "#aaa";

    // draw x y axis and tick marks
    this.drawXAxis();
    this.drawYAxis();
    this.drawXAxisTicks();
    this.drawYAxisTicks();
}

Graph.prototype.drawXAxis = function(){
    var context = this.context;
    context.beginPath();
    context.moveTo(0, this.centerY);
    context.lineTo(this.canvas.width, this.centerY);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();
};

Graph.prototype.drawYAxis = function(){
    var context = this.context;
    context.beginPath();
    context.moveTo(this.centerX, 0);
    context.lineTo(this.centerX, this.canvas.height);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();
};

Graph.prototype.drawXAxisTicks = function(){
    var context = this.context;
    var xInterval = this.canvas.width / this.numXTicks;
    for (var n = xInterval; n < this.canvas.width; n += xInterval) {
        context.beginPath();
        context.moveTo(n, this.centerY - this.xTickHeight / 2);
        context.lineTo(n, this.centerY + this.xTickHeight / 2);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 2;
        context.stroke();
    }
};

Graph.prototype.drawYAxisTicks = function(){
    var context = this.context;
    var yInterval = this.canvas.height / this.numYTicks;
    for (var n = yInterval; n < this.canvas.height; n += yInterval) {
        context.beginPath();
        context.moveTo(this.centerX - this.yTickWidth / 2, n);
        context.lineTo(this.centerX + this.yTickWidth / 2, n);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 2;
        context.stroke();
    }
};

Graph.prototype.drawEquation = function(equation, color, thickness){
    var canvas = this.canvas;
    var context = this.context;

    context.save();
    this.transformContext();

    context.beginPath();
    context.moveTo(this.minX, equation(this.minX));

    for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
        context.lineTo(x, equation(x));
    }

    context.restore();
    context.lineJoin = "round";
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();

};

Graph.prototype.transformContext = function(){
    var canvas = this.canvas;
    var context = this.context;

    // move context to center of canvas
    this.context.translate(this.centerX, this.centerY);

    // stretch grid to fit the canvas window, and 
    // invert the y scale so that that increments
    // as you move upwards
    context.scale(this.scaleX, -this.scaleY);
};

window.onload = function(){
    var canvas = document.createElement('canvas');
 	var canvas2 = document.createElement('canvas');

		gauss = new Gaussian(-4,1.5);
		gauss2 = new Gaussian(2,4);
		gauss3 = gauss.join(gauss2);

		gauss.plot(document.getElementById('myCanvas'),"green", 3)
		gauss2.plot(document.getElementById('myCanvas'),"red", 3)
		gauss3.plot(document.getElementById('myCanvas'),"orange", 3)

		function getMousePos(canvas, evt){
		    // get canvas position
		    var obj = canvas;
		    var top = 0;
		    var left = 0;
		    while (obj && obj.tagName != 'BODY') {
		        top += obj.offsetTop;
		        left += obj.offsetLeft;
		        obj = obj.offsetParent;
		    }
		    
		   // console.log(evt.offsetX)
		    
		    // return relative mouse position
		    
		    var mouseX = evt.clientX - left + window.pageXOffset;
		    var mouseY = evt.clientY - top + window.pageYOffset;
		    
		    if(evt.offsetX) {
                mouseX = evt.offsetX;
                mouseY = evt.offsetY;
            }
            else if(evt.layerX) {
                mouseX = evt.layerX;
                mouseY = evt.layerY;
            }

		    return {
		        x: mouseX,
		        y: mouseY
		    };
		}

		var down = false;
		var down1 = false;
		var down2 = false;

		document.getElementById('myCanvas').onmousedown = function(evt){
			down = true;
		//	console.log("donw");
		};

		document.getElementById('myCanvas').onmouseup = function(evt){
			down = false;
			down1 = false;
			down2 = false;
		//	console.log("donw");
		};

		var prevMouse = {"x":0,"y":0}
		document.getElementById('myCanvas').addEventListener('mousemove',function(evt){
		        var mousePos = getMousePos(canvas, evt);

				if(gauss.isPointInPath(mousePos.x,mousePos.y) && down && !down2)
				 down1 = true;

				if(down1)
				{
					if(prevMouse.x > mousePos.x)
						gauss.median -= 0.3;
					if(prevMouse.x < mousePos.x)
						gauss.median += 0.3;
					if(prevMouse.y > mousePos.y)
						gauss.sigma2 -= 0.3;
					if(prevMouse.y < mousePos.y)
						gauss.sigma2 += 0.3;

    				if(gauss.median > 15)
    				    gauss.median = 15;
    				if(gauss.median < -5)
        			    gauss.median = -5;
        			if(gauss.sigma2 > 20)
        			    gauss.sigma2 = 20;
        			if(gauss.sigma2 < 0.3)
            		    gauss.sigma2 = 0.3;   				


document.getElementById('myCanvas').getContext("2d").clearRect ( 0 , 0 , 500 , 500 );

					gauss.plot(document.getElementById('myCanvas'),"green", 3)
					gauss2.plot(document.getElementById('myCanvas'),"red", 3)
					gauss.join(gauss2).plot(document.getElementById('myCanvas'),"orange", 3)
				}

				if(gauss2.isPointInPath(mousePos.x,mousePos.y) && down && !down1)
				down2 = true;

				if(down2){
					if(prevMouse.x > mousePos.x)
						gauss2.median -= 0.3;
					if(prevMouse.x < mousePos.x)
						gauss2.median += 0.3;
					if(prevMouse.y > mousePos.y)
						gauss2.sigma2 -= 0.3;
					if(prevMouse.y < mousePos.y)
						gauss2.sigma2 += 0.3;
					
    				if(gauss2.median > 5)
    				    gauss2.median = 5;
    				if(gauss2.median < -2)
        			    gauss2.median = -2;
        			if(gauss2.sigma2 > 20)
        			    gauss2.sigma2 = 20;
        			if(gauss2.sigma2 < 0.3)
            		    gauss2.sigma2 = 0.3;  
			

document.getElementById('myCanvas').getContext("2d").clearRect ( 0 , 0 , 500 , 500 );

					gauss.plot(document.getElementById('myCanvas'),"green", 3)
					gauss2.plot(document.getElementById('myCanvas'),"red", 3)
					gauss.join(gauss2).plot(document.getElementById('myCanvas'),"orange", 3)
				}

				prevMouse = mousePos;

				//console.log(gauss.isInCircle(mousePos.x/20,mousePos.y/20,10)+" "+down);

	        });

};