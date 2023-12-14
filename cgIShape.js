//
// fill in code that creates the triangles for a cube with dimensions 1x1x1
// on each side (and the origin in the center of the cube). with an equal
// number of subdivisions along each cube face as given by the parameter
//subdivisions
//
function makeCube(subdivisions) {

    // fill in your code here.
    // delete the code below first.

    let step = 1 / subdivisions;

    for (let i = 0; i < subdivisions; i++) {
        for (let j = 0; j < subdivisions; j++) {
            // Define the vertices of each subdivision
            let a0 = -0.5 + i * step;
            let b0 = 0.5 - j * step;
            let a1 = -0.5 + (i + 1) * step;
            let b1 = 0.5 - j * step;
            let a2 = -0.5 + i * step;
            let b2 = 0.5 - (j + 1) * step;
            let a3 = -0.5 + (i + 1) * step;
            let b3 = 0.5 - (j + 1) * step;

            // Front face
            addTriangle(a0, b0, 0.5, a2, b2, 0.5, a1, b1, 0.5);
            addTriangle(a2, b2, 0.5, a3, b3, 0.5, a1, b1, 0.5);

            // Back face 
            addTriangle(a0, b0, -0.5, a1, b1, -0.5, a2, b2, -0.5);
            addTriangle(a2, b2, -0.5, a1, b1, -0.5, a3, b3, -0.5);

            // Right face
            addTriangle(0.5, a0, b0, 0.5, a2, b2, 0.5, a1, b1);
            addTriangle(0.5, a2, b2, 0.5, a3, b3, 0.5, a1, b1);

            // Left face 
            addTriangle(-0.5, a0, b0, -0.5, a1, b1, -0.5, a2, b2);
            addTriangle(-0.5, a2, b2, -0.5, a1, b1, -0.5, a3, b3);

            // Top face
            addTriangle(a0, 0.5, b0, a1, 0.5, b1, a2, 0.5, b2);
            addTriangle(a2, 0.5, b2, a1, 0.5, b1, a3, 0.5, b3);

            // // Bottom face 
            addTriangle(a0, -0.5, b0, a2, -0.5, b2, a1, -0.5, b1);
            addTriangle(a2, -0.5, b2, a3, -0.5, b3, a1, -0.5, b1);
        }


    }
}


//
// fill in code that creates the triangles for a cylinder with diameter 1
// and height of 1 (centered at the origin) with the number of subdivisions
// around the base and top of the cylinder (given by radialdivision) and
// the number of subdivisions along the surface of the cylinder given by
//heightdivision.
//
function makeCylinder(radialdivision, heightdivision) {
    let radius = 0.5;  // radius of 0.5 = diameter 1
    let height = 1.0;  // height of 1.0

    let angleStep = radians(360 / radialdivision);
    let heightStep = height / heightdivision;

    for (let i = 0; i < radialdivision; i++) {
        let angle1 = i * angleStep;
        let angle2 = (i + 1) * angleStep;

        for (let j = 0; j < heightdivision; j++) {
            let h1 = j * heightStep;
            let h2 = (j + 1) * heightStep;

            // Define vertices of two triangles for each subdivision
            let x0 = radius * Math.cos(angle1);
            let y0 = h1 - height / 2;
            let z0 = radius * Math.sin(angle1);

            let x1 = radius * Math.cos(angle2);
            let y1 = h1 - height / 2;
            let z1 = radius * Math.sin(angle2);

            let x2 = radius * Math.cos(angle1);
            let y2 = h2 - height / 2;
            let z2 = radius * Math.sin(angle1);

            let x3 = radius * Math.cos(angle2);
            let y3 = h2 - height / 2;
            let z3 = radius * Math.sin(angle2);

            // Create triangles for the side of the cylinder
            addTriangle(x0, y0, z0, x2, y2, z2, x1, y1, z1);
            addTriangle(x1, y1, z1, x2, y2, z2, x3, y3, z3);

            // bottom and top caps
            if (j === 0) {
                // Bottom 
                addTriangle(0, -height / 2, 0, x0, -height / 2, z0, x1, -height / 2, z1);
            }
            if (j === heightdivision - 1) {
                // Top 
                addTriangle(0, height / 2, 0, x3, height / 2, z3, x2, height / 2, z2);
            }
        }
    }
}


