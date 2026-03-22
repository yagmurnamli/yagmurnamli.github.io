/* vcd436s24 - Project (4/4): Submission
  @yagmurnamli
   Last update: June 05
   Project Name: "BUNRAKU"
   Explanation: A Japanese puppet, Bunraku, is holding a key. Can you take it or not? An interactive experience based on Teachable Machine and player gestures.
*/

let sound;
let video;
let label = "waiting...";
// Classifier
let classifier;
let modelURL = "https://teachablemachine.withgoogle.com/models/ZlwamfTxu/";
// Images
let img1, img2, img3, img4, cur1, cur2;
// Button
let button;
// Curtains
let cur1X, cur2X, targetCur1X, targetCur2X;
let curtainSpeed = 2;
let curtainsOpen = false;

// Font
let customFont;

// Scene & animation
let typewriterFinished = false;
let shakeStartTime = 0;
let shakeDuration = 3000;
let shakeIntensity = 5;
let reachSwitched = false;
let reachStartTime = 0;
let scene4Displayed = false;
let scene4Opacity = 0;
let lookSwitched = false;
let lookStartTime = 0;
let scene5Displayed = false;
let spiralRadius = 0;
let angleStep = 0.5;
let imga;
let scene4TextOpacity = 0;
let scene5TextOpacity = 0;

// Text/typewriter
let fullText = "Welcome, foolish mortal. You seek the key, do you? It holds power beyond your comprehension. But do you dare to claim it? I am the guardian, the puppet master. Face me if you dare, but beware, the consequences may be dire.";
let displayedText = "";
let charIndex = 0;
let typingSpeed = 80;
let typewriterInterval;

// Breathing
let breathingOffset = 0;
let breathingSpeed = 0.05;
let breathingAmplitude = 10;

// Title
let titleOpacity = 255;
let titleFadeSpeed = 0;

function preload() {
  sound = new Audio('start.mp3');
  classifier = ml5.imageClassifier(modelURL + "model.json");
  img1 = loadImage("images/puppet1.png");
  img2 = loadImage("images/puppet2.png");
  img3 = loadImage("images/puppet3.png");
  img4 = loadImage("images/puppet4.png");
  cur1 = loadImage("images/curtain1.png");
  cur2 = loadImage("images/curtain2.png");
  customFont = loadFont("font/MaleriTrialSN-Book.otf");
}

function setup() {
  createCanvas(700, 700);
  textFont(customFont);
  imageMode(CENTER);

  video = createCapture(VIDEO);
  video.size(160, 120);
  video.hide();

  cur1X = width / 2;
  cur2X = width / 2;
  targetCur1X = cur1X;
  targetCur2X = cur2X;

  button = createButton("START");
  button.size(150, 50);
  button.style("background-color", "#8b242c");
  button.style("color", "#d6d6d6");
  button.style("font-size", "20px");
  button.style("border", "none");
  button.style("cursor", "pointer");
  button.style("font-family", customFont);
  button.position((width - button.width)/2, height/2);
  button.mousePressed(openCurtains);

  // Pulse animation
  button.style("animation", "pulse 2s infinite");
  let pulseAnimation = `@keyframes pulse {0%{transform:scale(1);}50%{transform:scale(1.1);}100%{transform:scale(1);}}`;
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = pulseAnimation;
  document.head.appendChild(styleSheet);

  // STEP 2: Start classification
  classifyVideo();
}

function openCurtains() {
  if (!curtainsOpen) {
    targetCur1X = -cur1.width / 2;
    targetCur2X = width + cur2.width / 2;
    curtainsOpen = true;
    button.hide();
    titleFadeSpeed = 1.9;

    // Typewriter başlasın
    typewriterInterval = setInterval(typeWriter, typingSpeed);
  }
}

function typeWriter() {
  if (charIndex < fullText.length) {
    displayedText += fullText.charAt(charIndex);
    charIndex++;
  } else {
    typewriterFinished = true;
    clearInterval(typewriterInterval);
  }
}

