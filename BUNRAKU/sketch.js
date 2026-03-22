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

  // Ses eski Audio() ile
  startSound = new Audio('start.mp3');
}

function setup() {
  createCanvas(800, 600);

  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  // Teachable Machine modeli
  classifier = ml5.imageClassifier('model.json', video, modelReady);

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
    subtitleTimer = millis() + 1000; // 1 saniye sonra altyazı başlasın
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
    // Perde animasyonu (basit olarak siyah üstte)
    fill(0);
    rect(0, 0, width, height);

    // Altyazı gecikmeli gösterim
    if (millis() > subtitleTimer && subtitleIndex < subtitles.length) {
      showSubtitle = true;
      fill(255);
      text(subtitles[subtitleIndex], width / 2, height - 100);
      if (millis() - subtitleTimer > 3000) { // her altyazı 3 sn
        subtitleIndex++;
        subtitleTimer = millis() + 500; // 0.5 sn ara
      }
    }

    // Altyazılar bitince kukla sahnesine geç
    if (subtitleIndex >= subtitles.length) {
      scene = "puppet";
      puppetTimer = millis();
    }
  } else if (scene === "puppet") {
    // Kukla animasyonu (nefes alma gibi poz değişimi)
    if (millis() - puppetTimer > 500) { // 0.5 saniyede bir poz değiş
      currentPuppet = (currentPuppet + 1) % puppetImgs.length;
      puppetTimer = millis();
    }
    image(puppetImgs[currentPuppet], width / 2 - 100, height / 2 - 200, 200, 400);

    // ML hareketlerini kontrol et
    if (label === "move" || label === "jump") { // modeline göre değiştir
      fill(0, 255, 0);
      text("You did a move! Scene progresses...", width / 2, height - 50);
      // burada başka sahneye geçiş veya oyun mantığı eklenebilir
    }
  }

  // Video küçük kutuda göster (debug için)
  image(video, 10, 10, 160, 120);
}
