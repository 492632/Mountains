let skyEnd;
let mountainEnd;
let waterEnd;

let night;
let sunrise;
let day;
let bgColor;

let sunStartX;
let sunStartY;
let sunAngle;

let noisePos = 0;
let noiseAmount;
let time;
let stars = []

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  skyEnd = floor(0.48 * height);
  mountainEnd = floor(0.82 * height);
  waterEnd = floor(0.93 * height);

  night = color(0, 0, 50);
  sunrise = color(218,127,125);
  day = color(150, 220, 255);

  sunStartX = width/2;
  sunStartY = height/2;
  sunAngle = 270;

  for (let i = 0; i < height/10; i++) {
    stars.push(new Star());
  }
}

function draw() {
  time = cos(frameCount/10);

  let lerpAmount;   // bg and terrain color
  if (time < -0.9){
    // night
    bgColor = night;
    lerpAmount = 0.4;
    // shift mountains
    noisePos += 0.01
  }
  else if (time >= -0.9 & time < 0){
    // sunset
    bgColor = lerpColor(sunrise, night, map(time, -0.9, 0, 1, 0));
    lerpAmount = map(time, -0.9, 0, 0.4, 0.2)
  }
  else if (time >= 0 & time < 0.9) {
    // sunrise 
    bgColor = lerpColor(sunrise, day, map(time, 0, 0.9, 0, 1));
    lerpAmount = map(time, 0, 0.9, 0.2, 0)
  }
  else {
    // day
    bgColor = day;
    lerpAmount = 0;
  }

  noStroke(); 
  background(bgColor);
  for (let s of stars) {
    s.draw();
  }
  drawSun();
  
  // Mountains
  let colorM = lerpColor(color('#141C25'), bgColor, lerpAmount + 0.6);
  drawTerrain(skyEnd, colorM, 300, 0.005);  

  // Water
  let gradient = drawingContext.createLinearGradient(0, mountainEnd, 0, height);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, color('#2E5C74'));
  drawingContext.fillStyle = gradient;
  rect(0, mountainEnd, width, height)

  // Terrain
  let colorClose = lerpColor(color('#141C25'), bgColor, lerpAmount);
  drawTerrain(waterEnd, colorClose, 600, 0.05);

  // Overlay
  bgColor.setAlpha(100);
  fill(bgColor)
  rect(0, 0, width, height);
  bgColor.setAlpha(255);

  //Thunder
  if (mouseIsPressed) {
    drawThunder();
  }
}

function touchStarted() {
  drawThunder();
}

function drawSun() {
  let x1 = sunStartX + width/1.8 * cos(sunAngle);
  let y1 = sunStartY + height/2.5 * sin(sunAngle);
  let x2 = sunStartX + width/1.8 * cos(sunAngle+180);
  let y2 = sunStartY + height/2.5 * sin(sunAngle+180);

  noStroke(); 
  drawingContext.filter = 'blur(5px)';
  // Sun
  fill(color("#ffffb2"));
  ellipse(x1, y1, height/ 8);
  //Moon
  fill(250);
  ellipse(x2, y2, height / 8);
  drawingContext.filter = 'blur(0px)';

  sunAngle += 0.1;
}

function drawTerrain(yOff, col, indent, noiseAmount) {
  let yInc = 1;
  for (let y = yOff; y < height; y += yInc) {
    fill(col);    
    beginShape();
    vertex(0, y);
    for (let x = 0; x < width; x++) {
      let noiseVal = noise(noisePos + x * noiseAmount, y * 0.05);
      let scale = map(y, 0, height, 1, 0) * indent;
      let off = y + map(noiseVal, 0, 1, -scale, scale);
      vertex(x, off);
    }
    vertex(width, height)
    vertex(0, height)
    endShape(CLOSE);
    
    yInc += height/50;
    col = color(red(col) - 20, green(col) - 20, blue(col) - 20);
  }
}

function drawThunder() {
  let boltX = random(width);
  let boltY = 0;
  let prevBoltX = boltX;
  let prevBoltY = boltY;

  background(140, 50);

  while (boltY <= height) { 
    boltX = prevBoltX + random(-20, 20);
    boltY = prevBoltY + random(25);
    stroke(255, 90)
    strokeWeight(2);
    line(prevBoltX, prevBoltY, boltX, boltY);
    prevBoltX = boltX;
    prevBoltY = boltY;
  }
}

class Star{
  constructor() {
    this.pos = createVector(random(width), random(skyEnd));
    this.size = random(1, 3);
  }

  draw() {
    fill(250, map(time, -1, 1, 220, 0));
    circle(this.pos.x, this.pos.y, this.size);
  }
}