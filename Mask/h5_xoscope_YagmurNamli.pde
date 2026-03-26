PImage defaultImage, hoverImage, clickImage, buttonImage;
boolean isHovering = false, isClicked = false;
boolean countdownFinished = false;
int buttonWidth, buttonHeight;
color hoverTint, clickTint;
int countdownDuration = 6;
int startTime;
PFont font;
int remainingTime;

float confettiY = height/2 + 300; // Initial Y position of confetti
float confettiSpeed = 5; // Speed of confetti falling
int confettiCount = 100; // Number of confetti pieces
float[] confettiX = new float[confettiCount]; // X position of confetti pieces
float[] confettiSpeeds = new float[confettiCount]; // Speed of each confetti piece

void setup() {
//  size(600, 600);
  frameRate(24);
  fullScreen();
  font = createFont("MaleriTrialSN-Book.otf", 100);
  textFont(font);
  imageMode(CENTER);

  defaultImage = loadImage("face1.png");
  hoverImage = loadImage("face2.png");
  clickImage = loadImage("face3.png");
  buttonImage = loadImage("button.png");

  buttonWidth = buttonImage.width;
  buttonHeight = buttonImage.height;

  hoverTint = color(255, 0, 0, 150);
  clickTint = color(255);

  // Initialize confetti positions and speeds
  for (int i = 0; i < confettiCount; i++) {
    confettiX[i] = random(width); // Random X position
    confettiSpeeds[i] = random(1, 5); // Random speed
  }
}

void draw() {
  background(#081010);

  if (countdownFinished) {
    background(#081010);
    // Draw the confetti
    for (int i = 0; i < confettiCount; i++) {
      drawConfetti(confettiX[i], confettiY - i * 20); // Adjust Y position to spread confetti
      // Update confetti position
      confettiY += confettiSpeeds[i];
      // Reset confetti if it goes below the screen
      if (confettiY > height) {
        confettiY = -10;
      }
    }
    return;
  }

  drawImageWithAnimation();

  if (isClicked) {
    int elapsedSeconds = (millis() - startTime) / 1000;
    remainingTime = max(0, countdownDuration - elapsedSeconds);

    if (remainingTime > 0) {
      fill(#d6d6d6);
      textSize(200);
      textAlign(LEFT, BOTTOM);

      float x = 10;
      for (int i = 0; i < countdownDuration - remainingTime; i++) {
        String numStr = str(countdownDuration - i - 1);
        text(numStr, x, height - 20);
        x += textWidth(numStr);
      }
    } else {
      countdownFinished = true;
    }
  }
}

void drawImageWithAnimation() {
  PImage imgToDisplay = isClicked ? clickImage : (isHovering ? hoverImage : defaultImage);

  if (isClicked) {
    float elapsed = (millis() - startTime) / 1000.0;
    float progress = constrain(elapsed / countdownDuration, 0, 1);
    float scaleFactor = 1.0 + progress * 1.5; // Scale factor from 1.0 to 2.5

    float xOffset = random(-2, 2);
    float yOffset = random(-2, 2);

    pushMatrix();
    translate(width / 2 + xOffset, height / 2 + yOffset);
    scale(scaleFactor);
    image(imgToDisplay, 0, 0);
    popMatrix();
  } else {
    image(imgToDisplay, width / 2, height / 2);
  }
}

void drawButton() {
  float xOffset = isClicked ? random(-2, 2) : 0;
  float yOffset = isClicked ? random(-2, 2) : 0;

  if (isHovering) {
    tint(hoverTint);
  }

  image(buttonImage, width - buttonWidth - 10 + xOffset, height - buttonHeight - 10 + yOffset);
  noTint();
}

void mouseMoved() {
  if (!countdownFinished) {
    isHovering = dist(mouseX, mouseY, width/2, height/2) < buttonWidth/2;
  }
}

void mousePressed() {
  if (!countdownFinished && isHovering) {
    isClicked = true;
    startTime = millis();
    int elapsedSeconds = (millis() - startTime) / 1000;
    remainingTime = max(0, countdownDuration - elapsedSeconds);
  }
}

void mouseReleased() {
  if (!countdownFinished) {
    isClicked = false;
  }
}

void drawConfetti(float x, float y) {
  frameRate(10);
  float confettiX = random(5, 15);
  float confettiY = random(5, 15);
  fill(random(255), random(255), random(255));
  rect(x, y, confettiX, confettiY);
}