//
// fill in code that creates the triangles for a cone with diameter 1
// and height of 1 (centered at the origin) with the number of
// subdivisions around the base of the cone (given by radialdivision)
// and the number of subdivisions along the surface of the cone
//given by heightdivision.
//
function makeCone(radialdivision, heightdivision) {
    // fill in your code here.
    let radius = 0.5;  // radius of 0.5
    let height = 1.0;  // height of 1.0

    let angleStep = radians(360 / radialdivision);
    let heightStep = height / heightdivision;

    for (let i = 0; i < radialdivision; i++) {
        let angle1 = i * angleStep;
        let angle2 = (i + 1) * angleStep;

        for (let j = 0; j < heightdivision; j++) {
            let h1 = j * heightStep;
            let h2 = (j + 1) * heightStep;

            // a square vertex
            let x0 = radius * (1 - h1 / height) * Math.cos(angle1);
            let y0 = h1 - height / 2;
            let z0 = radius * (1 - h1 / height) * Math.sin(angle1);

            let x1 = radius * (1 - h1 / height) * Math.cos(angle2);
            let y1 = h1 - height / 2;
            let z1 = radius * (1 - h1 / height) * Math.sin(angle2);

            let x2 = radius * (1 - h2 / height) * Math.cos(angle1);
            let y2 = h2 - height / 2;
            let z2 = radius * (1 - h2 / height) * Math.sin(angle1);

            let x3 = radius * (1 - h2 / height) * Math.cos(angle2);
            let y3 = h2 - height / 2;
            let z3 = radius * (1 - h2 / height) * Math.sin(angle2);

            // Create triangles for the side of the cone
            addTriangle(x0, y0, z0, x2, y2, z2, x1, y1, z1);
            addTriangle(x1, y1, z1, x2, y2, z2, x3, y3, z3);

            // Create triangles for the bottom
            if (j === 0) {
                addTriangle(0, -height / 2, 0, x0, -height / 2, z0, x1, -height / 2, z1);
            }
        }
    }
}

//
// fill in code that creates the triangles for a sphere with diameter 1
// (centered at the origin) with number of slides (longitude) given by
// slices and the number of stacks (lattitude) given by stacks.
// For this function, you will implement the tessellation method based
// on spherical coordinates as described in the video (as opposed to the
//recursive subdivision method).
//
function makeSphere(slices, stacks) {
    // console.log(slices);
    // console.log(stacks);

    let radius = 0.5;
    let phiStep = radians(180 / stacks);
    let thetaStep = radians(360 / slices);
    for (let i = 0; i < stacks; i++) {
        let lat0 = i * phiStep;                  // phi - stack - latitute
        let lat1 = (i + 1) * phiStep;

        for (let j = 0; j < slices; j++) {
            let long0 = j * thetaStep;             // theta - slice - longitute
            let long1 = (j + 1) * thetaStep;

            // A squre/rectangle on the sphere and then triangulate

            let x0 = radius * Math.cos(long0) * Math.sin(lat0);   // rcos(theta)sin(phi)
            let y0 = radius * Math.sin(lat0) * Math.sin(long0);   // rsin(phi)sin(theta)
            let z0 = radius * Math.cos(lat0);                     // rcos(phi)

            let x1 = radius * Math.cos(long1) * Math.sin(lat0);
            let y1 = radius * Math.sin(lat0) * Math.sin(long1);
            let z1 = radius * Math.cos(lat0);

            let x2 = radius * Math.cos(long0) * Math.sin(lat1);
            let y2 = radius * Math.sin(lat1) * Math.sin(long0);
            let z2 = radius * Math.cos(lat1);

            let x3 = radius * Math.cos(long1) * Math.sin(lat1);
            let y3 = radius * Math.sin(lat1) * Math.sin(long1);
            let z3 = radius * Math.cos(lat1);

            addTriangle(x0, z0, y0, x2, z2, y2, x1, z1, y1);     // the z is the up for the sphere coordinator
            addTriangle(x1, z1, y1, x2, z2, y2, x3, z3, y3);

        }
    }
}

// creates a 1 x 1 star with a set amount of points
function makeStar(numPoints) {
    let innerRadius = 0.2;
    let outerRadius = 0.5;
    let angleStep = radians(360 / (numPoints * 2));
    for (let i = 0; i < numPoints * 2; i += 2) {
        let angle = angleStep * i;

        let outZ = 0.1;
        const centerZ = 0;


        const centerX = 0;
        let starPointX = outerRadius * Math.cos(angle);
        let rightCornerX = innerRadius * Math.cos(angle + angleStep);
        let leftCornerX = innerRadius * Math.cos(angle - angleStep);

        const centerY = 0;
        let starPointY = outerRadius * Math.sin(angle);
        let rightCornerY = innerRadius * Math.sin(angle + angleStep);
        let leftCornerY = innerRadius * Math.sin(angle - angleStep);

        // front right half of point (triangles drawn counter-clockwise)
        addTriangle(centerX, centerY, outZ, rightCornerX, rightCornerY, centerZ, starPointX, starPointY, centerZ);
        // front left half of point
        addTriangle(centerX, centerY, outZ, starPointX, starPointY, centerZ, leftCornerX, leftCornerY, centerZ);

        outZ = -outZ;
        // back right half of point (triangles drawn counter-clockwise)
        addTriangle(centerX, centerY, outZ, starPointX, starPointY, centerZ, rightCornerX, rightCornerY, centerZ);
        // back left half of point
        addTriangle(centerX, centerY, outZ, leftCornerX, leftCornerY, centerZ, starPointX, starPointY, centerZ);



    }
}

