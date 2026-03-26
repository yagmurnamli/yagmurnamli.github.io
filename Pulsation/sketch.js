let metaballShader;
let balls = [];

let state = "idle"; // "idle" | "explode"

let word = "hello";
let gridSize = 12;
let spacing = 20;

const MAX_BALLS = 256;

// SHADER
const vert = `
attribute vec3 aPosition;
varying vec2 vPos;

void main() {
  vPos = (aPosition.xy + 1.0) * 0.5;
  gl_Position = vec4(aPosition, 1.0);
}
`;

const frag = `
precision highp float;

#define MAX 256

uniform int count;
uniform float xs[MAX];
uniform float ys[MAX];
uniform float rs[MAX];

varying vec2 vPos;

void main() {
  float sum = 0.0;

  for(int i = 0; i < MAX; i++){
    if(i >= count) break;

    float dx = xs[i] - vPos.x;
    float dy = ys[i] - vPos.y;
    float d = length(vec2(dx, dy));

    sum += rs[i] / d;
  }

  if(sum > 12.0){
    gl_FragColor = vec4(0.3, 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = vec4(0.0);
  }
}
`;

function setup() {
  createCanvas(600, 600, WEBGL);

  metaballShader = createShader(vert, frag);
  shader(metaballShader);

  generateWord(word);
}

function draw() {
  background(0);

  let xs = [];
  let ys = [];
  let rs = [];

  for (let b of balls) {
    b.update();

    xs.push(b.x / width);
    ys.push(1.0 - b.y / height);
    rs.push(b.r / width);
  }

  metaballShader.setUniform("count", balls.length);
  metaballShader.setUniform("xs", xs);
  metaballShader.setUniform("ys", ys);
  metaballShader.setUniform("rs", rs);

  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

// HARF OLUŞTUR
function generateWord(txt) {
  balls = [];

  let startX = 80;
  let startY = 150;

  for (let k = 0; k < txt.length; k++) {
    let char = txt[k];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (random() < 0.4) continue;

        let x = startX + k * 80 + i * spacing;
        let y = startY + j * spacing;

        balls.push(new Ball(x, y));
      }
    }
  }
}

// BALL CLASS
class Ball {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;

    this.x = x;
    this.y = y;

    this.r = 20;

    this.angle = random(TWO_PI);

    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
  }

  update() {
    if (state === "idle") {
      // SABİT + PULSING
      this.x = this.baseX;
      this.y = this.baseY;

      this.angle += 0.05;
      this.r = 18 + sin(this.angle) * 4;
    }

    if (state === "explode") {
      // DAĞILMA
      this.x += this.vx;
      this.y += this.vy;

      // bounce
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // metaball etkisi
      for (let other of balls) {
        if (other === this) continue;

        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let d = sqrt(dx * dx + dy * dy);

        if (d > 0) {
          this.vx += dx / (d * 50);
          this.vy += dy / (d * 50);
        }
      }
    }
  }
}

// ENTER → DAĞIL
function keyPressed() {
  if (keyCode === ENTER) {
    state = "explode";
  }
}
