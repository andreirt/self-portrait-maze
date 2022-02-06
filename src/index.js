// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
// window.$fxhashFeatures = {
//   "Background": "Black",
//   "Number of lines": 10,
//   "Inverted": true
// }

import Maze from './maze';
import Daedalus from './daedalus';

let video;
let videoContext;
let videoX, videoY, videoWidth, videoHeight;
let videoCanvas;
let mazeCanvas;

let maze;
let daedalus;
let finished = true;

let fps = 8;
let fpsInterval = 1000 / fps;
let then = Date.now();

let EDGE;

window.$fxhashFeatures = {
  "edge": getEdgeValue(),
  "fps": getFpsValue(),
};

function init() {
  video = document.getElementById('camera-video');
  videoCanvas = document.getElementById('video-canvas');
  videoContext = videoCanvas.getContext('2d');

  mazeCanvas = document.getElementById('maze-canvas');
  
  navigator.mediaDevices.getUserMedia({video: true})
    .then(function(stream) {        
      video.srcObject = stream;

      video.addEventListener('loadedmetadata', function () {

        oneTimeSetup();
        setup();
        
        window.addEventListener('resize', function () {
          setup();
        });

      });      

    })
    .catch(function(error) {
      console.log(error);
        window.alert('You need a webcam to see this work');
    });
}

function oneTimeSetup() {
  EDGE = window.$fxhashFeatures['edge'];
  EDGE = 16;

  fps = window.$fxhashFeatures['fps'];
  fps = 60;
  fpsInterval = 1000 / fps;
}

function getEdgeValue() {
  let edges = [2, 4, 6, 8, 10, 12, 14, 16];
  return edges[ Math.floor(fxrand() * edges.length) ];
}

function getFpsValue() {  
  return 8 + Math.floor(fxrand() * 22);
}

function setup() {
  videoCanvas.width = window.innerWidth;
  videoCanvas.height = window.innerHeight;
  
  mazeCanvas.width = window.innerWidth;
  mazeCanvas.height = window.innerHeight;

  let hRatio = window.innerWidth / video.videoWidth;
  let vRatio = window.innerHeight / video.videoHeight;

  let ratio = Math.max(hRatio, vRatio);
  let scaledWidth = video.videoWidth * ratio;
  let scaledHeight = video.videoHeight * ratio;
  let screenX = Math.round((scaledWidth - window.innerWidth) / 2);
  let screenY = Math.round((scaledHeight - window.innerHeight) / 2);

  videoX = Math.round(screenX / ratio);
  videoY = Math.round(screenY / ratio);
  videoWidth = video.videoWidth - (videoX * 2);
  videoHeight = video.videoHeight - (videoY * 2);

  let mazeWidth =  Math.floor( (window.innerWidth - (EDGE * 1)) / (EDGE * 2) );
  let mazeHeight = Math.floor( (window.innerHeight - (EDGE * 1)) / (EDGE * 2) );

  maze = new Maze(mazeWidth, mazeHeight);
  maze.generate();  

  daedalus = new Daedalus(maze, EDGE, videoCanvas, mazeCanvas);
  
  // para evitar que o resize gere dois draw() simultâneos
  if (finished) {
    finished = false;
    draw();
  }
}

function draw() {

  const now = Date.now();
  const elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {

    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);
  
    if (!daedalus.finished)
      daedalus.drawStep();
    else {
      finished = true;
    }    
  }

  videoContext.drawImage(video, videoX, videoY, videoWidth, videoHeight, 0, 0, window.innerWidth, window.innerHeight);

  if (!finished)
      requestAnimationFrame(draw);
}

init(); 