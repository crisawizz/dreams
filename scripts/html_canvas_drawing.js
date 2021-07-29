/*****
* @author Cristina M. Iosifescu Enescu <ciosifescu@ethz.ch>
* Project Dream Cartography
* @copyright Institute of Cartography and Geoinformation, ETH Zurich, Switzerland
* Last modified: feb 28, 2018
*
*/


var frame_canvas;
var frame_context;

var free_drawing_canvas;
var free_drawing_context;


var brush;
var backupImage = new Image();
var cPushArray = new Array();
var cStep = -1;
var dropPos;




/************************ Undo and Redo overlay canvas*****************/
/**https://www.codicode.com/art/undo_and_redo_to_the_html5_canvas.aspx*/

function cPush() {
//call cPush() after drawing something on the canvas to save the image into cPusArray vector
    cStep++;
	if (cStep > 0)
		document.getElementById("undo").style.color = "";
	 if (cStep < cPushArray.length) { cPushArray.length = cStep; }
    cPushArray.push(document.getElementById('Free_Drawing_Canvas').toDataURL());

	//console.log("push" + cPushArray.length + " cStep=" + cStep);
}

function cUndo() {
    if (cStep > 0) {
        cStep--;
        var canvasPic = new Image();
        if (cStep==0 && window.sessionStorage.freeDrawings) 
			canvasPic.src = window.sessionStorage.freeDrawings;
		else	
			canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { 
			//clearCanvas(); 
			free_drawing_context.clearRect(0, 0, free_drawing_canvas.width, free_drawing_canvas.height);
			free_drawing_context.drawImage(canvasPic, 0, 0); 
			}
		//console.log("executat undo cu cStep=" + cStep);
		document.getElementById("redo").style.color = "";
		if (cStep == 0) 
			document.getElementById("undo").style.color = "grey";
    }
		
}
function cRedo() {
//console.log("intrat in redo, exista " + cPushArray.length + " imagini salvate");
    if (cStep < cPushArray.length-1) {
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { 
			//clearCanvas();
			free_drawing_context.clearRect(0, 0, free_drawing_canvas.width, free_drawing_canvas.height);
			free_drawing_context.drawImage(canvasPic, 0, 0); 
			}
		document.getElementById("undo").style.color = "";
		if (cStep == cPushArray.length-1)
			document.getElementById("redo").style.color = "grey";
		//console.log("executat redo cu cStep=" + cStep);
    }
		
}	


/****************** Listen to Mouse or Touch events  ****/

/*********drag and drop image ****/
//https://hacks.mozilla.org/2012/02/creating-thumbnails-with-drag-and-drop-and-html5-canvas/
function handleDrop(evt) {
  evt.preventDefault();
  dropPos = getMousePos(evt);
}

var thumbwidth = 100;
var thumbheight = 100;
var crop = true;
var background = "transparent";
var jpeg = true;
var quality = 0.8;

function getDraggedImageFile(evt) {
  evt.preventDefault();
var file = evt.dataTransfer.files[0];
if ( file.type.indexOf( 'image' ) === -1 ) {  } else {
        var img = new Image();
        img.onload = function() {
			imagetocanvas( this, thumbwidth, thumbheight, crop, background );
        };
		img.src = URL.createObjectURL(file);
	}
}

function imagetocanvas( img, thumbwidth, thumbheight, crop, background ) {
  //free_drawing_context.drawImage();
  var dimensions = resize( img.width, img.height, thumbwidth, thumbheight );
    dimensions.x = dropPos.x-(dimensions.w/2);
    dimensions.y = dropPos.y-dimensions.h;
	
  free_drawing_context.drawImage(
    img, dimensions.x, dimensions.y, dimensions.w, dimensions.h
  );
  cPush();
}



function resize( imagewidth, imageheight, thumbwidth, thumbheight ) {
    var w = 0, h = 0, x = 0, y = 0,
        widthratio  = imagewidth / thumbwidth,
        heightratio = imageheight / thumbheight,
        maxratio    = Math.max( widthratio, heightratio );
    if ( maxratio > 1 ) {
        w = imagewidth / maxratio;
        h = imageheight / maxratio;
    } else {
        w = imagewidth;
        h = imageheight;
    }
    x = ( thumbwidth - w ) / 2;
    y = ( thumbheight - h ) / 2;
    return { w:w, h:h, x:x, y:y };
  }

 /********** call Brush drawing **********/

