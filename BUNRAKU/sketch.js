/* vcd436s24 - Project (4/4): Submission
  @yagmurnamli
   last update: June 05
   Project Name: "BUNRAKU"
   Explanation: A Japanese puppet, Bunraku, is holding a key, can you take it or not? An interactive experience based on Teachable Machine and player gestures.
. Sources: 
- https://www.youtube.com/watch?v=kwcillcWOg0&t=6s&ab_channel=TheCodingTrain
- https://editor.p5js.org/codingtrain/sketches/PoZXqbu4v
. when encountered with the puppet, try reaching for the camera, or come closer to it.
. media: https://www.youtube.com/watch?v=0hoK3RFvxwM&ab_channel=%E6%96%87%E5%8C%96%E5%BA%81bunkachannel
. #todo: 
- make the scene transitions smoother
- use more sound effects, distort the music
- add more options for the gesture interactions
- add more text for the story
*/

let sound;
let video;
let label = "waiting...";
// The classifier
let classifier;
let modelURL = "https://teachablemachine.withgoogle.com/models/ZlwamfTxu/";
// Image variables
let img1, img2, img3, cur1, cur2;
// Button variable
let button;
// Position variables for curtains
let cur1X, cur2X;
let targetCur1X, targetCur2X;
let curtainSpeed = 1.5;
let curtainsOpen = false;

// Font
let customFont;

let typewriterStarted = false;
let scene2StartTime = 0;
let scene2WaitTime = 1500;
let typewriterFinished = false;
let switchTime;
let shakeStartTime;
let shakeDuration = 3000;
let shakeIntensity = 5;
let reachSwitched = false;
let reachStartTime;
let scene4Displayed = false;
let scene4Opacity = 0;
let lookSwitched = false;
let lookStartTime;
let scene5Displayed = false;
let spiralRadius = 0;
let spiralAngle = 0;
let angleStep = 0.5;
let imga;
let scene4TextOpacity = 0;
let scene5TextOpacity = 0;



// Text variables for title
let titleOpacity = 255;
let titleFadeSpeed = 0;

// Breathing animation variables
let breathingOffset = 0;
let breathingSpeed = 0.05;
let breathingAmplitude = 10;

// Typewriter effect variables
let fullText = "Welcome, foolish mortal. You seek the key, do you? It holds power beyond your comprehension. But do you dare to claim it? I am the guardian, the puppet master. Face me if you dare, but beware, the consequences may be dire.";
let displayedText = "";
let charIndex = 0;
let typingSpeed = 80;

// STEP 1: Load the model!
function preload() {
  sound = new Audio('sound/Bunraku puppet theatre.mp3');
  classifier = ml5.imageClassifier(modelURL + "model.json");
  img1 = loadImage("images/puppet1.png");
  img2 = loadImage("images/puppet2.png");
  img3 = loadImage("images/puppet3.png");
  img4 = loadImage("images/puppet4.png");
  cur1 = loadImage("images/curtain1.png");
  cur2 = loadImage("images/curtain2.png");
  // Load the custom font
  customFont = loadFont("font/MaleriTrialSN-Book.otf");
}

function setup() {
  createCanvas(700, 700);
  textFont(customFont);
  imageMode(CENTER);
  // Create the video
  video = createCapture(VIDEO);
  video.size(160, 120);
  video.hide();

  // Initialize curtain positions
  cur1X = width / 2;
  cur2X = width / 2;
  targetCur1X = cur1X;
  targetCur2X = cur2X;

  // Create the button
  button = createButton("start");
  button.size(150, 50); // Set button size
  button.style("background-color", "#8b242c"); // Set button color
  button.style("color", "#d6d6d6"); // Set text color
  button.style("font-size", "20px"); // Set font size
  button.style("border", "none"); // Remove border
  button.style("cursor", "pointer"); // Change cursor to pointer
  button.style("font-family", customFont); // Set custom font for button
  button.position(width, height / 2); // Center the button
  button.mousePressed(openCurtains);

  // Add pulsing animation
  button.style("animation", "pulse 2s infinite");

  // Create keyframes for pulsing animation
  let pulseAnimation = `@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }`;

  // Add the keyframes to the document's styles
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = pulseAnimation;
  document.head.appendChild(styleSheet);

  // Start the typewriter effect
  setInterval(typeWriter, typingSpeed);

  // STEP 2: Start classifying
  classifyVideo();
}

// Function to open the curtains
function openCurtains() {
  if (!curtainsOpen) {
    targetCur1X = -cur1.width / 2;
    targetCur2X = width + cur2.width / 2;
    curtainsOpen = true;
    button.hide();
    clear();
    titleFadeSpeed = 1.5;
  }
}

function shakeImage() {
  let currentTime = millis();
  let elapsedTime = currentTime - shakeStartTime;
  
  // Randomly offset image position to create shaking effect
  let offsetX = random(-shakeIntensity, shakeIntensity);
  let offsetY = random(-shakeIntensity, shakeIntensity);
  
  // Apply shaking motion to img2
  let x = width / 2 + offsetX;
  let y = height / 2 + offsetY;
  
  image(imga, x, y);
  
  // Check if shaking duration has elapsed
  if (elapsedTime >= shakeDuration) {
    shakeStartTime = 0; // Reset shake start time
    label = "scene4"; // Change label to trigger scene4
  }
}

