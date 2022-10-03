
let oscSignal = false;// osc signal
// helper variables for scalable positioning
const screen1 = {x:0, y:0, w:100, h:100, cntX: 50, cntY: 50};
const screen2 = {x:0, y:0, w:100, h:100, cntX: 50, cntY: 50};
const screen3 = {x:0, y:0, w:100, h:100, cntX: 50, cntY: 50};
let vw = 1; // 1 percent of viewport width;
let vh = 1; // 1 percent of viewport height;
/*  aspect ratio control */

const pageWidth = 2160 * 3; // samsang QM85 resolution (two screens)
const pageHeight = 3840; // samsang QM85 resolution


function correctAspectRatio() {
  let offsetX = 0;
  let offsetY = 0;
  if (_renderer.drawingContext instanceof WebGLRenderingContext) {
    offsetX = - floor(width/2)
    offsetY = - floor(height/2)
  }
  screen1.w = floor(width/3);
  screen1.h = height;
  screen1.x = offsetX;
  screen1.y = offsetY;
  screen1.cntX = screen1.x + screen1.w/2;
  screen1.cntY = screen1.y + screen1.h/2; 
  //
  screen2.w = floor(width/3);
  screen2.h = height;
  screen2.x = offsetX + floor(width/3);
  screen2.y = offsetY;
  screen2.cntX = (screen2.w/2)+screen2.x;
  screen2.cntY = (screen2.h/2)+screen2.y; 
  //
  screen3.w = floor(width/3);
  screen3.h = height;
  screen3.x = offsetX+(floor(width/3)*2);
  screen3.y = offsetY;
  screen3.cntX = screen3.w/2+screen3.x;
  screen3.cntY = screen3.h/2+screen3.y;
//

  // 
  vw = width*0.01; // 1 percent of viewport width;
  vh = height*0.01;// 1 percent of viewport height;  
}


function getWindowWidth() {
  let aspectRatioWH = pageWidth/pageHeight; // width to height
  let aspectRatioHW = pageHeight/pageWidth; // height to width

  let currentRatio = windowWidth/windowHeight;

  if (windowWidth < windowHeight*aspectRatioWH) {
    // for portrait mode
    posterWidth = windowWidth;
  } else {
    // for landscape mode
    posterWidth = floor(windowHeight*aspectRatioWH);
  }

  return posterWidth;
}

function getWindowHeight() {
  let aspectRatioWH = pageWidth/pageHeight; // width to height
  let aspectRatioHW = pageHeight/pageWidth; // height to width
  if (windowWidth < windowHeight*aspectRatioWH) {
    // for portrait mode
    posterHeight = floor(windowWidth*aspectRatioHW);
  } else {
    // for landscape mode
    
    posterHeight = windowHeight;
  }
  return posterHeight;
}

document.addEventListener('fullscreenchange', (event) => {
  // document.fullscreenElement will point to the element that
  // is in fullscreen mode if there is one. If there isn't one,
  // the value of the property is null.
  if (document.fullscreenElement) {
    console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
    resized();  
  } else {
    console.log('Leaving full-screen mode.');
    resized();  
  }
});

function resized() {
  resizeCanvas(getWindowWidth(), getWindowHeight());
  correctAspectRatio();
  if (_renderer.drawingContext instanceof WebGLRenderingContext) {
    //ortho(); // todo. delete this line once students code is updated
    }
  try {
    windowScaled();
  }   catch(e) {
  }
}
window.onresize = resized;


function mousePressed() {
  if (mouseButton === LEFT) {
    this.openFullscreen();
  }
}

function showPoint(pos) {
  push();
  fill(0, 180, 180);
  noStroke();
  circle(pos.x, pos.y, pos.z*10);
  pop();
}

function screenchange() {
  if (document.fullscreenElement) {
    resized()
    console.log('Entering full-screen mode.');
  } else {
    resized()
    console.log('Leaving full-screen mode.');
  }
}

let fpsAverage = 0;

function posterTasks() {
 
  if (millis()-lastOSC>=2000) {
     // if there is no osc connection, then use mouse for position
    updatePosition(mouseX/width,mouseY/height,1.0)
    oscSignal = false;
  } else {
    oscSignal = true;
  }
  

  // show helplines when outside of fullscreenmode
  if (!fullscreen()) {
    push();
    fill(0, 180, 180);
    noStroke();
    fpsAverage = fpsAverage * 0.9;
    fpsAverage += frameRate() * 0.1;
    textSize(1.2*vw);
    textAlign(LEFT, TOP);
    text("fps: "+Math.floor(fpsAverage), screen1.x+vw, screen1.y+vh);
    text("Streaming: "+oscSignal, screen1.x+vw, screen1.y+vh+vh+vh);
    text("tracking: "+tracking, screen1.x+vw, screen1.y+vh+vh+vh+vh+vh);
    noFill();
    stroke(0, 180, 180);  
    rectMode(CORNER);
    rect(screen1.x, screen1.y, width, height);
    line(screen2.x, screen2.y, screen2.x, screen2.y+screen2.h); // line between 1st and 2nd screen
    line(screen3.x, screen3.y, screen3.x, screen3.y+screen3.h);  // line between 2nd and 3rd screen
    pop();
    showPoint(position);
}
}

function openFullscreen () {
  let elem = document.documentElement
    if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen()
  }
}
// this can be used to interlac images to increase image count for smoother animation
function interlaceImageSet(imageArray) {
  let i = 1;
  while(i<imageArray.length) {
    let newImage = interlaceTwoImages(images[i-1], images[i]); 
    imageArray.splice(i, 0, newImage);
    i+=2;
  }
  return imageArray
}

function interlaceTwoImages(image1, image2){
  let img = createImage(image1.width, image1.height);
  img.loadPixels();
  image1.loadPixels();
  image2.loadPixels();
  let d = pixelDensity();
  let imageLength = 4 * img.width*image1.height;
  console.log(imageLength);
  for (let i = 0; i < imageLength; i ++) {
   let x = i % (4 * img.width)
    let y = (i - x) / (4 * img.width)
    y  = y  % 2;
    if (y  == 0) {
      img.pixels[i] = image1.pixels[i]; 
    } else {
      img.pixels[i] = image2.pixels[i]; 
    }
  }
  img.updatePixels();
  return img;
}

