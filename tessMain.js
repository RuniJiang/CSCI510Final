'use strict';

// Global variables that are set and used
// across the application
let gl,
  program,
  points,
  pointsLastIndex,
  previousIndex,
  bary,
  indices,
  normals,
  colors,
  rotateTransformations,
  projectionMatrix,
  viewMatrix;

// VAO stuff
var myVAO = null;
var myVertexBuffer = null;
var myBaryBuffer = null;
var myNormalBuffer = null;
var myColorBuffer = null;
var myRotationBuffer = null;
var myIndexBuffer = null;

// Other globals with default values;
var division1 = 3;
var division2 = 1;
var updateDisplay = true;
var anglesReset = [0.0, 0.0, 0.0];
var angles = [0.0, 0.0, 0.0];
var angleInc = 5.0;

var lightDirection = [-0.8, -1.5, -1.0];
var lightDirection = [-0.8, -1.5, -1.0];

// Shapes we can draw
var CUBE = 1;
var CYLINDER = 2;
var CONE = 3;
var SPHERE = 4;
var STAR = 5;
var ARCH = 6;
var curShape = STAR;

// Camera variables
// Set up the view matrix (position the camera)
let eye = [0.0, 0, 7.0];  // Camera position (adjust as needed)
let center = [0.0, 0.0, 0.0];  // Point the camera is looking at
let up = [0.0, 1.0, 0.0];  // Up direction of the camera

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

// Create a program with the appropriate vertex and fragment shaders
function initProgram() {
  const vertexShader = getShader('vertex-shader');
  const fragmentShader = getShader('fragment-shader');

  // Create a program
  program = gl.createProgram();
  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
  }

  // Use this program instance
  gl.useProgram(program);
  // We attach the location of these shader values to the program instance
  // for easy access later in the code
  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aBary = gl.getAttribLocation(program, 'bary');
  program.aNormal = gl.getAttribLocation(program, 'aNormal');
  program.aColor = gl.getAttribLocation(program, 'aColor');
  program.uTheta = gl.getUniformLocation(program, 'theta');
  program.uLightDir = gl.getUniformLocation(program, 'uLightDirection');
  program.aRotation = gl.getAttribLocation(program, 'rotation');
}


// general call to make and bind a new object based on current
// settings..Basically a call to shape specfic calls in cgIshape.js
function createNewShape(shape, color) {


  if (shape != undefined) {
    curShape = shape;
  }

  // make your shape based on type
  if (curShape == CUBE) {
    makeCube(division1, color);
    //load identity matrix
    // matrix tranform
    // 
  }
  else if (curShape == CYLINDER) makeCylinder(division1, division2, color);
  else if (curShape == CONE) makeCone(division1, division2, color);
  else if (curShape == SPHERE) makeSphere(division1, division2, color);
  else if (curShape == STAR) makeStar(division1, color);
  else if (curShape == ARCH) makeArch(division1, division2, color);
  else {
    console.error(`Bad object type`);
    console.log(curShape)
  }

  // update last index and previous index
  previousIndex = pointsLastIndex;
  pointsLastIndex = points.length;

}

// We call draw to render to our canvas
function draw() {
  // Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Bind the VAO
  gl.bindVertexArray(myVAO);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);


  // Draw to the scene using triangle primitives
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

// Entry point to our application
function init() {
  // Retrieve the canvas
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) {
    console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
    return null;
  }

  // deal with keypress
  window.addEventListener('keydown', gotKey, false);

  // Retrieve a WebGL context
  gl = canvas.getContext('webgl2');
  // Set the clear color to be black
  gl.clearColor(0.6, 0.9, 1, 1);

  // some GL initialization
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.clearColor(0.6, 0.9, 1, 1)
  gl.depthFunc(gl.LEQUAL)
  gl.clearDepth(1.0)

  // Read, compile, and link your shaders
  initProgram();

  // Set up the projection matrix (example using perspective projection)
  const fov = 45 * Math.PI / 180;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create(); // Assuming you're using gl-matrix library
  mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

  // Pass the projection matrix to the shader
  const projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, eye, center, up);

  const viewMatrixLocation = gl.getUniformLocation(program, 'uViewMatrix');
  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);


  // create and bind your current object


  createScene();
  // do a draw
  draw();
}



function makeTree(green) {
  green = green || [176 / 255, 222 / 235, 162 / 255];
  let brown = [99 / 255, 66 / 255, 5 / 255];
  makeCone(100, 1, 0.5, 1, green);
  let tempPrev = pointsLastIndex;
  let tempLast = points.length;
  translatePoints(tempPrev, tempLast, 0, .4, 0);

  makeCone(100, 1, 0.75, 1.3, green);
  tempPrev = tempLast;
  tempLast = points.length;
  translatePoints(tempPrev, tempLast, 0, -.2, 0);

  makeCone(100, 1, .95, 1.5, green);
  tempPrev = tempLast;
  tempLast = points.length;
  translatePoints(tempPrev, tempLast, 0, -.8, 0);

  makeCylinder(100, 1, .4, .5, brown);
  tempPrev = tempLast;
  tempLast = points.length;
  translatePoints(tempPrev, tempLast, 0, -1.8, 0);

  previousIndex = pointsLastIndex;
  pointsLastIndex = points.length;
}