function classifyVideo() {
  classifier.classify(video, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  classifyVideo();
}

function draw() {
  background("#081010");
  playSound();

  scene1();

  if (titleOpacity <= 0) {
    scene2();
  }

  if (typewriterFinished) {
    scene3();
  }

  if (label === "reach" && millis() - reachStartTime >= 3000 && !reachSwitched) {
    reachSwitched = true;
    scene4Displayed = true;
  } else if (label !== "reach") {
    reachStartTime = millis();
    reachSwitched = false;
  }

  if (scene4Displayed) scene4();

  if (label === "look" && millis() - lookStartTime >= 3000 && !lookSwitched) {
    lookSwitched = true;
    scene5Displayed = true;
  } else if (label !== "look") {
    lookStartTime = millis();
    lookSwitched = false;
  }

  if (scene5Displayed) scene5();

  image(video, 330, 250);
}

function scene1() {
  background("#081010");
  if (cur1X > targetCur1X) cur1X -= curtainSpeed;
  if (cur2X < targetCur2X) cur2X += curtainSpeed;
  if (titleOpacity > 0) titleOpacity -= titleFadeSpeed;

  image(cur1, cur1X, height/2);
  image(cur2, cur2X, height/2);

  if (!curtainsOpen) {
    textSize(100);
    textAlign(CENTER, CENTER);
    fill(255, titleOpacity);
    text("BUNRAKU", width/2, height/2 - 80);
  }
}

function scene2() {
  background("#081010");
  let breathingY = height/2 + sin(breathingOffset) * breathingAmplitude;
  let imgToShow = charIndex % 3 === 0 ? img1 : img2;
  image(imgToShow, width/2, breathingY);
  breathingOffset += breathingSpeed;

  // Altyazı
  if (curtainsOpen) {
    textSize(24);
    textAlign(LEFT, TOP);
    fill(255);
    let wrappedText = wordWrap(displayedText, width-40);
    text(wrappedText, 20, height/2 + 150);
  }
}

function scene3() {
  background("#081010");
  if (label === "reach") {
    if (!shakeStartTime) shakeStartTime = millis();
    imga = img3;
    shakeImage();
  } else if (label === "look") {
    if (!shakeStartTime) shakeStartTime = millis();
    imga = img4;
    shakeImage();
  } else {
    image(img1, width/2, height/2);
  }
}

function shakeImage() {
  let elapsed = millis() - shakeStartTime;
  let offsetX = random(-shakeIntensity, shakeIntensity);
  let offsetY = random(-shakeIntensity, shakeIntensity);
  image(imga, width/2 + offsetX, height/2 + offsetY);
  if (elapsed >= shakeDuration) {
    shakeStartTime = 0;
    label = "scene4";
  }
}

function scene4() {
  scene4Opacity += 1; if(scene4Opacity>255)scene4Opacity=255;
  fill(255, scene4Opacity);
  rect(0,0,width,height);

  scene4TextOpacity += 1; if(scene4TextOpacity>255)scene4TextOpacity=255;
  fill(0,scene4TextOpacity);
  textSize(32);
  textAlign(CENTER,CENTER);
  text("You Are Free...", width/2, height/2);
}

function scene5() {
  background("#081010");
  if (spiralRadius < sqrt(sq(width)+sq(height))) spiralRadius+=5;
  drawSpiral(width/2, height/2, spiralRadius, millis()/1000);
}

function drawSpiral(cx,cy,maxRadius,startAngle){
  noFill(); stroke(255); strokeWeight(2);
  let angle = startAngle;
  beginShape();
  for(let r=0;r<maxRadius;r++){
    let x = cx + cos(angle)*r;
    let y = cy + sin(angle)*r;
    vertex(x,y);
    angle += angleStep;
  }
  endShape();

  fill(255,0,0,scene5TextOpacity);
  textSize(32);
  textAlign(CENTER,CENTER);
  text("You Fall Unconscious...", cx, cy);
}

function wordWrap(str,maxWidth){
  let words = str.split(' ');
  let lines = [];
  let currentLine = words[0];
  for(let i=1;i<words.length;i++){
    let word = words[i];
    if(textWidth(currentLine+' '+word)<maxWidth) currentLine+=' '+word;
    else{lines.push(currentLine); currentLine=word;}
  }
  lines.push(currentLine);
  return lines.join('\n');
}

function playSound(){
  if(sound.paused) sound.play();
}
