// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let seed = 0;

const grassColor = "#CCCB5F";
const skyColor = "#39ACFD";
let stoneColor = "#626C6D";
const treeColor = "#5B7545";

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// listener for reimagine button
$("#reimagine").click(function() {
  seed = millis();
});

// setup() function is called once when the program starts
function setup() {
  createCanvas(400, 200);
  
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);

  background(100);

  noStroke();

  fill(skyColor);
  rect(0, 0, width, height / 3  * 2);

  // clouds
  fill("#EEEEEE")
  const clouds = 20;
  for (let i = 0; i < clouds; i++) {
    let z = 1 + random();
    let x = width * ((random() + millis() / 400000.0) / z) % width;
    let y = height / 2 + height / 10 * random();
    let s = width / 10 / z; // Adjust size based on z
    ellipse(x, y, s, s / 2); // Ellipse shape for clouds
  }
  
  
  fill(grassColor);
  rect(0, height / 3  * 2, width, height / 3  * 2);
 
  fill(stoneColor)
  beginShape();
  const scrub = mouseX/width;
  vertex(width/3 + random() * width/20, height / 3  * 2);

  vertex(width/3 + random() * width/20 + width/20, height / 7 * 4);

  vertex(width/3 + random() * width/20 + width/10, height/10 + random() * height/20);
  vertex(width/3*2 - random() * width/20 - width/10 , height/10 + random() * height/20);

  vertex(width/3*2 - random() * width/20 - width/20 , height / 7 * 4);

  vertex(width/3*2 - random() * width/20, height / 3  * 2);
  endShape(CLOSE);

  fill(treeColor);
  const trees = 400*random();
  
  for (let i = 0; i < trees; i++) {
    let z = .1 + random();
    let x = width * ((random() + (scrub/50 + millis() / 500000.0) / z) % 1);
    let s = width / 50 / z;
    let y = height / 3  * 2 + height / 20 / z;
    triangle(x, y - s, x - s / 4, y, x + s / 4, y);
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}