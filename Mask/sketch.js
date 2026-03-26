let defaultImage, hoverImage, clickImage, buttonImage;

let isHovering = false;
let isClicked = false;
let countdownFinished = false;

let buttonWidth, buttonHeight;

let hoverTintColor, clickTintColor;

let countdownDuration = 6;
let startTime = 0;
let remainingTime = 0;

let confettiCount = 100;
let confettiX = [];
let confettiY = [];
let confettiSpeeds = [];

let font;

function preload() {
  defaultImage = loadImage("face1.png");
  hoverImage = loadImage("face2.png");
  clickImage = loadImage("face3.png");
  buttonImage = loadImage("button.png");

  font = loadFont("MaleriTrialSN-Book.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // fullscreen yerine bu
  frameRate(24);

  textFont(font);
  imageMode(CENTER);

  buttonWidth = buttonImage.width;
  buttonHeight = buttonImage.height;

  hoverTintColor = color(255, 0, 0, 150);
  clickTintColor = color(255);

  // confetti init
  for (let i = 0; i < confettiCount; i++) {
    confettiX[i] = random(width);
    confettiY[i] = random(-height, height);
    confettiSpeeds[i] = random(1, 5);
  }
}

function draw() {
  background(8, 16, 16);

  if (countdownFinished) {
    drawConfettiSystem();
    return;
  }

  drawImageWithAnimation();
  drawButton();

  if (isClicked) {
    let elapsedSeconds = floor((millis() - startTime) / 1000);
    remainingTime = max(0, countdownDuration - elapsedSeconds);

    if (remainingTime > 0) {
      fill(214);
      textSize(200);
      textAlign(LEFT, BOTTOM);

      let x = 10;
      for (let i = 0; i < countdownDuration - remainingTime; i++) {
        let numStr = str(countdownDuration - i - 1);
        text(numStr, x, height - 20);
        x += textWidth(numStr);
      }
    } else {
      countdownFinished = true;
    }
  }
}

// ---------- IMAGE ----------

function drawImageWithAnimation() {
  let img = isClicked ? clickImage : (isHovering ? hoverImage : defaultImage);

  if (isClicked) {
    let elapsed = (millis() - startTime) / 1000.0;
    let progress = constrain(elapsed / countdownDuration, 0, 1);
    let scaleFactor = 1 + progress * 1.5;

    let xOffset = random(-2, 2);
    let yOffset = random(-2, 2);

    push();
    translate(width / 2 + xOffset, height / 2 + yOffset);
    scale(scaleFactor);
    image(img, 0, 0);
    pop();
  } else {
    image(img, width / 2, height / 2);
  }
}

// ---------- BUTTON ----------

function drawButton() {
  let xOffset = isClicked ? random(-2, 2) : 0;
  let yOffset = isClicked ? random(-2, 2) : 0;

  if (isHovering) {
    tint(hoverTintColor);
  }

  //image(buttonImage, width / 2 + xOffset, height / 2 + yOffset);
  noTint();
}

// ---------- INPUT ----------

function mouseMoved() {
  if (!countdownFinished) {
    isHovering = dist(mouseX, mouseY, width / 2, height / 2) < buttonWidth / 2;
  }
}

function mousePressed() {
  if (!countdownFinished && isHovering) {
    isClicked = true;
    startTime = millis();
  }
}

function mouseReleased() {
  if (!countdownFinished) {
    isClicked = false;
  }
}

// ---------- CONFETTI ----------

function drawConfettiSystem() {
  for (let i = 0; i < confettiCount; i++) {
    fill(random(255), random(255), random(255));
    rect(confettiX[i], confettiY[i], random(5, 15), random(5, 15));

    confettiY[i] += confettiSpeeds[i];

    if (confettiY[i] > height) {
      confettiY[i] = -10;
      confettiX[i] = random(width);
    }
  }
}

// ---------- RESPONSIVE ----------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
