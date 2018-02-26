/*
Button booleans
This will help identify what button was clicked and what to draw
*/
var b_line = false;
var b_circle = false;
//var b_ellipse = false;
//var b_rectangle = false;
//var b_polygon = false;
//var b_polyline = false;


/*
Button elements + event listeners for each of the buttons
*/

var line = document.getElementById('start_line');
if(line){
line.addEventListener('click', function() {
                    b_line = true;
    
                      });
}

var circle = document.getElementById('start_circle');
if(circle){
circle.addEventListener('click', function() {
                    b_circle = true;
    console.log('here');
                      });
}
//var ellipse = document.getElementById('start_ellipse');
//var rectangle = document.getElementById('start_rectangle');
//var polygon = document.getElementById('start_polygon');
//var polyline = document.getElementById('start_polyline');


/*
    Other variables that need to be used globally
*/
var x1 = -1, y1 = -1, x2 = -1, y2 = -1, originX = -1, originY = -1;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

var pxl = 1;

function coordMouse(event) {
  return {x: event.offsetX, y: event.offsetY};
}


function clickM(event) {
  var coord = coordMouse(event);
    
  var x = coord.x;
  var y = coord.y;
    
  ctx.putImageData(imageData, 0, 0);
  
  if (x1 == -1 && y1 == -1 && (b_line || b_circle)) {
    x1 = x;
    y1 = y;
  
  } else {
    x2 = x;
    y2 = y;
    
    if (b_line) {
      b_line = false;
      lineDraw(x1, y1, x2, y2);
        x1 = -1;
        x2 = -1;
        y1 = -1;
        y2 = -1;
        originX = -1;
        originY = -1;
    }
    else if (b_circle) {
        b_circle = false;
        // r = sqrt(((x2 - x1)^2) + ((y2 - y1)^2)) [Pyth Theorem to find radius]
        var r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        circleDraw(x1, y1, r);
        x1 = -1;
        x2 = -1;
        y1 = -1;
        y2 = -1;
        r = -1;
        
    }
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}canvas.addEventListener('click', clickM);

/*
    Drawing a pixel is filling one rectangle of 1 * 1 pixels
    ***primitive function***
*/
function pixelDraw(x,y)
{
    ctx.fillRect(x, y, pxl, pxl)
}


/*
    Used http://www.mat.univie.ac.at/~kriegl/Skripten/CG/node25.html
    and 
    https://www.youtube.com/watch?v=Pe5n-AnTgwc to try and understand the midpoint algorithms
    then gave up and used the algorithm at
    https://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
    
*/
function lineDraw (x1, y1, x2, y2)
{
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
 
    while( true ){
        pixelDraw(x1, y1);
        if ( (x1 == x2) && (y1 == y2) ) break;
        var e2 = 2 * err;
        if (e2 > -dy) { 
            err -= dy; 
            x1  += sx; 
        }
        if (e2 < dx) { 
            err += dx; 
            y1  += sy; 
        }
    }
}
                
/*
    https://en.wikipedia.org/wiki/Midpoint_circle_algorithm
    modified algorithm at the wikipedia website
*/

function circleDraw (x0, y0, radius)
{
    
 var x = radius;
  var y = 0;
  var radiusError = 1 - x;
  
  while (x > y) {
    pixelDraw(x + x0, y + y0);
    pixelDraw(y + x0, x + y0);
    pixelDraw(-x + x0, y + y0);
    pixelDraw(-y + x0, x + y0);
    pixelDraw(-x + x0, -y + y0);
    pixelDraw(-y + x0, -x + y0);
    pixelDraw(x + x0, -y + y0);
    pixelDraw(y + x0, -x + y0);
    y++;
    
    if (radiusError < 0) {
        radiusError += 2 * y + 1;
    }
    else {
        x--;
        radiusError+= 2 * (y - x + 1);
    }
  }
}