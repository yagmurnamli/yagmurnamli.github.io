/* @yagmurnamli
   Last update: March 22 2026
   Project Name: "BUNRAKU"
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
let curtainSpeed = 3;
let curtainsOpen = false;

// Font
let customFont;

// Scene & animation
let typewriterFinished = false;
let shakeStartTime = 0;
let shakeDuration = 3000;
let shakeIntensity = 5;

// Text/typewriter
let fullText = "Welcome, foolish mortal. You seek the key, do you? It holds power beyond your comprehension...";
let displayedText = "";
let charIndex = 0;
let typingSpeed = 80;
let typewriterInterval;

// Breathing
let breathingOffset = 0;
let breathingSpeed = 0.05;
let breathingAmplitude = 10;

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
  let canvas = createCanvas(700, 700);
  canvas.parent("canvas-container");  // Buraya ekledik
  textFont(customFont);
  imageMode(CENTER);

  video = createCapture(VIDEO);
  video.size(160, 120);
  video.hide();

  cur1X = width / 2;
  cur2X = width / 2;
  targetCur1X = cur1X;
  targetCur2X = cur2X;

  // START butonu
  button = createButton("START");
  button.parent("canvas-container");
  button.position(width/2 - 75, height/2 - 25); // canvas ortasında
  button.size(150, 50);
  button.style("background-color", "#8b242c");
  button.style("color", "#d6d6d6");
  button.style("font-size", "20px");
  button.style("border", "none");
  button.style("cursor", "pointer");
  button.style("font-family", customFont);
  button.mousePressed(openCurtains);

  // Pulse animasyonu
  let styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes pulse {0%{transform:scale(1);}50%{transform:scale(1.1);}100%{transform:scale(1);}}
  `;
  document.head.appendChild(styleSheet);
  button.style("animation", "pulse 2s infinite");

  classifyVideo();
}

function openCurtains() {
  if (!curtainsOpen) {
    targetCur1X = -cur1.width/2;
    targetCur2X = width + cur2.width/2;
    curtainsOpen = true;
    button.hide();

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

  // Curtain animation
  if (!curtainsOpen) {
    image(cur1, cur1X, height/2);
    image(cur2, cur2X, height/2);

    cur1X = lerp(cur1X, targetCur1X, 0.05);
    cur2X = lerp(cur2X, targetCur2X, 0.05);
  } else {
    // Scene after curtains
    scene2();
  }
}

function scene2() {
  background("#081010");
  let breathingY = height/2 + sin(breathingOffset)*breathingAmplitude;
  let imgToShow = charIndex%3===0 ? img1 : img2;
  image(imgToShow, width/2, breathingY);
  breathingOffset += breathingSpeed;

  // Altyazı
  textSize(24);
  textAlign(LEFT, TOP);
  fill(255);
  let wrappedText = wordWrap(displayedText, width-40);
  text(wrappedText, 20, height/2 + 150);
}

function wordWrap(str, maxWidth){
  let words = str.split(' ');
  let lines = [];
  let currentLine = words[0];
  for(let i=1;i<words.length;i++){
    let word = words[i];
    if(textWidth(currentLine+' '+word)<maxWidth) currentLine += ' '+word;
    else { lines.push(currentLine); currentLine = word; }
  }
  lines.push(currentLine);
  return lines.join('\n');
}

function playSound(){
  if(sound.paused) sound.play();
}
