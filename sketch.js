

let TILE_SIZE_X = 18;
let TILE_SIZE_Y = 18;
let TILE_COUNT_X = 32;
let TILE_COUNT_Y = 32;
let SCREEN_WIDTH = TILE_SIZE_X * TILE_COUNT_X;
let SCREEN_HEIGHT = TILE_SIZE_Y * TILE_COUNT_Y;

let stageString;
let stageGrid;
let positionOffset = 0;
let positionOffsetFloat = 0;

let jumpCounter = 0;
let spaceBarPressed = false;

let hero = {
  pos: {x: 48, y: 200},
  size: {x: 1, y: 2},
  velocity: {x: 0, y: 0},
  maxSpeed: 6,
  maxAcceleration: 0.6,
  center: function() {
    return {
      x: this.pos.x + TILE_SIZE_X * this.size.x / 2,
      y: this.pos.y + TILE_SIZE_Y * this.size.y / 2}},
  vpos: function() {return [this.pos.x, this.pos.y];},
  vsize: function() {return [this.size.x, this.size.y];},
  vvel: function() {return [this.velocity.x, this.velocity.y];},
  vcenter: function() {return [this.center().x, this.center().y]},
  setPos: function(x, y) {this.pos.x = x; this.pos.y = y;},
  box: function() {return [this.pos.x, this.pos.y,
                            this.size.x * TILE_SIZE_X,
                            this.size.y * TILE_SIZE_Y];}
};

function preload() {
  stageString = loadStrings('stages/stage1.txt');
}

function setup() {
  
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  stageGrid = []
  stageString.forEach(string => stageGrid.push(string.split('')));
  
}

function draw() { 
  
  background(0,200,200);
  
  for (let x = 0; x < TILE_COUNT_X; x++) {
    for (let y = 0; y < TILE_COUNT_Y; y++) {
      if (stageGrid[x][y + positionOffset] == '#') {
        drawTile(y * TILE_SIZE_Y, x * TILE_SIZE_X);
      }
    }
  }
  
  gravityAndDrag();
  moveHero();
  
  drawHero();
  
  if (keyIsDown(65)) {
    if (hero.velocity.x > -hero.maxSpeed) {
      if (jumpCounter == 0)
        hero.velocity.x -= hero.maxAcceleration;
      else
        hero.velocity.x -= hero.maxAcceleration / 2;
    }
  }
  if (keyIsDown(68)) {
    if (hero.velocity.x < hero.maxSpeed)
      if (jumpCounter == 0)
        hero.velocity.x += hero.maxAcceleration;
      else
        hero.velocity.x += hero.maxAcceleration / 2;
    if (hero.pos.x - SCREEN_WIDTH / 2 > TILE_SIZE_X)
      positionOffset++;
    //if (hero.pos.x > SCREEN_WIDTH / 2)
    //  positionOffsetFloat = hero.pos.x - SCREEN_WIDTH / 2;
  }
  
  if (spaceBarPressed) {
    switch (jumpCounter) {
      case 0:
        hero.velocity.y = -6;
        jumpCounter++;
        break;
      case 1:
        hero.velocity.y = -6;
        jumpCounter++;
        break;
    }
  }
  spaceBarPressed = false;
    
  text(positionOffset.toString(), 20, 20);
}

function keyPressed() {
  if (keyCode == 32) {
    spaceBarPressed = true;
  }
}

function drawHero() {
  let [px, py] = hero.vpos();
  let [w, h] = hero.vsize();
  push();
  fill('red');
  noStroke();
  rect(px, py, w * TILE_SIZE_X, h * TILE_SIZE_Y);
  pop();
}

function drawTile(x, y) {
  push();
  noStroke();
  fill(100, 100, 0);
  rect(x, y, TILE_SIZE_X, TILE_SIZE_Y);
  pop();
}

function gravityAndDrag() {
  let [vx, vy] = hero.vvel();
  if (jumpCounter == 0)
    hero.velocity.x *= 0.85;
  else
    hero.velocity.x *= 0.9;
  if (vy < 5) {
    hero.velocity.y += 0.2;
  }
}

function moveHero() {
  let newPos = {x: hero.pos.x + hero.velocity.x, y: hero.pos.y + hero.velocity.y};
  let [width, height] = [hero.size.x * TILE_SIZE_X, hero.size.y * TILE_SIZE_Y];
  let getGrid = (x, y) => {
    x = Math.floor(x / TILE_SIZE_X);
    y = Math.floor(y / TILE_SIZE_Y);
    return stageGrid[y][x];
  }
  
  // solving x-axis
  if (hero.velocity.x < 0) {
    if (getGrid(newPos.x, hero.pos.y) == '#' || 
        getGrid(newPos.x, hero.pos.y + 0.9 * height / 2) == '#' ||
        getGrid(newPos.x, hero.pos.y + 1.1 * height / 2) == '#' ||
        getGrid(newPos.x, hero.pos.y + 0.95 * height) == '#') {
      newPos.x = Math.ceil(newPos.x / TILE_SIZE_X) * TILE_SIZE_X;
      hero.velocity.x = 0;
    }
  }
  else {
    if (getGrid(newPos.x + width, hero.pos.y) == '#' || 
        getGrid(newPos.x + width, hero.pos.y + 0.9 * height / 2) == '#' ||
        getGrid(newPos.x + width, hero.pos.y + 1.1 * height / 2) == '#' ||
        getGrid(newPos.x + width, hero.pos.y + 0.95 * height) == '#') {
      newPos.x = Math.floor(newPos.x / TILE_SIZE_X) * TILE_SIZE_X;
      hero.velocity.x = 0;
    }
  }
  // solving y-axis
  if (hero.velocity.y <= 0) {
    if (getGrid(newPos.x, newPos.y) == '#' ||
        getGrid(newPos.x + 0.9 * width, newPos.y) == '#') {
      newPos.y = Math.ceil(newPos.y / TILE_SIZE_Y) * TILE_SIZE_Y;
      hero.velocity.y = 0;
    }
  }
  else {
    if (jumpCounter == 0) jumpCounter++;
    if (getGrid(newPos.x, newPos.y + height) == '#' ||
        getGrid(newPos.x + 0.9 * width, newPos.y + height) == '#') {
      newPos.y = Math.floor(newPos.y / TILE_SIZE_Y) * TILE_SIZE_Y;
      hero.velocity.y = 0;
      jumpCounter = 0;
    }
  }
  
  hero.pos = {x: newPos.x, y: newPos.y};
}