// STEP 2 classify the video!
function classifyVideo() {
  classifier.classify(video, gotResults);
}

function draw() {
  background("#081010");
  playSound();

  scene1();

  if (titleOpacity <= 0) {
    if (scene2StartTime == 0) {
      scene2StartTime = millis();
    }
    else if (millis() - scene2StartTime >= scene2WaitTime) {
      typewriterStarted = true;
      scene2();
    }
  }

  if (typewriterFinished) {
    scene3();
  }

  // Check if the label is "reach" for 3 seconds
  if (label === "reach" && millis() - reachStartTime >= 3000 && !reachSwitched) {
    reachSwitched = true;
    scene4Displayed = true; // Set the boolean variable to true
  } else if (label !== "reach") {
    // Reset timer if label is not "reach"
    reachStartTime = millis();
    reachSwitched = false;
  }
  
  // Display scene4 if scene4Displayed is true
  if (scene4Displayed) {
    scene4();
  }
  
  if (label === "look" && millis() - lookStartTime >= 3000 && !lookSwitched) {
    lookSwitched = true;
    scene5Displayed = true; // Set the boolean variable to true
  } else if (label !== "look") {
    // Reset timer if label is not "reach"
    lookStartTime = millis();
    lookSwitched = false;
  }
  
  // Display scene4 if scene4Displayed is true
  if (scene5Displayed) {
    scene5();
  }

  // Draw the video in the corner
  image(video, 330, 250); // Position the video at the top-left corner
}

// STEP 3: Get the classification!
function gotResults(results, error) {
  // Something went wrong!
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and classify again!
  label = results[0].label;
  classifyVideo();
  print(results);
}

function scene1() {
  // Update curtain positions
  background("#081010");
  if (cur1X > targetCur1X) {
    cur1X -= curtainSpeed;
  }
  if (cur2X < targetCur2X) {
    cur2X += curtainSpeed;
  }
    if (titleOpacity > 0) {
    titleOpacity -= titleFadeSpeed;
  }

  // Draw the curtains
  image(cur1, cur1X, height / 2);
  image(cur2, cur2X, height / 2);

  textSize(100);
  textAlign(CENTER, CENTER);
  fill(255, titleOpacity); // Apply opacity
  text("BUNRAKU", width / 2, height / 2 - 80);
  textFont(customFont);
  
}

function scene2() {
  background("#081010");
  // Breathing motion
  let breathingY = height / 2 + sin(breathingOffset) * breathingAmplitude;
  let imgToShow = charIndex % 3 === 0 ? img1 : img2;
  image(imgToShow, width / 2, breathingY);
  breathingOffset += breathingSpeed;
  
  // Display the typewriter text with word wrapping
  textSize(24);
  textAlign(LEFT, TOP);
  fill(255);
  let wrappedText = wordWrap(displayedText, width - 40);
  text(wrappedText, 20, height / 2 + 150);
  
  
}

// Function to handle word wrapping
function wordWrap(str, maxWidth) {
  let words = str.split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    let word = words[i];
    let width = textWidth(currentLine + ' ' + word);
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines.join('\n');
}

function typeWriter() {
  if (typewriterStarted) {
      if (charIndex < fullText.length) {
      displayedText += fullText.charAt(charIndex);
      charIndex++;
    } else {
      typewriterFinished = true;
    }
  }
}

function scene3() {
  background("#081010");


  if (label == "reach") {
    // Start shaking animation when label is "reach"
    if (!shakeStartTime) {
      shakeStartTime = millis();
    }
    imga = img3;
    shakeImage();
  } else {
    if (label == "still") {
      image(img1, width / 2, height / 2);
    } else if (label == "reach") {
      image(img3, width / 2, height / 2);
    } else if (label == "look") {
      if (!shakeStartTime) {
      shakeStartTime = millis();
    }
      imga = img4;
    shakeImage();
    } 
  }
}

function scene4() {
  // Gradually bring the background
  scene4Opacity += 1;
  if (scene4Opacity > 255) {
    scene4Opacity = 255;
  }
  
  fill(255, scene4Opacity);
  rect(0, 0, width, height);
  
  // Increase text opacity gradually
  scene4TextOpacity += 1;
  if (scene4TextOpacity > 255) {
    scene4TextOpacity = 255;
  }
  
  fill(0, scene4TextOpacity);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("You Are Free...", width / 2, height / 2);
}

function scene5() {
  background("#081010");
  
  if (spiralRadius < sqrt(sq(width) + sq(height))) {
    spiralRadius += 5;
  }

  drawSpiral(width / 2, height / 2, spiralRadius, millis() / 1000);
}

function drawSpiral(cx, cy, maxRadius, startAngle) {
  noFill();
  stroke(255);
  strokeWeight(2);

  let angle = startAngle;

  beginShape();
  for (let r = 0; r < maxRadius; r++) {
    let x = cx + cos(angle) * r;
    let y = cy + sin(angle) * r;
    vertex(x, y);
    angle += angleStep;
  }
  endShape();
  
  fill(255, 0, 0, scene5TextOpacity);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("You Fall Unconscious...", width / 2, height / 2);
}

function playSound() {
  if (sound.paused) {
    sound.play();
  }
}
