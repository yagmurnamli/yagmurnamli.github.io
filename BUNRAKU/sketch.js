// sketch.js

let video;
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/ZlwamfTxu/'; // Teachable Machine model klasörünüz
let label = "";
let confidence = 0;

let curtain = 0; // perde pozisyonu
let curtainSpeed = 2; 
let showCurtain = true;

let subtitleIndex = 0;
let subtitles = ["Welcome to BUNRAKU", "Move your hands to interact!"];
let subtitleTimer = 0;
let subtitleDelay = 2000;

let puppetImg; // kukla resmi
let puppetX, puppetY;
let puppetPose = "idle";

let startSound;

let gameStarted = false;

function preload() {
  // Ses dosyası
  startSound = loadSound('start.mp3');
  // Kukla resmi
  puppetImg = loadImage('puppet.png');
}

function setup() {
  createCanvas(800, 600);
  
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  // Teachable Machine modelini yükle
  classifier = ml5.imageClassifier(modelURL + 'model.json', video, modelReady);

  puppetX = width / 2;
  puppetY = height - 200;

  textAlign(CENTER, CENTER);
  textSize(32);
}

function modelReady() {
  console.log("Model loaded!");
  classifyVideo();
}

// ML5 sınıflandırma
function classifyVideo() {
  classifier.classify(gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  
  label = results[0].label;
  confidence = results[0].confidence;

  // Kukla hareketini değiştir
  if (label === "MoveLeft") puppetPose = "left";
  else if (label === "MoveRight") puppetPose = "right";
  else puppetPose = "idle";

  classifyVideo(); // sürekli sınıflandır
}

function draw() {
  background(0);

  // BUNRAKU yazısı
  if (!gameStarted) {
    fill(255);
    text("BUNRAKU", width/2, height/2);
  }

  // Perde açılıyor
  if (showCurtain) {
    fill(100);
    rect(0, 0, width, curtain);
    rect(0, height - curtain, width, curtain);
    
    curtain += curtainSpeed;
    if (curtain > height/2) {
      showCurtain = false;
      gameStarted = true;
      subtitleTimer = millis(); // altyazıyı başlat
    }
  }

  // Altyazılar perdeden sonra
  if (gameStarted && subtitleIndex < subtitles.length) {
    fill(255);
    text(subtitles[subtitleIndex], width/2, 50);
    if (millis() - subtitleTimer > subtitleDelay) {
      subtitleIndex++;
      subtitleTimer = millis();
    }
  }

  // Kukla çizimi
  drawPuppet();
}

function drawPuppet() {
  if (!puppetImg) return;

  let offset = 0;
  if (puppetPose === "left") offset = -20;
  else if (puppetPose === "right") offset = 20;

  image(puppetImg, puppetX + offset - puppetImg.width/2, puppetY - puppetImg.height/2);
}

// Kullanıcı etkileşimi ile sesi başlat
function mousePressed() {
  if (!startSound.isPlaying()) {
    startSound.play();
  }
}
