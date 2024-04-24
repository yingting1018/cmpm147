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

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let rooms = [];
let map = 0;
let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;
let monsterX;
let monsterY;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function remap() {
  if (map == 0) {
    map = 1;
  }
  else {
    map = 0;
  }
  reseed();
}

$("#switch").click(function() {

});

function reseed() {
  seed = (seed | 0) + millis();
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed: " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    return grid[i][j] == target;
  }
  return false;
}

function gridCode(grid, i, j, target) {
  const northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  const southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  const eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  const westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;
  
  return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
}


function drawContext(grid, i, j, target, ti, tj) {
  const code = gridCode(grid, i, j, target);
  let tiOffset;
  let tjOffset;
  if (target == "W") {
    [tiOffset, tjOffset] = lookup[code];
  }
  else if (target == "T") {
    [tiOffset, tjOffset] = lookupTree[code];
  }
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

function drawContextNight(grid, i, j, target, ti, tj) {
  const code = gridCode(grid, i, j, target);
  let tiOffset;
  let tjOffset;
  if (target == "W") {
    [tiOffset, tjOffset] = lookupNight[code];
  }
  else if (target == "T") {
    [tiOffset, tjOffset] = lookupTree[code];
  }
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

function drawContextDungeon(grid, i, j, target, ti, tj) {
  const code = gridCode(grid, i, j, target);
  let tiOffset;
  let tjOffset;
  if (target == "*") {
    [tiOffset, tjOffset] = lookupDungeon[code];
  }
  else if (target == "+") {
    [tiOffset, tjOffset] = lookupWalls[code];
  }
  else if (target == "d") {
    [tiOffset, tjOffset] = lookupNull[code];
  }
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

const lookup = [
  [0 , -13], // NSEW
  [10, -11], // 1 SEW
  [10, -13], // 2 NEW
  [0 , 0], // 3 EW
  [9, -12], // 4 NSW

  [9, -11], // 5 SW
  [9, -13], // 6 NW
  [9, -12], // 7 W

  [11, -12], // 8 NES

  [11, -11], // 9 SE
  [11, -13], // 10 NE
  [11, -12], // 11 E

  [0, 0], // 12 NS

  [10, -11], // 13 S
  [10, -13], // 14 N
  
  [0, 4]  // 15 
];

const lookupTree = [
  [-2, -1], // NSEW
  [0, 1], // 1 SEW
  [0, -1], // 2 NEW
  [-2, -1], // 3 EW
  [-1, 0], // 4 NSW
  [-1, 1], // 5 SW

  [-1, -1], // 6 NW

  [-1, 0], // 7 W
  [1, 0], // 8 NES

  [1, 1], // 9 SE
  
  [1, -1], // 10 NE
  [1, 0], // 11 E
  [-2, -1], // 12 NS
  [0, 1], // 13 S
  [0, -1], // 14 N
  [0, 0]  // 15 
];

const lookupNight = [
  [0 , -8], // NSEW
  [10, -6], // 1 SEW
  [10, -8], // 2 NEW
  [0 , 0], // 3 EW
  [9, -7], // 4 NSW

  [9, -6], // 5 SW
  [9, -8], // 6 NW
  [9, -7], // 7 W

  [11, -7], // 8 NES

  [11, -6], // 9 SE
  [11, -8], // 10 NE
  [11, -7], // 11 E

  [0, 0], // 12 NS

  [10, -6], // 13 S
  [10, -8], // 14 N
  
  [0, 3]  // 15 
];

const lookupWalls = [
  [0, 0] , // NSEW
  [0, 0] , // 1 SEW
  [0, 0] , // 2 NEW
  [0 , 0], // 3 EW
  [0, 0] , // 4 NSW
  [1, 1] , // 5 SW
  [0, 0] , // 6 NW
  [0, 0] , // 7 W
  [0, 0] , // 8 NES
  [1, 1] , // 9 SE
  [0, 0] , // 10 NE
  [0, 0] , // 11 E
  [1, 1], // 12 NS
  [1, 1] , // 13 S
  [0, 0] , // 14 N
  [0, 1]  // 15 
];

const lookupDungeon = [
  [0, 0] , // NSEW
  [0, 0] , // 1 SEW
  [0, 0] , // 2 NEW
  [0 , 0], // 3 EW
  [0, 0] , // 4 NSW
  [0, 0] , // 5 SW
  [0, 0] , // 6 NW
  [0, 0] , // 7 W
  [0, 0] , // 8 NES
  [0, 0] , // 9 SE
  [0, 0] , // 10 NE
  [0, 0] , // 11 E
  [0, 0], // 12 NS
  [0, 0] , // 13 S
  [0, 0] , // 14 N
  [0, 0]  // 15 
];

const lookupNull = [
  [0, 0] , // NSEW
  [0, 0] , // 1 SEW
  [0, 0] , // 2 NEW
  [0 , 0], // 3 EW
  [0, 0] , // 4 NSW
  [0, 0] , // 5 SW
  [0, 0] , // 6 NW
  [0, 0] , // 7 W
  [0, 0] , // 8 NES
  [0, 0] , // 9 SE
  [0, 0] , // 10 NE
  [0, 0] , // 11 E
  [0, 0], // 12 NS
  [0, 0] , // 13 S
  [0, 0] , // 14 N
  [0, 0]  // 15 
];

/* exported generateGrid, drawGrid */
/* global placeTile */

// _ = grass
// . = darker grass
// W = water
// T = trees
// H = houses
function generateRoom(){
  let roomWidth = 6 + floor(random() * 6);
  let roomHeight = 3 + floor(random() * 6);
  let roomCornerX = floor(random() * (numCols - roomWidth));
  let roomCornerY = floor(random() * (numRows - roomHeight));
  
  // Check if the new room overlaps with existing rooms
  let overlap = false;
  for (let room of rooms) {
    if (roomCornerX < room.x + room.width &&
        roomCornerX + roomWidth > room.x &&
        roomCornerY < room.y + room.height &&
        roomCornerY + roomHeight > room.y) {
      overlap = true;
      break;
    }
  }
  
  // If there's no overlap, add the room to the list and grid
  if (!overlap) {
    let room = {x: roomCornerX, y: roomCornerY, width: roomWidth, height: roomHeight};
    rooms.push(room);
  } else {
    // If there's overlap, try generating another room
    generateRoom();
  }
}

function generateGrid(numCols, numRows) {
  let grid = [];
  if (map == 0){
    // overworld
    let noiseScale = .07;
    let n;
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        n = floor(1000 * noise(i * noiseScale, j * noiseScale));
        if (n < 400) {
          if (n >= 170 && n < 250) {
            row.push("T")
          }
          else {
            row.push(".");
          }
        }
        else if (n >= 400 && n < 600) {
          if (n >= 500 && n < 502) {
            row.push("H")
          }
          else {
            row.push("_");
          }
        }
        else if (n >= 600){
          row.push("W")
        }
      }
      grid.push(row);
    }
  }
  else {
    //dungeon
    rooms = [];
    for (let i = 0; i < 3 + floor(random()*5); i++) {
    generateRoom();
    }

    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        let isRoom = false;
        let isDoor = false;
        for (let room of rooms){
          if(i > room.y && i < room.y + room.height && j > room.x && j < room.x + room.width){
            isRoom = true;
          }
          if ((i == room.y + floor(room.height/2) && j == room.x) || (i == room.y && j == room.x + floor(room.width/2)) || (i == room.y + floor(room.height/2) && j == room.x + room.width) || (i == room.y + room.height && j == room.x + floor(room.width/2))){
            isDoor = true;
          }
        }
        if (isDoor){
          row.push("d")
        }
        else if (isRoom){
          row.push("*")
        }
        else {
          row.push("+")
        }



      }
      let t1 = rooms[0]
      let t2 = rooms[0]
    
      monsterX = t1.x * 16 + floor(t1.width/2)*16
      monsterY = t2.y * 16 + floor(t2.height/2)*16
      
      grid.push(row);
    }
  }
  
  
  return grid;
}

