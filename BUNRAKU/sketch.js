function setup() {
  let canvas = createCanvas(700, 700);
  canvas.parent("canvas-container");
  background(0);
}

function draw() {
  background(0);
  fill(255,0,0);
  ellipse(width/2, height/2, 100,100);
}
