/* @yagmurnamli
   Project: BUNRAKU
   Last update: June 05
   Explanation: Bunraku puppet, key, gestures, Teachable Machine
*/

let sound, video, label = "waiting...";
let classifier, modelURL = "https://teachablemachine.withgoogle.com/models/ZlwamfTxu/";
let img1, img2, img3, img4, cur1, cur2;
let button;
let cur1X, cur2X, targetCur1X, targetCur2X;
let curtainSpeed = 2;
let curtainsOpen = false;

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
let
