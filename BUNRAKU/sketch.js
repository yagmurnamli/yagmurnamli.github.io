// sketch.js

let video;
let classifier;
let label = "";
let puppetImgs = [];
let currentPuppet = 0;
let puppetTimer = 0;

let scene = "intro"; // intro -> curtain -> puppet
let startButtonPressed = false;

// Audio
let startSound;

// Altyazılar
let subtitles = [
  "Welcome to the world of Bunraku...",
  "Watch closely as the puppets come alive."
];
let subtitleIndex = 0;
let subtitleTimer = 0;
let showSubtitle = false;

function preload() {
  // Kukla pozlarını yükle
  for (let i = 1; i <= 4; i++) {
    puppetImgs.push(loadImage(`puppet${i}.png`));
  }

  // Ses (eski Audio() kullanımı)
  startSound = new Audio('start.mp3');
}

function setup() {
  createCanvas(800, 600);

  // Video capture
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  // Teachable Machine modeli
  classifier = ml5.imageClassifier(
    'https://teachablemachine.withgoogle.com/models/ZlwamfTxu/model.json',
    video,
    modelReady
  );

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);

  // Başlatma butonu
  let btn = createButton("START");
  btn.position(width / 2 - 50, height / 2 + 100);
  btn.mousePressed(() => {
    startButtonPressed = true;
    startSound.play();
    scene = "curtain";
    subtitleTimer = millis() + 1000; // 1 saniye gecikme ile altyazı başlasın
  });
}

function modelReady() {
  console.log("Model ready!");
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  classifyVideo(); // sürekli sınıflandır
}

function draw() {
  background(0);

  if (scene === "intro") {
    fill(255);
    text("BUNRAKU", width / 2, height / 2);
  } else if (scene === "curtain") {
    // Perdeyi basit siyah ekran ile simüle ediyoruz
    fill(0);
    rect(0, 0, width, height);

    // Altyazı gösterimi
    if (millis() > subtitleTimer && subtitleIndex < subtitles.length) {
      showSubtitle = true;
      fill(255);
      text(subtitles[subtitleIndex], width / 2, height - 100);
      if (millis() - subtitleTimer > 3000) { // 3 saniye her altyazı
        subtitleIndex++;
        subtitleTimer = millis() + 500; // 0.5 saniye ara
      }
    }

    // Altyazılar bitince kukla sahnesine geç
    if (subtitleIndex >= subtitles.length) {
      scene = "puppet";
      puppetTimer = millis();
    }
  } else if (scene === "puppet") {
    // Kukla animasyonu (nefes alma)
    if (millis() - puppetTimer > 500) { // her 0.5 saniye poz değiş
      currentPuppet = (currentPuppet + 1) % puppetImgs.length;
      puppetTimer = millis();
    }
    image(puppetImgs[currentPuppet], width / 2 - 100, height / 2 - 200, 200, 400);

    // ML hareketleri algılaması
    if (label === "Move" || label === "Jump") { // modeline göre label
      fill(0, 255, 0);
      text("You did a move! Scene progresses...", width / 2, height - 50);
      // Buraya oyun mantığı eklenebilir
    }
  }

  // Küçük video kutusu (debug)
  image(video, 10, 10, 160, 120);
}
