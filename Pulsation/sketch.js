let metaballShader;
let balls = [];

let typedText = "hello";

let originX = 100;
let originY = 120;
let cellSize = 20;
let gap = 4;
let letterSpacing = 140;

const MAX_BALLS = 128;

// --- SHADER ---

const vert = `
attribute vec3 aPosition;
uniform float width;
uniform float height;
varying vec2 vPos;

void main() {
  gl_Position = vec4(aPosition, 1.0);
  vPos = vec2((gl_Position.x + 1.0) * 0.5 * width,
              (gl_Position.y + 1.0) * 0.5 * height);
}
`;

const frag = `
precision highp float;

#define BALLS 128

uniform float xs[BALLS];
uniform float ys[BALLS];
uniform float rs[BALLS];

varying vec2 vPos;

void main() {
  float sum = 0.0;

  for (int i = 0; i < BALLS; i++) {
    float dx = xs[i] - vPos.x;
    float dy = ys[i] - vPos.y;
    float d = length(vec2(dx, dy));
    sum += rs[i] / d;
  }

  if (sum > 11.0) {
    gl_FragColor = vec4(0.4, 0.0, 0.0, 0.9);
  } else {
    float smoothness = 0.5 - smoothstep(0.0, 1.5, abs(sum - 11.0));
    vec3 color = mix(vec3(0.0), vec3(0.4, 0.0, 0.0), smoothness);
    gl_FragColor = vec4(color, 1.0);
  }
}
`;

// --- SETUP ---

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  noStroke();

  metaballShader = createShader(vert, frag);
  shader(metaballShader);

  metaballShader.setUniform("width", width);
  metaballShader.setUniform("height", height);

  generateWord(typedText);
}

// --- DRAW ---

function draw() {
  background(0);

  let xs = new Array(MAX_BALLS).fill(0);
  let ys = new Array(MAX_BALLS).fill(0);
  let rs = new Array(MAX_BALLS).fill(0);

  for (let i = 0; i < min(balls.length, MAX_BALLS); i++) {
    xs[i] = balls[i].x;
    ys[i] = balls[i].y;
    rs[i] = balls[i].r;
  }

  metaballShader.setUniform("xs", xs);
  metaballShader.setUniform("ys", ys);
  metaballShader.setUniform("rs", rs);

  quad(-1, -1, 1, -1, 1, 1, -1, 1);

  for (let b of balls) {
    b.update();
  }
}

// --- WORD GENERATION ---

function generateWord(word) {
  balls = [];

  word = word.toLowerCase();

  for (let k = 0; k < word.length; k++) {
    let letter = letterData[word[k]];
    if (!letter) continue;

    for (let i = 0; i < letter.length; i++) {
      for (let j = 0; j < letter[i].length; j++) {

        if (letter[i][j] === 1) {
          let x = originX + j * (cellSize + gap) + k * letterSpacing;
          let y = height - (originY + i * (cellSize + gap));

          balls.push(new Ball(x, y));
        }
      }
    }
  }
}

// --- INPUT ---

function keyTyped() {
  if (key === ' ') {
    typedText += " ";
  } else if (/[a-z]/.test(key)) {
    typedText += key;
  }

  generateWord(typedText);
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    typedText = typedText.slice(0, -1);
    generateWord(typedText);
  }

  if (keyCode === ENTER) {
    typedText = "";
    generateWord(typedText);
  }
}

// --- RESIZE ---

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

// --- BALL CLASS ---

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    let angle = random(TWO_PI);
    let speed = 2;

    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;

    this.r = random(20, 30);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    this.vx += random(-0.05, 0.05);
    this.vy += random(-0.05, 0.05);
  }
}

// --- FULL ALPHABET (compact grid) ---

const letterData = {
  a:[[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1]],
  b:[[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  c:[[0,1,1],[1,0,0],[1,0,0],[0,1,1]],
  d:[[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  e:[[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  f:[[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
  g:[[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
  h:[[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  i:[[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  j:[[0,1,1],[0,0,1],[0,0,1],[1,0,1],[0,1,0]],
  k:[[1,0,1],[1,1,0],[1,0,0],[1,1,0],[1,0,1]],
  l:[[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  m:[[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  n:[[1,0,1],[1,1,1],[1,1,1],[1,1,1],[1,0,1]],
  o:[[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  p:[[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
  q:[[0,1,0],[1,0,1],[1,0,1],[0,1,0],[0,0,1]],
  r:[[1,1,0],[1,0,1],[1,1,0],[1,1,0],[1,0,1]],
  s:[[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
  t:[[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  u:[[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  v:[[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]],
  w:[[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
  x:[[1,0,1],[0,1,0],[0,1,0],[0,1,0],[1,0,1]],
  y:[[1,0,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  z:[[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]]
};
