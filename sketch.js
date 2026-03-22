let capture;

function setup() {
createCanvas(windowWidth, windowHeight);

// webcam başlat
capture = createCapture(VIDEO);
capture.size(windowWidth, windowHeight);
capture.hide();
}

function draw() {
background(0);

// webcam görüntüsünü çiz
image(capture, 0, 0, width, height);

// basit efekt (ayna gibi)
push();
translate(width, 0);
scale(-1, 1);
image(capture, 0, 0, width, height);
pop();
}

// pencere boyutu değişirse
function windowResized() {
resizeCanvas(windowWidth, windowHeight);
capture.size(windowWidth, windowHeight);
}
