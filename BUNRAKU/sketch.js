let video;
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/ZlwamfTxu/'; // Teachable Machine model URL
let flipVideo;
let label = "";

let curtainsOpen = false;
let subtitles = ["Welcome to Bunraku.", "Enjoy the show!", "You are free!"];
let currentSubtitle = 0;
let subtitleTimer = 0;
let subtitleDelay = 2000; // ms

let puppetPosY = 300;
let puppetBreathOffset = 0;
let startButtonClicked = false;

let startSound;

function preload() {
  // Kullanıcı etkileşimi sonrası çalmak için preload'da ses yükleme
  startSound = loadSound('start.mp3');
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {
  createCanvas(800, 600);

  // Video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  flipVideo = ml5.flipImage(video);

  // Start tuşu
  let startBtn = createButton("Start");
  startBtn.position(10, 10);
  startBtn.mousePressed(() => {
    startButtonClicked = true;
    if (startSound && !startSound.isPlaying()) startSound.play();
    openCurtains();
    classifyVideo(); // ML5 sınıflandırmayı başlat
  });
}

function draw() {
  background(0);

  drawTitle();        // BUNRAKU yazısı
  drawCurtains();     // perde animasyonu
  drawPuppet();       // kukla
  drawSubtitles();    // altyazılar
}

function drawTitle() {
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(255);
  text("BUNRAKU", width / 2, height / 2 - 200);
}

let curtainWidth = 0;
function drawCurtains() {
  fill(50);
  if (!curtainsOpen) {
    rect(0, 0, width/2 - curtainWidth, height);
    rect(width/2 + curtainWidth, 0, width/2 - curtainWidth, height);
  } else {
    // perde açılıyor animasyonlu
    if(curtainWidth < width/2) curtainWidth += 10;
    rect(0, 0, width/2 - curtainWidth, height);
    rect(width/2 + curtainWidth, 0, width/2 - curtainWidth, height);
  }
}

function openCurtains() {
  curtainsOpen = true;
}

// Kukla çizimi
function drawPuppet() {
  push();
  translate(width/2, puppetPosY + puppetBreathOffset);
  
  // nefes alma animasyonu
  if (frameCount % 60 < 30) puppetBreathOffset = -5;
  else puppetBreathOffset = 0;

  fill(200, 100, 100);
  ellipse(0, 0, 100, 150); // gövde
  fill(255, 200, 200);
  ellipse(0, -100, 50, 50); // kafa
  pop();
}

// Altyazı çizimi
function drawSubtitles() {
  if (!startButtonClicked || !curtainsOpen) return;

  fill(255);
  textSize(24);
  textAlign(CENTER, BOTTOM);
  if (millis() - subtitleTimer > subtitleDelay) {
    subtitleTimer = millis();
    currentSubtitle++;
    if(currentSubtitle >= subtitles.length) currentSubtitle = subtitles.length - 1;
  }
  text(subtitles[currentSubtitle], width/2, height - 50);
}

// ML5 hareket algılama
function classifyVideo() {
  flipVideo = ml5.flipImage(video);
  classifier.classify(flipVideo, gotResults);
}

function gotResults(error, results) {
  if(error){
    console.error(error);
    return;
  }
  label = results[0].label;
  // Burada kukla pozunu veya aksiyonu değiştir
  // Örn: label === "Jump" -> kukla yukarı zıplasın
  console.log(label);

  classifyVideo(); // sürekli sınıflandırma
}
