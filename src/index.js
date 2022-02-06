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


let video;
let videoCanvas;
let mazeCanvas;

function init() {
  video = document.getElementById('camera-video');
  videoCanvas = document.getElementById('video-canvas');
  mazeCanvas = document.getElementById('maze-canvas');

  setupSize();
  window.addEventListener('resize', setupSize);

  navigator.mediaDevices.getUserMedia({video: true})
    .then(function(stream) {        
        video.srcObject = stream;
        update();
    })
    .catch(function(error) {
      console.log(error);
        window.alert('You need a webcam to see this work');
    });
}

function setupSize() {
  videoCanvas.width = window.innerWidth;
  videoCanvas.height = window.innerHeight;

  mazeCanvas.width = window.innerWidth;
  mazeCanvas.height = window.innerHeight;
}

function update() {

  let hRatio = window.innerWidth / video.videoWidth;
  let vRatio = window.innerHeight / video.videoHeight;

  let ratio = Math.max(hRatio, vRatio);
  let scaledWidth = video.videoWidth * ratio;
  let scaledHeight = video.videoHeight * ratio;
  let screenX = Math.round((scaledWidth - window.innerWidth) / 2);
  let screenY = Math.round((scaledHeight - window.innerHeight) / 2);

  let videoX = Math.round(screenX / ratio);
  let videoY = Math.round(screenY / ratio);
  let videoWidth = video.videoWidth - (videoX * 2);
  let videoHeight = video.videoHeight - (videoY * 2);
  
  videoCanvas.getContext('2d').drawImage(video, videoX, videoY, videoWidth, videoHeight, 0, 0, window.innerWidth, window.innerHeight);
  requestAnimationFrame(update);
}


init(); 