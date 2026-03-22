let sound, video, classifier;
let label = "waiting...";
let modelURL = "https://teachablemachine.withgoogle.com/models/ZlwamfTxu/model.json";

let img1, img2, img3, img4, cur1, cur2;
let button;

let cur1X, cur2X, targetCur1X, targetCur2X;
let curtainSpeed = 2;
let curtainsOpen = false;

let customFont;
let displayedText = "";
let charIndex = 0;
let typingSpeed = 80;
let fullText = "Welcome, foolish mortal. You seek the key, do you? It holds power beyond your comprehension. But do you dare to claim it? I am the guardian, the puppet master. Face me if you dare, but beware, the consequences may be dire.";
let typewriterFinished = false;

let breathingOffset = 0;
let breathingSpeed = 0.03;
let breathingAmplitude = 10;

let shakeStartTime = 0;
let shakeDuration = 3000;
let shakeIntensity = 5;
let reachStartTime = 0;
let lookStartTime = 0;
let reachSwitched = false;
let lookSwitched = false;

let scene4Displayed = false;
let scene4Opacity = 0;
let scene4TextOpacity = 0;

let scene5Displayed = false;
let spiralRadius = 0;
let angleStep = 0.5;
let scene5TextOpacity = 0;

let classifierStarted = false;
let typewriterDelay = 2000; // start typewriter 2 sec after curtain opens

function preload() {
  sound = new Audio('sound/Bunraku puppet theatre.mp3');
  classifier = ml5.imageClassifier(modelURL);
  
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
  video.size(320, 240);
  video.hide();

  cur1X = width / 2;
  cur2X = width / 2;
  targetCur1X = cur1X;
  targetCur2X = cur2X;

  button = createButton("start");
  button.size(150, 50);
  button.style("background-color", "#8b242c");
  button.style("color", "#d6d6d6");
  button.style("font-size", "20px");
  button.style("border", "none");
  button.style("cursor", "pointer");
  button.style("font-family", customFont);
  button.position((width - button.width)/2, height/2);
  button.mousePressed(openCurtains);

  let pulseAnimation = `@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }`;
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = pulseAnimation;
  document.head.appendChild(styleSheet);
  button.style("animation", "pulse 2s infinite");
}

function draw() {
  background("#081010");
  playSound();
  
  scene1();

  // start typewriter only after curtain fully opened + delay
  if(curtainsOpen && cur1X <= targetCur1X && cur2X >= targetCur2X && !classifierStarted){
    classifierStarted = true;
    setTimeout(() => {
      typewriterInterval = setInterval(typeWriter, typingSpeed);
      classifyVideo();
    }, typewriterDelay);
  }

  if(typewriterFinished){
    scene3();
  }

  // reach label logic
  if(label === "reach" && !reachSwitched && millis() - reachStartTime >= 3000){
    reachSwitched = true;
    scene4Displayed = true;
  } else if(label !== "reach"){
    reachStartTime = millis();
    reachSwitched = false;
  }

  // look label logic
  if(label === "look" && !lookSwitched && millis() - lookStartTime >= 3000){
    lookSwitched = true;
    scene5Displayed = true;
  } else if(label !== "look"){
    lookStartTime = millis();
    lookSwitched = false;
  }

  if(scene4Displayed) scene4();
  if(scene5Displayed) scene5();

  image(video, 500, 100, 160, 120);
}

// Curtain opening
function openCurtains(){
  if(!curtainsOpen){
    targetCur1X = -cur1.width/2;
    targetCur2X = width + cur2.width/2;
    curtainsOpen = true;
    button.hide();
  }
}

// Typewriter
function typeWriter(){
  if(charIndex < fullText.length){
    displayedText += fullText.charAt(charIndex);
    charIndex++;
  } else {
    typewriterFinished = true;
    clearInterval(typewriterInterval);
  }
}

// Scene1: curtain + title
function scene1(){
  if(cur1X > targetCur1X) cur1X -= curtainSpeed;
  if(cur2X < targetCur2X) cur2X += curtainSpeed;

  textSize(100);
  textAlign(CENTER, CENTER);
  fill(255);
  text("BUNRAKU", width/2, height/2 - 80);

  image(cur1, cur1X, height/2);
  image(cur2, cur2X, height/2);
}

// Scene2: typewriter + breathing
function scene2(){
  background("#081010");
  let breathingY = height/2 + sin(breathingOffset) * breathingAmplitude;
  breathingOffset += breathingSpeed;
  image(img1, width/2, breathingY);

  textSize(24);
  textAlign(LEFT, TOP);
  fill(255);
  let wrappedText = wordWrap(displayedText, width - 40);
  text(wrappedText, 20, height/2 + 150);
}

// Scene3: breathing + label movement
function scene3(){
  background("#081010");

  // Breathing animation
  let breathingY = height/2 + sin(breathingOffset) * breathingAmplitude;
  breathingOffset += breathingSpeed;
  image(img1, width/2, breathingY);

  // Movement / shake
  if(label === "reach" || label === "look"){
    if(shakeStartTime === 0) shakeStartTime = millis();
    imga = label === "reach" ? img3 : img4;
    shakeImage();
  }
}

function shakeImage(){
  let elapsed = millis() - shakeStartTime;
  let offsetX = random(-shakeIntensity, shakeIntensity);
  let offsetY = random(-shakeIntensity, shakeIntensity);
  image(imga, width/2 + offsetX, height/2 + offsetY);

  if(elapsed >= shakeDuration){
    shakeStartTime = 0;
  }
}

// Scene4: You Are Free
function scene4(){
  scene4Opacity += 1;
  if(scene4Opacity > 255) scene4Opacity = 255;
  fill(255, scene4Opacity);
  rect(0, 0, width, height);

  scene4TextOpacity += 1;
  if(scene4TextOpacity > 255) scene4TextOpacity = 255;
  fill(0, scene4TextOpacity);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("You Are Free...", width/2, height/2);
}

// Scene5: spiral
function scene5(){
  background("#081010");
  if(spiralRadius < sqrt(sq(width)+sq(height))) spiralRadius += 5;
  drawSpiral(width/2, height/2, spiralRadius, millis()/1000);
}

function drawSpiral(cx, cy, maxRadius, startAngle){
  noFill();
  stroke(255);
  strokeWeight(2);

  let angle = startAngle;
  beginShape();
  for(let r=0; r<maxRadius; r++){
    let x = cx + cos(angle)*r;
    let y = cy + sin(angle)*r;
    vertex(x, y);
    angle += angleStep;
  }
  endShape();

  fill(255, 0, 0, scene5TextOpacity);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("You Fall Unconscious...", cx, cy);
}

// Word wrap
function wordWrap(str, maxWidth){
  let words = str.split(' ');
  let lines = [];
  let currentLine = words[0];

  for(let i=1; i<words.length; i++){
    let word = words[i];
    if(textWidth(currentLine + ' ' + word) < maxWidth){
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines.join('\n');
}

// ml5 classify
function classifyVideo(){
  classifier.classify(video, gotResults);
}

function gotResults(error, results){
  if(error){ console.error(error); return; }
  if(results && results[0]){
    label = results[0].label;
    console.log(label);
  }
  classifier.classify(video, gotResults);
}

// Play sound
function playSound(){
  if(sound.paused) sound.play();
}