// creates an arch that is 1 x .5
function makeArch(radialdivision, archdivision) {
    let radius = 0.05;  // radius of 0.5 = diameter 1
    let height = .5;  // height of 1.0

    let angleStep = radians(360 / radialdivision);
    let archRadius = .25;
    let archStep = radians(180 / archdivision);

    for (let i = 0; i < radialdivision; i++) {
        let angle1 = i * angleStep;
        let angle2 = (i + 1) * angleStep;

        let offset = -archRadius;

        let x1 = radius * Math.cos(angle1) + offset;
        let x2 = radius * Math.cos(angle2) + offset;

        let z1 = radius * Math.sin(angle1);
        let z2 = radius * Math.sin(angle2);

        let y1 = -height;
        let y2 = height;

        x1 = radius * Math.cos(angle1) + offset;
        x2 = radius * Math.cos(angle2) + offset;

        //Bottom Circle of straight left beam
        addTriangle(offset, -height, 0, x2, -height, z2, x1, -height, z1);
        //Vertical Triangles left beam
        addTriangle(x1, y1, z1, x2, y1, z2, x1, y2, z1);
        addTriangle(x1, y2, z1, x2, y1, z2, x2, y2, z2);

        y1 = 0;
        y2 = 0;

        for (let j = 0; j < archdivision; j++) {
            /*
            ROTATION AROUND Z-AXIS:
            x' = x * cos(angle) + y * sin(angle);
            y' = x * -sin(angle) + y *  cos(angle);
            z' = z;
            */

            //NOTE Y MUST START AT 0 FOR ARCH IN ORDER TO ROTATE PROPERLY. TRANSLATE AFTER ROTATE
            //addTriangle(offset, y1, 0, x2, y1, z2, x1, y1, z1);
            rotationAngle = archStep * j;

            //xs rotate for of triangles (rotated circle)
            x1p = x1 * Math.cos(rotationAngle); //can drop + y * -sin(angle) because y = 0
            x2p = x2 * Math.cos(rotationAngle);
            x3 = x1 * Math.cos(rotationAngle + archStep);
            x4 = x2 * Math.cos(rotationAngle + archStep);

            //ys for top of triangles (rotated circle around z axis)
            y1 = x1 * -Math.sin(rotationAngle) + height; //can drop + y * cos(angle) because y = 0
            y2 = x2 * -Math.sin(rotationAngle) + height;
            y3 = x1 * -Math.sin(rotationAngle + archStep) + height;
            y4 = x2 * -Math.sin(rotationAngle + archStep) + height;

            //now rotate complete object and translate

            addTriangle(x1p, y1, z1, x2p, y2, z2, x3, y3, z1);
            addTriangle(x3, y3, z1, x2p, y2, z2, x4, y4, z2);

        }

        offset = -offset
        y1 = -height;
        y2 = height;
        //Bottom Circle of straight right beam
        addTriangle(offset, -height, 0, x3, -height, z1, x4, -height, z2);
        //Vertical Triangles right beam
        addTriangle(x4, y1, z2, x3, y1, z1, x3, y2, z1);
        addTriangle(x4, y1, z2, x3, y2, z1, x4, y2, z2);
    }
}


////////////////////////////////////////////////////////////////////
//
//  Do not edit below this line
//
///////////////////////////////////////////////////////////////////

function radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function addTriangle(x0, y0, z0, x1, y1, z1, x2, y2, z2) {


    var nverts = points.length / 4;

    // push first vertex
    points.push(x0); bary.push(1.0);
    points.push(y0); bary.push(0.0);
    points.push(z0); bary.push(0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;

    // push second vertex
    points.push(x1); bary.push(0.0);
    points.push(y1); bary.push(1.0);
    points.push(z1); bary.push(0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++

    // push third vertex
    points.push(x2); bary.push(0.0);
    points.push(y2); bary.push(0.0);
    points.push(z2); bary.push(1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}

