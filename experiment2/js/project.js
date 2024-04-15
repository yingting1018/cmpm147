// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
  let myInstance = new MyProjectClass("value1", "value2");
  /* exported setup, draw */
let seed = 0;

const grassColor = "#CCCB5F";
const skyColor = "#39ACFD";
const stoneColor = "#626C6D";
const treeColor = "#5B7545";

function setup() {  
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}



function draw() {
  randomSeed(seed);

  background(100);

  noStroke();

  
  fill(skyColor);
  rect(0, 0, width, height / 3  * 2);
  
  fill(grassColor);
  rect(0, height / 3  * 2, width, height / 3  * 2);
  
  fill(stoneColor);
  beginShape();
  vertex(random() * width/4, height / 3  * 2);
  vertex(width/4 + 50 + random() * 25, 20 + random() * 10);
  vertex(width/4*3 - 50 + random() * 25, 20 + random() * 10);
  vertex(width/4*3 + random() * 50, height / 3  * 2);
  endShape(CLOSE);

  fill(treeColor);
  const trees = 400*random();
  const scrub = mouseX/width;
  for (let i = 0; i < trees; i++) {
    let z = random();
    let x = width * ((random() + (scrub/50 + millis() / 500000.0) / z) % 1);
    let s = width / 50 / z;
    let y = height / 3  * 2 + height / 20 / z;
    triangle(x, y - s, x - s / 4, y, x + s / 4, y);
  }
}


  // call a method on the instance
  myInstance.myMethod();
}

// let's get this party started - uncomment me
main();