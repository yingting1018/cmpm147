"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let attackLevel = 1.0;
let releaseLevel = 0;

let attackTime = 0.001;
let decayTime = 0.2;
let susPercent = 0.2;
let releaseTime = 0.5;

let env = new p5.Envelope();
let triOsc = new p5.Oscillator('triangle');

let scale;
let smooth;
let brightness;

function playEnv() {
  // ensure that audio is enabled
  userStartAudio();

  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);
  env.play();
}

function release(i, j) {
  clicks[[i,j]] = 0;
}

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  reset()
}

function reset(){
  Object.keys(clicks).forEach(key => delete clicks[key]);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  if(map == 0){

  }
  else if (map == 1 && XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0 && j > -3 && j <= 3 && (clicks[[i,j]] % 2 != 1)){
    //piano
    clicks[key] = 1 + (clicks[key] | 0);
    if(clicks[key] % 2 == 1){
      let timbre;
      let t = (XXH.h32(worldSeed * 666 , worldSeed * 666));
      if(t%4==0){
        timbre = 'triangle'
      }
      else if(t%4==1){
        timbre = 'sawtooth'
      }
      else if(t%4==2){
        timbre = "square"
      }
      else if(t%4==3){
        timbre = "sine"
      }
      triOsc.setType(timbre)
      triOsc.amp(env);
      let f1;
      let fundamental = XXH.h32(worldSeed , worldSeed);
      if (fundamental % 12 == 0) {
        f1 = 261.63
      }
      else if (fundamental % 12 == 1){
        f1 = 277.18
      }
      else if (fundamental % 12 == 2){
        f1 = 293.66;
      }
      else if (fundamental % 12 == 3){
          f1 = 311.13;
      }
      else if (fundamental % 12 == 4){
          f1 = 329.63;
      }
      else if (fundamental % 12 == 5){
          f1 = 349.23;
      }
      else if (fundamental % 12 == 6){
          f1 = 369.99;
      }
      else if (fundamental % 12 == 7){
          f1 = 391.99;
      }
      else if (fundamental % 12 == 8){
          f1 = 415.30;
      }
      else if (fundamental % 12 == 9){
          f1 = 440.00;
      }
      else if (fundamental % 12 == 10){
          f1 = 466.16;
      }
      else if (fundamental % 12 == 11){
          f1 = 493.88;
      }
      let f2;
      let factor = XXH.h32("tile:" + [i * 666, j  * 666], worldSeed);
      if (factor % 8 == 0) {
        f2 = 1;
      } else if (factor % 8 == 1) {
        f2 = 1.125;
      } else if (factor % 8 == 2) {
        f2 = 1.25;
      } else if (factor % 8 == 3) {
        f2 = 1.333;
      } else if (factor % 8 == 4) {
        f2 = 1.5;
      } else if (factor % 8 == 5) {
        f2 = 1.667;
      } else if (factor % 8 == 6) {
        f2 = 1.875;
      } else if (factor % 8 == 7) {
        f2 = 2;
      }
      

      triOsc.freq(f1 * f2);
      triOsc.start();

      playEnv();
      
      setTimeout(function() {
        release(i, j)
      }, 500)
    }
    else {
      // map 2
    }
  }
  else {
    clicks[key] = 1 + (clicks[key] | 0);
  }
  
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  if(map == 0){
    // generator 1 (wall of flesh)
    randomSeed(worldSeed)
    noStroke();

    if (XXH.h32("tile:" + [i, j], worldSeed) % 100 <= 0) {
      // mouth
      fill(194, 57, 57, 255);
      beginShape();
      vertex(-tw + 5*sin(millis()*0.001), 0 + 5*sin(millis()*0.001));
      vertex(0 + 5*sin(millis()*0.001), th + 5*sin(millis()*0.001));
      vertex(tw + 5*sin(millis()*0.001), 0 + 5*sin(millis()*0.001));
      vertex(0 + 5*sin(millis()*0.001), -th + 5*sin(millis()*0.001));
      endShape(CLOSE);

      fill(125, 0, 0, 255);
      ellipse(tw - p3_tileWidth()+ 5*sin(millis()*0.001), th - p3_tileHeight() * 2+ 5*sin(millis()*0.001), 64, 64)
      fill(78, 19, 19, 255);
      ellipse(tw - p3_tileWidth()+ 5*sin(millis()*0.001), th - p3_tileHeight() * 2+ 5*sin(millis()*0.001), 56, 56)
      fill (127, 98, 67, 255)
      for (let a = 0; a < 128; a += 8){
          if (a <= 64) {
              triangle(-tw - 4 + a + 5*sin(millis()*0.001), -th * 3 + 5*sin(millis()*0.001), -tw + a + 5*sin(millis()*0.001), -th * 3 + 5*sin(millis()*0.001), -tw -2 + a + (2+random()*4*cos(millis() * 0.002)) + 5*sin(millis()*0.001), -th + 5*sin(millis()*0.001))
          }
          else {
              triangle(-tw - 4 + a - 64 + 5*sin(millis()*0.001), th * 3 + 5*sin(millis()*0.001), -tw + a - 64 + 5*sin(millis()*0.001), th * 3 + 5*sin(millis()*0.001), -tw - 2 + a - 64 + (2+random()*4*cos(millis() * 0.002)) + 5*sin(millis()*0.001), -th + 5*sin(millis()*0.001))
          }
      }

    } else if (XXH.h32("tile:" + [i, j], worldSeed) % 100 <= 1){
      // eyeballs
      fill(194, 57, 57, 255);
      beginShape();
      vertex(-tw + 5*sin(millis()*0.001), 0 + 5*sin(millis()*0.001));
      vertex(0 + 5*sin(millis()*0.001), th + 5*sin(millis()*0.001));
      vertex(tw + 5*sin(millis()*0.001), 0 + 5*sin(millis()*0.001));
      vertex(0 + 5*sin(millis()*0.001), -th + 5*sin(millis()*0.001) );
      endShape(CLOSE);
      ellipse(tw - p3_tileWidth() + 5*sin(millis()*0.001), th - p3_tileHeight() * 2 + 5*sin(millis()*0.001), 64, 64)
      fill(208, 208, 208, 255);
      ellipse(tw - p3_tileWidth() + 5*sin(millis()*0.001), th - p3_tileHeight() * 2 + 5*sin(millis()*0.001), 60, 96 * abs(max(min(sin(millis() * 0.002 + noise(i, j)*4), .5), -.5)))

      
      
      if (abs(max(min(sin(millis() * 0.002 + noise(i, j)*4), .5), -.5)) > .15) {
          fill(194, 57, 57, 100)
          ellipse(tw - p3_tileWidth() + max(min((min(mouseX,width) - (width/2))/32, 32) , -32) + 5*sin(millis()*0.001), th - p3_tileHeight() * 2 + max(min((min(mouseY, height) - (height/2))/32, 32)) + 5*sin(millis()*0.001), 32, 32)

          fill(0, 0, 0, 255);
          ellipse(tw - p3_tileWidth() + max(min((min(mouseX,width) - (width/2))/32, 32), -32) + 5*sin(millis()*0.001), th - p3_tileHeight() * 2 + max(min((min(mouseY, height) - (height/2))/32, 32)) + 5*sin(millis()*0.001), 16, 16)
      }
    } 
    else {
      // FLESH
      fill(158 + 50*noise(i, j), 31+ 10*noise(i, j), 45+ 10*noise(i, j), 255)
      beginShape();
      vertex(-tw + 5*sin(millis()*0.001), 0 + 5*sin(millis()*0.001));
      vertex(0 + 5*sin(millis()*0.001), th + 5*sin(millis()*0.001));
      vertex(tw + 5*sin(millis()*0.001), 0 + 5*sin(millis()*0.001));
      vertex(0 + 5*sin(millis()*0.001), -th + 5*sin(millis()*0.001));
      endShape(CLOSE);
    }

    push();
    pop();
  }
  else if(map == 1) {
    // generator 2 (piano tiles)
    noStroke();

    if(j > -3 && j <= 3){
      if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
        if(clicks[[i,j]]%2==1){
          fill(30, 255);
          beginShape();
          vertex(-tw, 0 + 10);//LEFT
          vertex(0, th + 10); //DOWN
          vertex(tw, 0 + 10); //RIGHT
          vertex(0, -th + 10);//UP
          endShape(CLOSE);
          fill(15, 255);
          beginShape();
          vertex(tw, 0 + 10); 
          vertex(tw, 20 + 10);
          vertex(0, th + 20 + 10); 
          vertex(0, th + 10);
          endShape(CLOSE);
          fill(0, 255);
          beginShape();
          vertex(0, th + 10);
          vertex(0, th + 20 + 10);
          vertex(-tw, +20 + 10);
          vertex(-tw, 0 + 10);
          endShape(CLOSE);
        }
        else{
          fill(30, 255);
          beginShape();
          vertex(-tw, 0);//LEFT
          vertex(0, th); //DOWN
          vertex(tw, 0); //RIGHT
          vertex(0, -th);//UP
          endShape(CLOSE);
          fill(15, 255);
          beginShape();
          vertex(tw, 0); 
          vertex(tw, 20);
          vertex(0, th + 20); 
          vertex(0, th);
          endShape(CLOSE);
          fill(0, 255);
          beginShape();
          vertex(0, th);
          vertex(0, th + 20);
          vertex(-tw, +20);
          vertex(-tw, 0);
          endShape(CLOSE);
        }
      } else {
        fill(255, 255);
        beginShape();
        vertex(-tw, 0);//LEFT
        vertex(0, th); //DOWN
        vertex(tw, 0); //RIGHT
        vertex(0, -th);//UP
        endShape(CLOSE);
        fill(230, 255);
        beginShape();
        vertex(tw, 0); 
        vertex(tw, 20);
        vertex(0, th + 20); 
        vertex(0, th);
        endShape(CLOSE);
        fill(205, 255);
        beginShape();
        vertex(0, th);
        vertex(0, th + 20);
        vertex(-tw, +20);
        vertex(-tw, 0);
        endShape(CLOSE);
      }
    }
    

    push();

    

    let n = clicks[[i, j]] | 0;

    pop();
  }
  else if(map == 2) {
    // generator 3 (???)
    noStroke();

    if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {

    } else {

    }

    push();

    scale = 100 + 100 * noise(worldSeed)
    smooth = 0.1 + 0.3 * noise(worldSeed)
    brightness = max(min(mouseX, width*3/4),width/4)/width*1.5
    

    fill(140 * brightness, 180 * brightness, 50 * brightness);
    beginShape();
    vertex(-tw, 0 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);//LEFT
    vertex(0, th + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale); //DOWN
    vertex(tw, 0 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale); //RIGHT
    vertex(0, -th + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);//UP
    endShape(CLOSE);
    fill(120 * brightness, 160 * brightness, 30 * brightness);
    beginShape();
    vertex(tw, 0 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale); 
    vertex(tw, 40 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    vertex(0, th + 40 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale); 
    vertex(0, th + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    endShape(CLOSE);
    fill (100 * brightness, 140 * brightness, 10 * brightness);
    beginShape();
    vertex(0, th + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    vertex(0, th + 40 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    vertex(-tw, + 40 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    vertex(-tw, 0 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    endShape(CLOSE);

    let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    // noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale
    fill(81  *brightness,57 * brightness,26 * brightness)
    beginShape();
    vertex(-5, 0 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale)
    vertex(5, 0 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale)
    vertex(5, -50 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale)
    vertex(-5, -50 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale)
    endShape(CLOSE)

    fill(60 *brightness, 84 * brightness, 26 * brightness, 200)
    ellipse(0, -50 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale, 25 + noise(i,j) * 25, 40 + noise(i*0.4,j*0.4) * 10)
    
  }

    pop();
  }
  
}

function p3_drawSelectedTile(i, j) {
  if(map == 0) {
  
  }
  else if (map == 1) {
    noFill();
    stroke(0, 255, 0, 128);

    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);

    noStroke();
    fill(0);
    text("tile " + [i, j], 0, 0);
  }
  else {
    // map 2
    noFill();
    stroke(0, 120, 255, 128);

    beginShape();
    vertex(-tw, 0 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    vertex(0, th + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    vertex(tw, 0 + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    vertex(0, -th + noise(i * smooth,j * smooth)*scale/2 - noise(i * smooth,j * smooth)*scale);
    endShape(CLOSE);

    noStroke();
    fill(0);
    text("tile " + [i, j], 0, 0);
  }
  
}

function p3_drawAfter() {}