function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(map == 0) {
        //overworld
        if (millis() % 12000 < 6000) {
          // day time
          if (grid[i][j] == '_') {
            if (gridCheck(grid, i, j, "_")) {
              if (random(1) < 0.95) {
                placeTile(i, j, 0, 0);
              }
              else {
                placeTile(i, j, 1 + floor(random(3)), 0);
              }
            } else {
              //drawContext(grid, i, j, "_", 0, 0);
            }
          }
          else if (grid[i][j] == '.'){
            if (gridCheck(grid, i, j, ".")) {
              if (random(1) < 0.98) {
                placeTile(i, j, 0, 1);
              }
              else {
                placeTile(i, j, 1 + floor(random(3)), 1);
              }
            } else {
              //drawContext(grid, i, j, ".", 0, 0);
            }
          }
          else if (grid[i][j] == "W"){
            if (gridCheck(grid, i, j, "W")) {
              if (random() < 0.80) {
                placeTile(i, j, 0, 13);
              }
              else {
                placeTile(i, j, 1 + floor((random() * 3 + millis() * 0.002) % 3), 13);
              }
              drawContext(grid, i, j, "W", 0, 13);
            } else {
              drawContext(grid, i, j, "W", 0, 13);
            }
          }
          else if (grid[i][j] == "T"){
            if (gridCheck(grid, i, j, "T")) {
              if (random(1) < 0.98) {
                placeTile(i, j, 0, 1);
              }
              else {
                placeTile(i, j, 1 + floor(random(3)), 1);
              }
              drawContext(grid, i, j, "T", 16, 1);
            } else {
              //drawContext(grid, i, j, ".", 0, 0);
            }
          }
          else if (grid[i][j] == "H"){
            if (gridCheck(grid, i, j, "H")) {
    
              if (random(1) < 0.95) {
                placeTile(i, j, 0, 0);
              }
              else {
                placeTile(i, j, 1 + floor(random(3)), 0);
              }
    
              placeTile(i, j, 26, floor(random(4)));
            } else {
              //drawContext(grid, i, j, ".", 0, 0);
            }
          }
        } else {
          // night time
          if (grid[i][j] == '_') {
            if (gridCheck(grid, i, j, "_")) {
              if (random(1) < 0.95) {
                placeTile(i, j, 0, 6);
              }
              else {
                placeTile(i, j, 1 + floor(random(3)), 6);
              }
            } else {
              //drawContext(grid, i, j, "_", 0, 0);
            }
          }
          else if (grid[i][j] == '.'){
            if (gridCheck(grid, i, j, ".")) {
              if (random(1) < 0.98) {
                placeTile(i, j, 0, 7);
              }
              else {
                placeTile(i, j, 1 + floor(random(3)), 7);
              }
            } else {
              //drawContext(grid, i, j, ".", 0, 0);
            }
          }
          else if (grid[i][j] == "W"){
            if (gridCheck(grid, i, j, "W")) {
              if (random(1) < 0.90) {
                placeTile(i, j, 0, 14);
              }
              else {
                placeTile(i, j, 1 + floor((random() * 3 + millis() * 0.002) % 3), 14);
              }
              drawContextNight(grid, i, j, "W", 0, 14);
            } else {
              drawContextNight(grid, i, j, "W", 0, 14);
            }
          }
          else if (grid[i][j] == "T"){
            if (gridCheck(grid, i, j, "T")) {
              if (random(1) < 0.98) {
                placeTile(i, j, 0, 7);
              }
              else {
                placeTile(i, j, 1 + floor(random(3)), 7);
              }
              drawContext(grid, i, j, "T", 16, 7);
            } else {
              //drawContext(grid, i, j, ".", 0, 0);
            }
          }
          else if (grid[i][j] == "H"){
            if (gridCheck(grid, i, j, "H")) {
    
              if (random(1) < 0.95) {
                placeTile(i, j, 0, 6);
              }
              else {
                placeTile(i, j, 1 + floor(random(3)), 6);
              }
    
              placeTile(i, j, 26, floor(random(4)));
            } else {
              //drawContext(grid, i, j, ".", 0, 0);
            }
          }
        }
      }
      else {
        //dungeon
        if (grid[i][j] == '*') {
          if (gridCheck(grid, i, j, "*")) {
            if (random(1) < 0.85) {
              placeTile(i, j, 10, 23);
            }
            else if (random(1) > 0.90){
              placeTile(i, j, floor(random() * 5), 28 + floor(random() * 2));
            }
            else {
              placeTile(i, j, 11 + floor(random() * 3), 23 + floor(random() * 1));
            }
          } else {
            //drawContext(grid, i, j, "_", 0, 0);
          }
        }
        else if (grid[i][j] == '+'){
          if (gridCheck(grid, i, j, "+")) {
            if (random(1) < 0.99) {
              placeTile(i, j, 0, 23);
            }
            else {
              placeTile(i, j, 1 + floor(random() * 3), 22);
            }
            drawContextDungeon(grid, i, j, "+", 0, 23);
          } else {
            //drawContext(grid, i, j, "_", 0, 0);
          }
        }
        else if (grid[i][j] == 'd'){
          if (gridCheck(grid, i, j, "d")) {
            placeTile(i, j, 10, 23);
            drawContextDungeon(grid, i, j, "d", 15, 25 + floor(random() * 3));
          } else {
            //drawContext(grid, i, j, "_", 0, 0);
          }
        }
      }
    }
  }
}




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

