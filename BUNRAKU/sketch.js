/* vcd436s24 - Project (4/4): Submission
  @yagmurnamli
   last update: June 05
   Project Name: "BUNRAKU"
   Explanation: Bunraku interactive experience without canvas
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

// Text / typewriter
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
let titleOpacity = 1; // Opacity DOM ile

// Typewriter delay
let startTypewriterTimer = 0;
let typewriterDelay = 1500; // ms (1.5 saniye)

// DOM container references
let gameContainer;
let puppetImg;
let curtain1Img, curtain2Img;
let subtitleDiv;

function preload() {
  sound = new Audio('sound/start.mp3');
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
  // DOM container
  gameContainer = document.getElementById("canvas-container");
  
  // Puppet element
  puppetImg = document.createElement("img");
  puppetImg.src = img1.canvas ? img1.canvas.toDataURL() : ""; // fallback
  puppetImg.style.position = "absolute";
  puppetImg.style.top = "50%";
  puppetImg.style.left = "50%";
  puppetImg.style.transform = "translate(-50%, -50%)";
  puppetImg.style.width = "400px";
  gameContainer.appendChild(puppetImg);

  // Curtains
  curtain1Img = document.createElement("img");
  curtain1Img.src = cur1.canvas ? cur1.canvas.toDataURL() : "";
  curtain1Img.style.position = "absolute";
  curtain1Img.style.top = "50%";
  curtain1Img.style.left = "50%";
  curtain1Img.style.transform = "translate(-50%, -50%)";
  curtain1Img.style.width = "350px";
  gameContainer.appendChild(curtain1Img);

  curtain2Img = document.createElement("img");
  curtain2Img.src = cur2.canvas ? cur2.canvas.toDataURL() : "";
  curtain2Img.style.position = "absolute";
  curtain2Img.style.top = "50%";
  curtain2Img.style.left = "50%";
  curtain2Img.style.transform = "translate(-50%, -50%)";
  curtain2Img.style.width = "350px";
  gameContainer.appendChild(curtain2Img);

  // Subtitle text
  subtitleDiv = document.createElement("div");
  subtitleDiv.style.position = "absolute";
  subtitleDiv.style.bottom = "100px";
  subtitleDiv.style.left = "50%";
  subtitleDiv.style.transform = "translateX(-50%)";
  subtitleDiv.style.color = "#fff";
  subtitleDiv.style.fontFamily = customFont ? customFont.name : "monospace";
  subtitleDiv.style.fontSize = "22px";
  subtitleDiv.style.whiteSpace = "pre-line";
  gameContainer.appendChild(subtitleDiv);

  // START button
  button = document.createElement("button");
  button.innerText = "START";
  button.style.position = "absolute";
  button.style.top = "50%";
  button.style.left = "50%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.padding = "12px 24px";
  button.style.fontSize = "20px";
  button.style.backgroundColor = "#8b242c";
  button.style.color = "#d6d6d6";
  button.style.border = "none";
  button.style.cursor = "pointer";
  gameContainer.appendChild(button);
  button.addEventListener("click", openCurtains);

  classifyVideo();
  requestAnimationFrame(loopDOM); // DOM tabanlı animasyon
}

function loopDOM() {
  updateCurtains();
  updatePuppet();
  updateSubtitle();
  playSound();
  requestAnimationFrame(loopDOM);
}

function openCurtains() {
  curtainsOpen = true;
  button.style.display = "none";
}

function updateCurtains() {
  if (!curtainsOpen) return;

  if (!cur1X) cur1X = 0;
  if (!cur2X) cur2X = 0;

  // Basit hareket animasyonu
  cur1X -= curtainSpeed;
  cur2X += curtainSpeed;

  curtain1Img.style.left = `calc(50% + ${-cur1X}px)`;
  curtain2Img.style.left = `calc(50% + ${cur2X}px)`;
}

function updatePuppet() {
  // Breathing animasyonu
  breathingOffset += breathingSpeed;
  let yOffset = Math.sin(breathingOffset) * breathingAmplitude;
  puppetImg.style.transform = `translate(-50%, calc(-50% + ${yOffset}px))`;
}

function updateSubtitle() {
  if (curtainsOpen && cur1X <= -curtain1Img.width && cur2X >= curtain2Img.width) {
    if (!typewriterInterval) {
      typewriterInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          displayedText += fullText.charAt(charIndex);
          charIndex++;
        } else {
          typewriterFinished = true;
          clearInterval(typewriterInterval);
        }
        subtitleDiv.innerText = displayedText;
      }, typingSpeed);
    }
  }
}

// Video classification
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

function playSound() {
  if (sound && sound.paused) sound.play();
}
