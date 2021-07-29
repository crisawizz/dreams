/*****
* @author Cristina M. Iosifescu Enescu <ciosifescu@ethz.ch>
* Project Dream Cartography
* @copyright Institute of Cartography and Geoinformation, ETH Zurich, Switzerland
* Last modified: feb 28, 2018
*
*/

//http://perfectionkills.com/exploring-canvas-drawing-techniques/
//Simple pencil

//call brushType (canvas, context)
brushDrawing = function(canvas,context) {
	var el = canvas;
	var ctx = context;
	this.types = ["simple","drawStar","drawPixels","harmony","pattern","eraser"];
	this.currentType = "simple";
	this.isDrawing = false;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMousePos(evt) {
        var rect = el.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
	  
var points = [ ], radius = 15; 
var lastPoint;
	
function drawStar(options) {
  var length = 15;
  ctx.save();
  ctx.translate(options.x, options.y);
  ctx.beginPath();
  ctx.globalAlpha = options.opacity;
  ctx.rotate(Math.PI / 180 * options.angle);
  ctx.scale(options.scale, options.scale);
  ctx.strokeStyle = options.color;
  ctx.lineWidth = options.width;
  for (var i = 5; i--;) {
    ctx.lineTo(0, length);
    ctx.translate(0, length);
    ctx.rotate((Math.PI * 2 / 10));
    ctx.lineTo(0, -length);
    ctx.translate(0, -length);
    ctx.rotate(-(Math.PI * 6 / 10));
  }
  ctx.lineTo(0, length);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}



function addRandomPoint(mx,my) {
  points.push({ 
    x: mx, 
    y: my, 
    angle: getRandomInt(0, 180),
    width: getRandomInt(1,10),
    opacity: Math.random(),
    scale: getRandomInt(1, 20) / 10,
    color: ('rgb('+getRandomInt(0,255)+','+getRandomInt(0,255)+','+getRandomInt(0,255)+')')
  });
}

this.startBrush = function(x,y) {
	//this.isDrawing = true;
	//var mousePos = getMousePos(e);
	switch (this.currentType) {
	case "simple":
		ctx.globalCompositeOperation = "source-over";
		ctx.strokeStyle = document.getElementById("html5colorpicker").value; //black
		ctx.lineWidth = document.getElementById("html5lineWidth").value; //5;
		ctx.beginPath();
		ctx.moveTo(x, y);
		break;
	case "drawStar": 
		ctx.globalCompositeOperation = "source-over";
		addRandomPoint(x, y);
		break;
	case "drawPixels":
		ctx.globalCompositeOperation = "source-over";
		//ctx.lineJoin = ctx.lineCap = 'round';
		lastPoint = { x: x, y: y };
		break;
	case "harmony":
		ctx.globalCompositeOperation = "source-over";
		ctx.lineWidth = 1;
		ctx.lineJoin = ctx.lineCap = 'round';
		points = [ ];
		points.push({ x: x, y:y });
		break;
	case "pattern":
		ctx.globalCompositeOperation = "source-over";
		ctx.lineWidth = document.getElementById("html5lineWidth").value;//25;
		ctx.lineJoin = ctx.lineCap = 'round';
		ctx.strokeStyle = getPattern();
		points.push({ x: x, y: y });
		break;
	case "eraser":
		ctx.globalCompositeOperation = "destination-out";
		//ctx.strokeStyle = "black";
		ctx.lineWidth = document.getElementById("html5lineWidth").value;//5;
		ctx.beginPath();
		ctx.moveTo(x, y);
		break;
	default:
		ctx.moveTo(x, y);
	}
};
this.moveBrush = function(x,y) {
  //if (!this.isDrawing) return;
	//var mousePos = getMousePos(e);
  switch (this.currentType) {
	case "simple":
		//console.log("aici");
		ctx.lineTo(x, y);
		ctx.stroke();
		break;
	case "drawStar": 
		addRandomPoint(x, y);
		//ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		for (var i = 0; i < points.length; i++) {
			drawStar(points[i]);
		}
		break;
	case "drawPixels":
		drawPixels(x, y);
		lastPoint = { x: x, y: y };
		break;
	case "harmony":
		points.push({ x: x, y: y });
		drawHarmony();
		break;
	case "pattern":
		points.push({ x: x, y: y });
		//ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
		var p1 = points[0];
		var p2 = points[1];
  
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);

		for (var i = 1, len = points.length; i < len; i++) {
			var midPoint = midPointBtw(p1, p2);
			ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
			p1 = points[i];
			p2 = points[i+1];
		}
		ctx.lineTo(p1.x, p1.y);
		ctx.stroke();
		break;
	case "eraser":
		ctx.lineTo(x, y);
		ctx.stroke();
		break;
	default:
		//ctx.lineTo(mousePos.x, mousePos.y);
		
	}
  
};
this.stopBrush = function() {
  //this.isDrawing = false;
  points.length = 0;
  switch (this.currentType) {
	case "simple":
		break;
	case "drawStar": 
		//points.length = 0;
		break;
	case "drawPixels":
		break;
	case "harmony":
		//points.length = 0;
		break;
	case "pattern":
		lastpoint=[];
		//points.length = 0;
		break;
	case "eraser":
		break;
	default:
		;
	}
};   


//Pixels
function drawPixels(x, y) {
  //alert("cucu");
  for (var i = -10; i < 10; i+= 4) {
    for (var j = -10; j < 10; j+= 4) {
      if (Math.random() > 0.5) {
        ctx.fillStyle = ['red', 'orange', 'yellow', 'green', 
                         'light-blue', 'blue', 'purple'][getRandomInt(0,6)];
        ctx.fillRect(x+i, y+j, 4, 4);
      }
    }
  }
}




//Harmony
function drawHarmony() {
  ctx.beginPath();
  ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
  
  for (var i = 0, len = points.length; i < len; i++) {
    dx = points[i].x - points[points.length-1].x;
    dy = points[i].y - points[points.length-1].y;
    d = dx * dx + dy * dy;

    if (d < 1000) {
      ctx.beginPath();
	  var rgb = hexToRgb(document.getElementById("html5colorpicker").value);
	  ctx.strokeStyle = "rgba(" + rgb["r"] + "," +rgb["g"] + "," + rgb["b"] + ",0.3)";
      //ctx.strokeStyle = document.getElementById("html5colorpicker").value;
	  //ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.moveTo( points[points.length-1].x + (dx * 0.2), points[points.length-1].y + (dy * 0.2));
      ctx.lineTo( points[i].x - (dx * 0.2), points[i].y - (dy * 0.2));
      ctx.stroke();
    }
  }
}

//Pattern
function midPointBtw(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}
function getPattern() {
  var patternCanvas = document.createElement('canvas'),
      dotWidth = 20,
      dotDistance = 5,
      patternCtx = patternCanvas.getContext('2d');

  patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;

  patternCtx.fillStyle = document.getElementById("html5colorpicker").value;//'red';
  patternCtx.beginPath();
  patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
  patternCtx.closePath();
  patternCtx.fill();
  return ctx.createPattern(patternCanvas, 'repeat');
}




function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
}
