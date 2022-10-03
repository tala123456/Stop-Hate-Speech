
// dataFiltered : represents an array of depth data. Only available with setupOSC(true)
// depthW: The horizontal resolution of the dataFiltered aray
// depthH: The vertical resolution of the dataFiltered aray

let cylinderRadius;
let cylinderHeight; 
let cylinderRes = 2048;
let hcylinderspacing;
let wcylinderspacing;
let img1;
let img2;
let img3;
let img4;
let img5;
let img6;
let textTexture;
let CylinderOne;
let CylinderTwo;

function preload() {

  img1 = loadImage('Images/First_Test_Texture_Condor_Image_1.png');
  img2 = loadImage('Images/First_Test_Texture_Condor_Image_2.png');
  img3 = loadImage('Images/First_Test_Texture_Condor_Image_3.png'); 
  img4 = loadImage('Images/First_Test_Texture_Condor_Image_4.png'); 
  img5 = loadImage('Images/First_Test_Texture_Condor_Image_5.png'); 
  img6 = loadImage('Images/First_Test_Texture_Condor_Image_6.png');

}

function setup() {
  createCanvas(getWindowWidth(), getWindowHeight(), WEBGL); // impartant! Don't modify this line. 
  setupOSC(true); // Don't remove this line. 1 argument to turn the depthstream on and off
  windowScaled();
  angleMode(DEGREES);
}

function setupCylenders() {
  Cylinder1 = new cylinderStack(screen3.cntX + cylinderRadius+hcylinderspacing, screen3.cntY, textTexture6, screen3.x*2.5);
  Cylinder2 = new cylinderStack(screen3.cntX - cylinderRadius-hcylinderspacing, screen3.cntY, textTexture5, screen3.x*1.5);
  
  Cylinder3 = new cylinderStack(screen2.cntX + cylinderRadius+hcylinderspacing, screen2.cntY, textTexture4, screen2.x + (screen3.x*1.5));
  Cylinder4 = new cylinderStack(screen2.cntX - cylinderRadius-hcylinderspacing, screen2.cntY, textTexture3, screen2.x/2);
  
  Cylinder5 = new cylinderStack(screen1.cntX + cylinderRadius+hcylinderspacing, screen1.cntY, textTexture2, screen1.x/2 );
  Cylinder6 = new cylinderStack(screen1.cntX - cylinderRadius-hcylinderspacing, screen1.cntY, textTexture1, screen1.x*0.62);
  //0.833333333333334

}



function draw() {
  background(0);
  ortho();
  circle(position.x,position.y,10);
  posterTasks(); // do not remove this last line!

  
  Cylinder1.show();
  Cylinder2.show();
  Cylinder3.show();
  Cylinder4.show();
  Cylinder5.show();
  Cylinder6.show();




  print(screen1.x, screen2.x, screen3.x, position.x);


}

class cylinderStack {

  constructor(X, Y, T, R) {
    this.T = T;
    this.X = X;
    this.Y = Y;
    this.ry = 270;
    this.R = R;
    this.angle = 90;
    this.inputContol = 0;
  }
    show() {
      texture(this.T);
      let newRotation = 0;
   
      if (tracking) {
        this.inputContol = position.x
      } else {
        this.inputContol = true
        //this.inputContol *= 0.97;
        //this.inputContol += (width/2)*0.03;
      }


      let inputX = constrain(this.inputContol,this.R-(vw*18),this.R);
      inputX = map(inputX,this.R-(vw*18),this.R,0,100);
      newRotation = easeInOutBack(inputX, this.ry, this.angle-this.ry, 100);

 
      push();
      translate(this.X, this.Y - cylinderHeight - wcylinderspacing, 0);
      rotateY(newRotation);
      if (this.inputContol == true) {
        rotateY(millis()/20)
        }
      cylinder(cylinderRadius, cylinderHeight, cylinderRes,1);
      pop();
      push();
      translate(this.X, this.Y, 0);
      rotateY(newRotation);
      if (this.inputContol == true) {
        rotateY(millis()/20)
        }
      cylinder(cylinderRadius, cylinderHeight, cylinderRes, 1);
      pop();
      push();
      translate(this.X, this.Y + cylinderHeight + wcylinderspacing, 0);
      rotateY(newRotation);
      if (this.inputContol == true) {
        rotateY(millis()/20)
        }
      cylinder(cylinderRadius, cylinderHeight, cylinderRes, 1);
      pop();
    }

      
    
  

}
/*
t: This parameter holds the specified time when animation will start. For example, if value of t is 0, it means animation is just started.
b: This parameter holds the specified starting position of the object on x-axis. For example, if value of b is 10, it means the starting position of the objects on x-coordinate is 10.
c: This parameter holds the specified change in value for the object. For example, if value of c is 30, it means, the object has to move 30 to the right, ending at 40.
d: This parameter holds the specified duration of the whole process. For example, if the value of d is 2, it means, the object has 2 second to perform this motion from 10 to 40.
*/
function easeInOutBack (t, b, c, d) {
  let s = ((1.70158)*1.6);
  if ((t /= d / 2) < 1) 
    return c / 2 * 
      (t * t * (((s *= ((1.525)*2)) + 1)
                * t - s)) + b;
  return c / 2 * 
    ((t -= 2) * t * 
     (((s *= (1.525)) + 1) * t
                + s) + 2) + b;
}
/*
function easeInOutBack (t, b, c, d) {
  let s = 1.70158;
  //1.70158
  if ((t /= d / 2) < 1) 
    return c / 2 * 
      (t * t * (((s *= (1.525)) + 1)
                * t - s)) + b;
  return c / 2 * 
    ((t -= 2) * t * 
     (((s *= (1.525)) + 1) * t
                + s) + 2) + b;
}
*/


function windowScaled() {
  ortho();
  hcylinderspacing = vh;
  wcylinderspacing = vw;
  cylinderHeight = height/3.5;
  cylinderRadius = (screen1.w/4)-hcylinderspacing;
  textTexture1 = createGraphics((PI*cylinderRadius*2),cylinderHeight);
  textTexture1.background(200);
  textTexture1.image(img1, 0, 0, textTexture1.width, cylinderHeight);
  textTexture2 = createGraphics((PI*cylinderRadius*2),cylinderHeight);
  textTexture2.background(200);
  textTexture2.image(img2, 0, 0, textTexture2.width, cylinderHeight);
  textTexture3 = createGraphics((PI*cylinderRadius*2),cylinderHeight);
  textTexture3.background(200);
  textTexture3.image(img3, 0, 0, textTexture3.width, cylinderHeight);
  textTexture4 = createGraphics((PI*cylinderRadius*2),cylinderHeight);
  textTexture4.background(200);
  textTexture4.image(img4, 0, 0, textTexture4.width, cylinderHeight);
  textTexture5 = createGraphics((PI*cylinderRadius*2),cylinderHeight);
  textTexture5.background(200);
  textTexture5.image(img5, 0, 0, textTexture5.width, cylinderHeight);
  textTexture6 = createGraphics((PI*cylinderRadius*2),cylinderHeight);
  textTexture6.background(200);
  textTexture6.image(img6, 0, 0, textTexture6.width, cylinderHeight);  
  setupCylenders();
}