let scream, musicBox, vinyl, bugs, scissors, jumpscare;

let ear, grass, bug, scissors1, scissors2, mirror, mirror2, grassBackyard, eyes;

let a;
let scene = 1;

let b1x = 370, b1y = 310;
let b2x = 750, b2y = 310;
let b3x = 50, b3y = 310;
let b4x = 400, b4y = 50;

let hx = 35, hy = 550;

let bdiameter = 50;
let hdiameter = 30;

function preload() {
  ear = loadImage("ear.png");
  grass = loadImage("grass.jpg");
  bug = loadImage("bug.png");
  scissors1 = loadImage("scissors1.png");
  scissors2 = loadImage("scissors2.png");
  mirror = loadImage("mirror.png");
  mirror2 = loadImage("mirror2.png");
  grassBackyard = loadImage("grassBackyard.png");
  eyes = loadImage("eyes.png");

  scream = loadSound("scream.mp3");
  musicBox = loadSound("musicBox.mp3");
  vinyl = loadSound("vinyl.mp3");
  bugs = loadSound("bugs.mp3");
  scissors = loadSound("scissors.mp3");
  jumpscare = loadSound("jumpscare.mp3");
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  rectMode(CENTER);
  a = height;
}

function draw() {
  if (scene === 1) drawScene1();
  else if (scene === 2) drawScene2();
  else if (scene === 3) drawScene3();
  else if (scene === 4) drawScene4();
  else if (scene === 5) drawScene5();
}

// ---------- SCENES ----------

function drawScene1() {
  if (!musicBox.isPlaying() && !vinyl.isPlaying()) {
    musicBox.loop();
    vinyl.loop();
  }

  frameRate(10);
  tint(153, 191, 180);
  image(grass, width / 2, height / 2);

  tint(0, 150);
  image(ear, width / 2, height / 2, random(200, 600), random(200, 500));

  tint(92, 135, 123);
  image(ear, width / 2, height / 2);

  noStroke();

  drawButton(b1x, b1y);
  drawButton(b2x, b2y);
  drawButton(b3x, b3y);
  drawButton(b4x, b4y);

  fill(255);
  textSize(12);
  text("Scene 1", 20, 30);
}

function drawScene2() {
  vinyl.pause();
  background(0);

  if (!bugs.isPlaying()) bugs.loop();

  if (overCircle(hx, hy, hdiameter)) {
    fill(100, 0, 0);
    textSize(100);
    text("TAKE ME OUT!", hx + 10, hy);

    if (!scream.isPlaying()) scream.play();
  } else {
    fill(100);
  }

  circle(hx, hy, hdiameter);

  fill(255);
  textSize(12);
  text("Scene 2", 20, 30);

  frameRate(5);

  push();
  rotate(random(50));
  tint(100);

  for (let i = 0; i < 15; i++) drawBug();

  pop();

  if (a < 0) a = height;
}

function drawScene3() {
  tint(153, 191, 180);
  image(grass, width / 2, height / 2);

  circle(hx, hy, hdiameter);

  fill(255);
  text("Scene 3", 20, 30);

  if (overRect(width / 2, height / 2, scissors1.width, scissors1.height)) {
    if (!scissors.isPlaying()) scissors.play();

    for (let i = 0; i < 10; i++) {
      image(random([scissors1, scissors2]), random(width), random(height), random(100, 400), random(100, 400));
    }

    fill(100, 0, 0, 50);
    rect(width / 2, height / 2, width, height);
  } else {
    image(scissors1, width / 2, height / 2, 450, 300);
  }
}

function drawScene4() {
  tint(153, 191, 180);
  image(grass, width / 2, height / 2);

  circle(hx, hy, hdiameter);

  fill(255);
  text("Scene 4", 20, 30);

  image(mirror, width / 2, height / 2, 500, 500);

  if (overCircle(width / 2 + 10, height / 2 - 100, 100)) {
    if (mouseIsPressed) {
      image(mirror2, width / 2 + random(-2, 2), height / 2 + random(-2, 2), 500, 500);
    }
  }
}

function drawScene5() {
  background(0);

  tint(153, 191, 180);
  image(grassBackyard, width / 2, height / 2 + 50);

  if (overRect(width / 2, height / 2, 200, 200)) {
    image(eyes, width / 2, height / 2, 500, 500);

    if (!jumpscare.isPlaying()) jumpscare.play();
  }

  circle(hx, hy, hdiameter);

  fill(255);
  text("Scene 5", 20, 30);
}

// ---------- INPUT ----------

function mousePressed() {
  userStartAudio(); // 🔥 gerekli (tarayıcı ses için)

  if (scene === 1) {
    if (overCircle(b1x, b1y, bdiameter)) scene = 2;
    if (overCircle(b2x, b2y, bdiameter)) scene = 3;
    if (overCircle(b3x, b3y, bdiameter)) scene = 4;
    if (overCircle(b4x, b4y, bdiameter)) scene = 5;
  } else {
    if (overCircle(hx, hy, hdiameter)) {
      scene = 1;
      bugs.stop();
    }
  }
}

// ---------- HELPERS ----------

function drawButton(x, y) {
  if (overCircle(x, y, bdiameter)) {
    fill(150, 0, 0, 85);
  } else {
    fill(255, 75);
  }
  circle(x, y, bdiameter);
}

function drawBug() {
  image(bug, random(width), a, 75, 100);
  a -= random(1, 6);
}

function overRect(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function overCircle(x, y, d) {
  return dist(mouseX, mouseY, x, y) < d / 2;
}
