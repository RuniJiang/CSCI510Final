let moveSpeed = .1;
let x = 0;
let y = 1;
let z = 2;
function moveForward() {
    eye[z] -= moveSpeed;
    center[z] -= moveSpeed;
    updateCamera();
}

function moveBackwards() {
    eye[z] += moveSpeed;
    center[z] += moveSpeed;
    updateCamera();
}

function moveRight() {
    eye[x] += moveSpeed;
    center[x] += moveSpeed;
    updateCamera();
}

function moveLeft() {
    eye[x] -= moveSpeed;
    center[x] -= moveSpeed;
    updateCamera();
}

function moveUp() {
    eye[y] += moveSpeed;
    center[y] += moveSpeed;
    updateCamera();
}

function moveDown() {
    eye[y] -= moveSpeed;
    center[y] -= moveSpeed;
    updateCamera();
}

function lookUp() {
    center[y] += moveSpeed;
    updateCamera();
}

function lookDown() {
    center[y] -= moveSpeed;
    updateCamera();
}

function lookLeft() {
    center[x] -= moveSpeed;
    updateCamera();
}

function lookRight() {
    center[x] += moveSpeed;
    updateCamera();
}

function turnAround() {
    center[x] = -center[x];
    center[z] = -center[z];
    updateCamera();
}

function updateCamera() {
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eye, center, up);

    const viewMatrixLocation = gl.getUniformLocation(program, 'uViewMatrix');
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);

    updateDisplay = true;
}