// setup() function is called once when the program starts
function setup() {
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

  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);
  select("#switch").mousePressed(remap);

  reseed();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  
  drawGrid(currentGrid);
  randomSeed(seed);

  if (map == 0) {
    noStroke()
    // clouds
    fill(0, 0, 0, 20 + random(40))
    const clouds = floor(24 * random());
    for (let i = 0; i < clouds; i++) {
      let z = .5 + random();
      let x = width * ((random() + millis() / 4000.0) / z) % width;
      let y = height * random();
      let s = width / 5 * z; // Adjust size based on z
      rect(x, y, s, s / 2); // Ellipse shape for clouds
    }
  
    let defaultColorDay = color(0,0,0,75);
    let dayColor = color(255, 255, 255, 50); // Light blue
    let defaultColorNight = color(255, 255, 255, 25);
    let nightColor = color(0, 0, 0, 150); // Dark blue
    let currentColor;
  
    if (millis() % 12000 < 2000) {
      currentColor = lerpColor(defaultColorDay, dayColor, (millis() % 2000) / 2000);
    } else if (millis() % 12000 < 4000) {
      currentColor = lerpColor(dayColor, dayColor, (millis() % 2000) / 2000);
    } else if (millis() % 12000 < 6000) {
      currentColor = lerpColor(dayColor, defaultColorDay, (millis() % 2000) / 2000);
    } else if (millis() % 12000 < 8000) {
      currentColor = lerpColor(defaultColorNight, nightColor, (millis() % 2000) / 2000);
    } else if (millis() % 12000 < 10000) {
      currentColor = lerpColor(nightColor, nightColor, (millis() % 2000) / 2000);
    } else {
      currentColor = lerpColor(nightColor, defaultColorNight, (millis() % 2000) / 2000);
    }

    background(currentColor)

    
    if (millis() % 12000 > 7000 && millis() % 12000 < 11000) {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          if (currentGrid[i][j] == "H") {
            fill(255, 255, 150, 50)
            ellipse(j * 16 + 8, i * 16 + 8, 32, 32)
            fill(255, 255, 150, 50)
            ellipse(j * 16 + 8, i * 16 + 8, 48, 48)
          }
        }
      }
    }
  }
  else {

    if (currentGrid[monsterY/16][monsterX/16] == "d"){
      let r = floor(millis()%4)

      let r1 = rooms[floor(millis()%rooms.length)]
      let r2 = rooms[floor(millis()%rooms.length)]

      if (r == 0){
        monsterX = r1.x * 16 + floor(r1.width/2)*16
        monsterY = r2.y * 16 + 16
      }
      else  if (r == 1) {
        monsterX = r1.x * 16 + floor(r1.width)*16 - 16
        monsterY = r2.y * 16 + floor(r2.height/2)*16
      }
      else if (r == 2) {
        monsterX = r1.x * 16 + floor(r1.width/2)*16
        monsterY = r2.y * 16 + floor(r2.height)*16 - 16
      }
      else {
        monsterX = r1.x * 16 + 16
        monsterY = r2.y * 16 + floor(r2.height/2)*16
      }
    }


    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        
      }
    }
    

    fill(0, 255, 0);
    ellipse(monsterX + 8, monsterY + 8, 12 + random() * 4, 8 + random() * 4 + sin(millis()*0.002) * 4)
    fill(0,0,0)
    ellipse(monsterX + 5, monsterY + 5, 2 + random() * 3, 3 + random() * 6)
    ellipse(monsterX + 10, monsterY + 5, 2 + random() * 3, 3 + random() * 6)
  }
}

function keyPressed() {
  // Check which key was pressed and move the monster accordingly
  if (map == 1){
    if ((keyCode === UP_ARROW || key === 'w' || key === 'W') && currentGrid[(monsterY/16) - 1][monsterX/16] != "+") {
      monsterY -= 16;
    } else if ((keyCode === DOWN_ARROW || key === 's' || key === 'S') && currentGrid[(monsterY/16) + 1][monsterX/16] != "+") {
      monsterY += 16;
    } else if ((keyCode === LEFT_ARROW || key === 'a' || key === 'A') && currentGrid[monsterY/16][(monsterX/16) - 1] != "+") {
      monsterX -= 16;
    } else if ((keyCode === RIGHT_ARROW || key === 'd' || key === 'D') && currentGrid[monsterY/16][(monsterX/16) + 1] != "+") {
      monsterX += 16;
    }
  }
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}