function handleStart(evt) {
  evt.preventDefault();
  var touchPos = getTouchPos(evt);
  brush.isDrawing = true;
  //free_drawing_context.moveTo(touchPos.x, touchPos.y);
  brush.startBrush(touchPos.x, touchPos.y);
  }
   		
function handleMove(evt) {
  evt.preventDefault();
  var touchPos = getTouchPos(evt);
  if (brush.isDrawing) {
	//free_drawing_context.lineTo(touchPos.x, touchPos.y);
	free_drawing_context.stroke();
	//free_drawing_context.stroke();
	brush.moveBrush(touchPos.x, touchPos.y);
	//console.log(evt.touches[0].clientX);
	}
  }

function handleEnd(evt) {
  evt.preventDefault();
  brush.isDrawing = false;
  brush.stopBrush();
  cPush();
  //console.log(evt.touches[0].clientX);
  }  
  
function handleCancel(evt) {
  evt.preventDefault();
	return;
}  		
										
function getMousePos(evt) {
		var rect = free_drawing_canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
function getTouchPos(evt) {
        var rect = free_drawing_canvas.getBoundingClientRect();
        return {
          x: evt.touches[0].clientX - rect.left,
          y: evt.touches[0].clientY - rect.top
        };
}	  
	

/*** called by button load brush**/	
function loadBrush() {
brush.currentType = document.getElementById("load_brush").value;
//alert(brush.currentType);
//document.getElementById("brush_img").src = document.getElementById("load_brush").dataSrc;
}


/*************************** Switch between drawing on canvas and ol map ************/		
/*now done with the sortable list named "canvases"
function updateCtrlsDrawingOrMap() {
//console.log("intru update");
var mapONvalue = document.getElementById('ctrls_map');
if (mapONvalue.checked) {
	//alert("map");
	document.getElementById("Free_Drawing_Canvas").style.pointerEvents = 'none';
	document.getElementById("addLandmark").disabled = '';
	}
	else  {
	//alert("draw");
	document.getElementById("Free_Drawing_Canvas").style.pointerEvents = 'auto';
	document.getElementById("addLandmark").disabled = 'disabled';
	}
	//set pointerevents=null
	//else remove pointerevents;
}*/

/**for displying the line width and color*/
function refreshCircle() {
var val = document.getElementById("html5lineWidth").value;
var cir = document.getElementById("svgcircle");
cir.setAttribute("r", val/2);
cir.style.fill = document.getElementById("html5colorpicker").value;
}

/*** called by button clear canvas**/	
function clearCanvas(ca,co) {
if (!ca) {
	ca = free_drawing_canvas;
	co = free_drawing_context; 
	}
co.clearRect(0, 0, ca.width, ca.height);
cPush();
}

/*** called by button greyscale canvas**/	
function greyscaleCanvas() {
//http://www.web-plus-plus.com/Articles/mastering-images-html5-canvas-1
//get image data object
var el = document.getElementById("greyscale");
//var butAnschrift = el.value;
if (backupImage) 
	if (free_drawing_canvas.toDataURL()==backupImage) {
		//console.log("trei");
		}
		
else {
	var butAnschrift = el.title;
//if (butAnschrift=="Greyscale") {
	//el.title = "Back to Color";
	//el.value = "Back to Color";
	//el.setAttribute("class","icon fa-circle");
	
	var imageData = free_drawing_context.getImageData(0, 0, free_drawing_canvas.width, free_drawing_canvas.height);
	backupImage = free_drawing_canvas.toDataURL();
 
	//get the pixels
	var data = imageData.data;
	for (var i = 0; i < data.length; i += 4) {
		//make some processing
		//calculate the luma value
		var luma = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
		//set it to RGB
		data[i] = Math.round(luma);
		data[i+1] = Math.round(luma);
		data[i+2] = Math.round(luma);
		}
 
	//put the pixels back onto canvas
	free_drawing_context.putImageData(imageData, 0, 0);
	//free_drawing_canvas.filter="saturate(6.2)";
	cPush();
	//}
	/*else if (backupimage){
		//el.value = "Greyscale";
		el.title = "Greyscale";
		el.setAttribute("class","icon fa-adjust");
		if (backupImage!=null) {
			var canvasPic = new Image();
			canvasPic.src = backupImage;
			canvasPic.onload = function () { 
				clearCanvas();
				free_drawing_context.drawImage(canvasPic, 0, 0); 
				}
			//free_drawing_context.putImageData(backupImage, 15, 15);
			cPush();
			}
	}*/
	}
}
	
function grey(pixels, data) {
for (var i = 0; i < pixels.length; i += 4) {
		//make some processing
		//calculate the luma value
		var luma = 0.299 * pixels[i] + 0.587 * pixels[i+1] + 0.114 * pixels[i+2];
		//set it to RGB
		pixels[i] = Math.round(luma);
		pixels[i+1] = Math.round(luma);
		pixels[i+2] = Math.round(luma);
		}
return(pixels);
}		

/********** for the frame canvas ************************/
/*
function updateFromRadio() {
update(document.getElementById('numSides').innerHTML);
}
function updateValue(newVal) {
document.getElementById("numSides").innerHTML=newVal;
update(newVal);
}

function update(newVal){
  context.clearRect(0, 0, canvas.width, canvas.height);
  var forma = document.getElementById("tip");
  //alert(forma.elements["tip"].value)
  if (forma.elements["tip"].value=="star")
	pathStar(context,newVal,calcPoints(newVal,.9,700,400))
	else 
	pathCloud(context,newVal,calcPoints(newVal,.75,800,500));
}
*/
function drawFrame() {
var layerId = "frame";
var existaFramecontext = true;
if (!frame_canvas) {
	frame_canvas = document.getElementById('Frame_Canvas');
	frame_context = frame_canvas.getContext('2d');
	}
var frameName = document.getElementById("load_frame").value;
switch(frameName) {
    case "spyglass":
        clearCanvas(frame_canvas,frame_context);
		drawSpyglass()
        break;
	case "mickeymouse":
        clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		drawMickeyMouseFrame()
        break;
    case "none":
		clearCanvas(frame_canvas,frame_context);
        break;
    case "star":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 15;
		frame_context.shadowOffsetX = -7;
		frame_context.shadowColor = "steelblue";
		pathStar(25,calcPoints(25,.8,true,frame_canvas.width, frame_canvas.height));
		break;
	case "cloud":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 40;
		frame_context.shadowOffsetX = -3;
		frame_context.shadowColor = "rgb(203,158,201)";
		pathCloud(20,calcPoints(20,.9,true,frame_canvas.width, frame_canvas.height));
		break;
	case "gold":
		clearCanvas(frame_canvas,frame_context);
		loadStrechedImage("images/frames/gold_frame.png");
		break;
	case "simple":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		drawDigitalFrame();
		break;
	case "old_film":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		drawFilmFrame();
		break;
	case "spiky":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		loadStrechedImage("images/frames/creepy_frame.png");
		break;
	case "anger":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		loadStrechedImage("images/frames/Playful_Pixar/anger_frame.png");
		break;
	case "disgust":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		loadStrechedImage("images/frames/Playful_Pixar/disgust_frame.png");
		break;
	case "excitement":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		loadStrechedImage("images/frames/Playful_Pixar/excitement_frame.png");
		break;
	case "fear":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		loadStrechedImage("images/frames/Playful_Pixar/fear_frame.png");
		break;
	case "joy":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		loadStrechedImage("images/frames/Playful_Pixar/joy_frame.png");
		break;
	case "sad":
		clearCanvas(frame_canvas,frame_context);
		frame_context.shadowBlur = 0;
		frame_context.shadowOffsetX = 0;
		loadStrechedImage("images/frames/Playful_Pixar/sad_frame.png");
		break;
	default:
        ;
	}

}

function drawSpyglass() {
var centerX = frame_canvas.width / 2;
var centerY = frame_canvas.height / 2;
var radius = Math.min(frame_canvas.width,frame_canvas.height)/2-5;

frame_context.beginPath();
frame_context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
frame_context.rect(frame_canvas.width,0,-frame_canvas.width,frame_canvas.height)
frame_context.fillStyle = "hsl(326,3%,97%)";
frame_context.globalAlpha = 0.9;
frame_context.fill()
										
frame_context.beginPath();
frame_context.arc(centerX, centerY, radius+2, 0, 2 * Math.PI, false);
frame_context.lineWidth = 5;
frame_context.strokeStyle = "black";
frame_context.stroke();
										
frame_context.beginPath();
frame_context.arc(centerX, centerY, radius-2, 1.1*Math.PI, 0.2*Math.PI, false);
frame_context.lineWidth = 5;
frame_context.strokeStyle = "rgba(14,42,124,0.9)";
frame_context.shadowBlur = 15;
frame_context.shadowOffsetX = -7;
frame_context.shadowColor = "rgba(14,42,230,1)";
frame_context.stroke();
										
frame_context.beginPath();
frame_context.arc(centerX, centerY, radius-2, 0.2*Math.PI, 1.1*Math.PI, false);
frame_context.lineWidth = 5;
frame_context.strokeStyle = "black";
frame_context.shadowBlur = 15;
//context.shadowOffsetX = 7;
frame_context.shadowColor = "rgba(131,98,56,1)";
frame_context.stroke();
}

function drawMickeyMouseFrame() {
var tenheight = frame_canvas.height / 10; //radius circle on conrners

frame_context.fillStyle = "hsl(326,3%,97%)";
frame_context.fillRect(0,0,frame_canvas.width,tenheight);
frame_context.fillRect(0,frame_canvas.height-tenheight,frame_canvas.width,tenheight);
frame_context.fillRect(0,tenheight,tenheight,frame_canvas.height);
frame_context.fillRect(frame_canvas.width-tenheight,0,tenheight,frame_canvas.height);
//frame_context.fill();

frame_context.beginPath();
frame_context.arc(tenheight, tenheight, tenheight, 0.5 * Math.PI , 2 * Math.PI, false);
var r = (frame_canvas.width/2 - (2*tenheight))/2;
var x = 2* tenheight;
var y = tenheight;
var y0 = 0 - tenheight/3;
frame_context.bezierCurveTo(x,y0, x+r*2, y0, x+r*2,y);
x += 2*r;
frame_context.bezierCurveTo(x,y0, x+r*2, y0, x+r*2,y);
x = 3*tenheight + 4*r;
frame_context.arc(x, tenheight, tenheight, Math.PI , 0.5 * Math.PI, false);
r = (frame_canvas.height/2 - (2*tenheight))/2;
x = frame_canvas.width-tenheight;
y = 2*tenheight;
var x0 = frame_canvas.width + tenheight/3;
frame_context.bezierCurveTo(x0,y, x0,y+r*2, x,y+r*2);
y = 2*tenheight + 2*r;
frame_context.bezierCurveTo(x0,y, x0,y+r*2, x,y+r*2);
x = frame_canvas.width-tenheight;
y = 3*tenheight + 4*r;
frame_context.arc(x, y, tenheight, 1.5*Math.PI , Math.PI, false);
r = (frame_canvas.width/2 - (2*tenheight))/2;
y0 = frame_canvas.height+tenheight/3;
x = x-tenheight;
frame_context.bezierCurveTo(x,y0, x-r*2, y0, x-r*2,y);
x -= 2*r;
frame_context.bezierCurveTo(x,y0, x-r*2, y0, x-r*2,y);
x = tenheight;
frame_context.arc(x, y, tenheight, 0*Math.PI , 1.5*Math.PI, false);
r = (frame_canvas.height/2 - (2*tenheight))/2;
x0 = 0 - tenheight/3;
y = 2*tenheight + 4*r;
frame_context.bezierCurveTo(x0,y, x0,y-r*2, x,y-r*2);
y -= 2*r;
frame_context.bezierCurveTo(x0,y, x0,y-r*2, x,y-r*2);
frame_context.fillStyle = "black";


frame_context.rect(frame_canvas.width-tenheight-5,tenheight+5,-1*(frame_canvas.width-2*tenheight-10),frame_canvas.height-2*tenheight-10);
frame_context.strokeStyle = "hsl(326,3%,97%)";
frame_context.lineWidth = 5;
frame_context.stroke();
frame_context.fill();
}

function calcPoints(numSides, Kernel,randoyes, width, height) {
//prepare the array of points
    var rayPoints = new Array(numSides);
	var rando;
    for (var i = 0; i < numSides; i++){
        var r = new Ray();
		var centerX =  width / 2;
		var centerY =  height / 2;
        r.rx = centerX * (1 + Math.cos(i * 2 * Math.PI / numSides));
        r.ry = centerY * (1 + Math.sin(i * 2 * Math.PI / numSides));
		if (randoyes)
			rando = Math.floor(Math.random() * 2);
			else rando =0;
		r.bx = centerX * (1 + (Kernel - rando/10) *
            Math.cos((Math.PI + i * 2 * Math.PI) / numSides));
        r.by = centerY * (1 + (Kernel - rando/10) *
            Math.sin((Math.PI + i * 2 * Math.PI) / numSides));
        rayPoints[i] = r;
    }
	return rayPoints;
}
function pathStar(numSides,points){

    //make the path
    frame_context.beginPath();
    frame_context.moveTo(points[0].rx, points[0].ry);
	
    for (var i = 0; i < numSides; i++){
        frame_context.lineTo(points[i].rx, points[i].ry);
        frame_context.lineTo(points[i].bx, points[i].by);
    }
    frame_context.closePath();
	frame_context.rect(frame_canvas.width,0,-frame_canvas.width,frame_canvas.height)

	frame_context.lineWidth = 3;
    frame_context.strokeStyle = 'turquoise';
    frame_context.stroke(); 
	
	frame_context.fillStyle = "hsl(326,3%,97%)";
	frame_context.globalAlpha = 0.9;
	frame_context.fill()
	
	//context.lineWidth = 5;
    //context.strokeStyle = 'blue';
    //context.stroke();
}

function pathCloud(numSides,points){

    //make the path
    frame_context.beginPath();
    frame_context.moveTo(points[numSides-1].bx, points[numSides-1].by);
	
    for (var i = 0; i < numSides; i++){
        frame_context.quadraticCurveTo(points[i].rx, points[i].ry, points[i].bx, points[i].by);
    }
    frame_context.closePath();

	frame_context.rect(frame_canvas.width,0,-frame_canvas.width,frame_canvas.height)
	frame_context.lineWidth = 5;
    frame_context.strokeStyle = "rgb(240,200,240)";
    frame_context.stroke();
	
	frame_context.fillStyle = "hsl(326,3%,97%)";
	frame_context.fill()
}

//star ray object
function Ray(){

    this.rx;  //vertex x
    this.ry;  //vertex y
    this.bx; // base x
    this.by;  //base y

}

function loadStrechedImage(url) {
	var imageObj = new Image();
    imageObj.onload = function() {
         frame_context.drawImage(this, 0, 0, frame_canvas.width, frame_canvas.height);
        };
    imageObj.src = url;
}

function drawDigitalFrame() {
	frame_context.beginPath();
	frame_context.rect(frame_canvas.width,0,-frame_canvas.width,frame_canvas.height);
	frame_context.lineWidth = 35;
	frame_context.strokeStyle = 'black';
	frame_context.stroke();
	var dime = 26;
	frame_context.rect(frame_canvas.width-dime,dime,-frame_canvas.width+2*dime,frame_canvas.height-2*dime);
	frame_context.lineWidth = 5;
    frame_context.strokeStyle = 'black';
    frame_context.stroke();
	
}

function getPatternLochs(h) {
  var patternCanvas = document.createElement('canvas'),
      lochWidth = h*0.30,
      lochDistance = h*0.50,
	  lochHeight = h*0.50,
	  lochVDistance = h*0.30
      patternCtx = patternCanvas.getContext('2d');

  patternCanvas.width =  h*1.20; //lochWidth + lochDistance + lineWidth;
  patternCanvas.height = h; //lochHeight + lochVDistance + lineWidth;
  
  patternCtx.fillStyle = 'white';
  patternCtx.lineJoin = "round";
  patternCtx.strokeStyle = 'white';
  patternCtx.lineWidth = h*0.2;
  patternCtx.beginPath();
  
  patternCtx.moveTo(lochDistance *0.75, lochVDistance*0.8);
  patternCtx.lineTo(lochDistance *0.75+lochWidth, lochVDistance*0.8);
  patternCtx.lineTo(lochDistance *0.75+lochWidth, lochVDistance*0.8+lochHeight);
  patternCtx.lineTo(lochDistance *0.75, lochVDistance*0.8+lochHeight);
  patternCtx.closePath();
  patternCtx.stroke();
  patternCtx.fill();
  return patternCtx.createPattern(patternCanvas, 'repeat');
}

function drawFilmFrame() {
	var septime = frame_canvas.height/9;
	septime = septime + (frame_canvas.height%9)/2;
	frame_context.beginPath();
	frame_context.rect(0,0,frame_canvas.width, septime);
	frame_context.rect(0,frame_canvas.height-septime,frame_canvas.width, septime);
	frame_context.fillStyle = 'black';
	frame_context.fill();
	
	frame_context.strokeStyle = 'black';
	frame_context.lineWidth = 15;
	frame_context.rect(15,septime,frame_canvas.width-30, frame_canvas.height-septime);
	frame_context.stroke();

	frame_context.beginPath();
	frame_context.rect(0,0,frame_canvas.width, septime);
	frame_context.rect(0,frame_canvas.height-septime,frame_canvas.width, septime);
	frame_context.fillStyle=getPatternLochs(septime);
	frame_context.fill();

}

function drawSpikyFrame() {
	var septime = frame_canvas.height/9;
	septime = septime + (frame_canvas.height%9)/2;
	frame_context.beginPath();
	frame_context.rect(0,0,frame_canvas.width, septime);
	frame_context.rect(0,frame_canvas.height-septime,frame_canvas.width, septime);
	frame_context.fillStyle = 'black';
	frame_context.fill();
	

}




/******** Auto-executing function ****************/
(function () {
	
	var byId = function (id) { return document.getElementById(id); },

		loadScripts = function (desc, callback) {
			var deps = [], key, idx = 0;

			for (key in desc) {
				deps.push(key);
			}

			(function _next() {
				var pid,
					name = deps[idx],
					script = document.createElement('script');

				script.type = 'text/javascript';
				script.src = desc[deps[idx]];

				pid = setInterval(function () {
					if (window[name]) {
						clearTimeout(pid);

						deps[idx++] = window[name];

						if (deps[idx]) {
							_next();
						} else {
							callback.apply(null, deps);
						}
					}
				}, 30);

				document.getElementsByTagName('head')[0].appendChild(script);
			})()
		},

		console = window.console;


	if (!console.log) {
		console.log = function () {
			alert([].join.apply(arguments, ' '));
		};
	}

})();

	
/******* Executes when the HTML Document DOM finished loading ******/
document.addEventListener("DOMContentLoaded", function () {	

	
var div = document.getElementById("map_container");	

/**** drawing overlay canvas ******
***** Overlay Canvas - to draw on it, independent of the openlayers map ****/
free_drawing_canvas = document.getElementById('Free_Drawing_Canvas');
free_drawing_context = free_drawing_canvas.getContext('2d');
free_drawing_canvas.width = div.clientWidth;
free_drawing_canvas.height = div.clientHeight;
free_drawing_canvas.addEventListener("touchstart", handleStart, false);
free_drawing_canvas.addEventListener("touchend", handleEnd, false);
free_drawing_canvas.addEventListener("touchcancel", handleCancel, false);
free_drawing_canvas.addEventListener("touchmove", handleMove, false);
free_drawing_canvas.addEventListener("dragover", handleDrop, false );
free_drawing_canvas.addEventListener("drop", getDraggedImageFile, false );
//document.getElementById("map_canvas").style.position = 'absolute';
document.getElementById("Map_Canvas").style.top = 0;
document.getElementById("Map_Canvas").style.left = 0;
free_drawing_context.lineWidth = 5;
free_drawing_context.strokeStyle = "black";
//alert(canvas.height+" "+ radius+ " " +canvas.width);

/*** frame canvas ***/
frame_canvas = document.getElementById('Frame_Canvas');
frame_context = frame_canvas.getContext('2d');
frame_canvas.width = div.clientWidth;
frame_canvas.height = div.clientHeight;
var fr = document.getElementById("Frame_Canvas");
fr.style.pointerEvents = 'none';
fr.style.zIndex=1;


					
/*** calls object brushDrawing *****/										
brush = new brushDrawing(free_drawing_canvas,free_drawing_context);	

//for Undo/Redo
cPush();
document.getElementById("undo").style.color="grey";
document.getElementById("redo").style.color="grey";


	
free_drawing_canvas.onmousedown = function(e) {
	brush.isDrawing = true;
	var mousePos = getMousePos(e);
	brush.startBrush(mousePos.x, mousePos.y);
}	
free_drawing_canvas.onmousemove = function(e) {
	var mousePos = getMousePos(e);
	if (brush.isDrawing) {
		brush.moveBrush(mousePos.x, mousePos.y);
		//free_drawing_context.lineTo(e.clientX, e.clientY);
		//free_drawing_context.stroke();
		}
	else return;
}

free_drawing_canvas.onmouseup = function(e) {
	brush.isDrawing = false;
	//var mousePos = getMousePos(e);
	brush.stopBrush();
	cPush();
}

	//document.getElementById("ctrls_map").setAttribute("onchange", "updateCtrlsDrawingOrMap()");
	document.getElementById("load_brush").setAttribute("onchange", "loadBrush()");
	document.getElementById("load_frame").setAttribute("onchange", "drawFrame()");
	document.getElementById("clear").setAttribute("onclick", "clearCanvas();");
	document.getElementById("greyscale").setAttribute("onclick", "greyscaleCanvas()");
	document.getElementById("undo").setAttribute("onclick", "cUndo();");	
	document.getElementById("redo").setAttribute("onclick", "cRedo();");	

}, false);





	