function createScene() {

  // clear your points and elements
  points = [];
  indices = [];
  bary = [];
  normals = [];
  colors = [];
  rotateTransformations = [];
  pointsLastIndex = 0;


  //make base
  //division1 = 5;
  createNewShape(CUBE, [155 / 255, 208 / 255, 209 / 255]);
  scalePoints(previousIndex, pointsLastIndex, 10, 5, 10);
  translatePoints(previousIndex, pointsLastIndex, 0, -4.5, 0);



  makeTree();
  translatePoints(previousIndex, pointsLastIndex, -2, 0, 1);

  makeTree();
  scalePoints(previousIndex, pointsLastIndex, 1.3, 1.4, 1.3);
  translatePoints(previousIndex, pointsLastIndex, .3, .8, -1.5);

  makeTree();
  scalePoints(previousIndex, pointsLastIndex, .9, .9, .9);
  translatePoints(previousIndex, pointsLastIndex, 2, -.2, .5);


  // update last index and previous index

  /*
  division1 = 1;
  createNewShape(CUBE);
  scalePoints(previousIndex, pointsLastIndex, .5, .5, .5);
  rotatePointsY(previousIndex, pointsLastIndex, radians(0));
  translatePoints(previousIndex, pointsLastIndex, -1, 0, 0);

  //division1 = 5;
  createNewShape(CUBE);
  scalePoints(previousIndex, pointsLastIndex, 2, 2, 2);
  rotatePointsY(previousIndex, pointsLastIndex, radians(45));
  translatePoints(previousIndex, pointsLastIndex, 1, 1, 0);

  //division1 = 4;
  createNewShape(CUBE);
  rotatePointsY(previousIndex, pointsLastIndex, radians(30));
  translatePoints(previousIndex, pointsLastIndex, 0, -1, -.5);
  */


  //create and bind VAO
  if (myVAO == null) myVAO = gl.createVertexArray();
  gl.bindVertexArray(myVAO);

  // create and bind vertex buffer
  if (myVertexBuffer == null) myVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);

  // create and bind bary buffer
  if (myBaryBuffer == null) myBaryBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bary), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aBary);
  gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);

  // Bind normal buffer
  if (myNormalBuffer == null) myNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aNormal);
  gl.vertexAttribPointer(program.aNormal, 4, gl.FLOAT, false, 0, 0);

  // Bind normal buffer
  if (myColorBuffer == null) myColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aColor);
  gl.vertexAttribPointer(program.aColor, 3, gl.FLOAT, false, 0, 0);

  if (myRotationBuffer == null) myRotationBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myRotationBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rotateTransformations), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aRotation);
  gl.vertexAttribPointer(program.aRotation, 3, gl.FLOAT, false, 0, 0);

  // uniform values
  gl.uniform3fv(program.uTheta, new Float32Array(angles));
  gl.uniform3fv(program.uLightDir, new Float32Array(lightDirection));

  // Setting up the IBO
  if (myIndexBuffer == null) myIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // indicate a redraw is required.
  updateDisplay = true;
  console.log(normals);

}

function rotatePointsY(startIndex, endIndex, angle) {
  //   x' = x *  cos(angle) + z * sin(angle);
  //   y' = y;
  //   z' = x * -sin(angle) + z * cos(angle);

  for (let i = startIndex; i < endIndex; i += 4) {
    const x = i;
    const y = i + 1;
    const z = i + 2;
    const xOrig = points[x];
    const zOrig = points[z];
    rotateTransformations.push([0.0, angle, 0.0]);
    console.log(angle);
    points[x] = xOrig * Math.cos(angle) + zOrig * Math.sin(angle);
    points[z] = xOrig * -Math.sin(angle) + zOrig * Math.cos(angle);

    const xNOrig = normals[x];
    const zNOrig = normals[z];
    normals[x] = xNOrig * Math.cos(angle) + zNOrig * Math.sin(angle);
    normals[z] = xNOrig * -Math.sin(angle) + zNOrig * Math.cos(angle);

    var length = Math.sqrt(normals[x] * normals[x] + normals[y] * normals[y] + normals[z] * normals[z]);
    normals[x] /= length;
    normals[y] /= length;
    normals[z] /= length;
  }
}

function scalePoints(startIndex, endIndex, scaleX, scaleY, scaleZ) {
  for (let i = startIndex; i < endIndex; i++) {
    switch (i % 4) {
      case 0:
        points[i] *= scaleX;
        break;
      case 1:
        points[i] *= scaleY;
        break;
      case 2:
        points[i] *= scaleZ;
        break;
    }
  }
}

function translatePoints(startIndex, endIndex, xTranslate, yTranslate, zTranslate) {
  for (let i = startIndex; i < endIndex; i++) {
    switch (i % 4) {
      case 0:
        points[i] += xTranslate;
        break;
      case 1:
        points[i] += yTranslate;
        break;
      case 2:
        points[i] += zTranslate;
        break;
    }
  }
}
