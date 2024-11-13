// Final version
// ChatGPT helps review and translate comments.

let sky, sea, reflection, main;
let size = 10; // Size of rectangle (You can change rectangle's size here)
let skyRects = []; // Store rectangles for the sky part
let seaRects = []; // Store rectangles for the sea part
let mainRects = []; // Store rectangles for the main part
let reflectionRects = []; // Store rectangles for the reflection part

function preload() {
    // Preload images
    sky = loadImage('assets/sky.png');
    sea = loadImage('assets/sea.png');
    reflection = loadImage('assets/reflection.png');
    main = loadImage('assets/main.png');
}

function setup() {
    // Set up canvas size and basic drawing parameters
    createCanvas(600, 500);
    noFill();
    textAlign(CENTER, CENTER);
    angleMode(DEGREES); // Set angle mode to degrees
    rectMode(CENTER); // Set rectangle drawing mode to be centered
    noStroke(); // No border for rectangles
    rectInit(); // Initialize rectangles
}

function rectInit() {
    // Initialize rectangles and extract data from images
    sky.resize(width, height);
    sea.resize(width, height);
    reflection.resize(width, height);
    main.resize(width, height);
    
    // Load pixel data for each image
    sky.loadPixels();
    sea.loadPixels();
    reflection.loadPixels();
    main.loadPixels();

    // Get the pixel indices of a specific RGB value of a image, and draw rectangles
    // We got the code reference this website:
    // https://editor.p5js.org/iscodd/sketches/7-_pQbU9G 
    // https://stackoverflow.com/questions/24689403/index-a-pixel-using-one-loop-or-two-loops
    for (let x = 0; x < width; x += size / 2 ) {
        for (let y = 0; y < height; y += size / 2) {
            let index = (x + y * width) * 4; // Calculate the index in the pixel array

            // Sky Rectangles
            if (sky.pixels[index + 3] > 0) { // Check if the alpha value is greater than 0
                // Speed up the operation so that the program does not have to calculate the blank part of the image
                skyRects.push(new Rect(
                    x, y,
                    sky.pixels[index],
                    sky.pixels[index + 1],
                    sky.pixels[index + 2],
                    sky.pixels[index + 3],
                    "sky"
                ));
            }

            // Sea Rectangles
            if (sea.pixels[index + 3] > 0) {
                seaRects.push(new Rect(
                    x, y,
                    sea.pixels[index],
                    sea.pixels[index + 1],
                    sea.pixels[index + 2],
                    sea.pixels[index + 3],
                    "sea"
                ));
            }

            // Reflection Rectangles
            if (reflection.pixels[index + 3] > 0) {
                reflectionRects.push(new Rect(
                    x, y,
                    reflection.pixels[index],
                    reflection.pixels[index + 1],
                    reflection.pixels[index + 2],
                    reflection.pixels[index + 3],
                    "sea"
                ));
            }

            // Main Rectangles
            if (main.pixels[index + 3] > 0) {
                mainRects.push(new Rect(
                    x, y,
                    main.pixels[index],
                    main.pixels[index + 1],
                    main.pixels[index + 2],
                    main.pixels[index + 3],
                    "main"
                ));
            }
        }
    }
}

function draw() {

    // Draw all rectangles representing the sky part
    for (let i = 0; i < skyRects.length; i++) {
        skyRects[i].move(); // Implement rectangle movement logic (if needed)
        skyRects[i].drawRect(); // Draw the rectangle
    }

    // Draw all rectangles representing the sea part
    for (let i = 0; i < seaRects.length; i++) {
        seaRects[i].move();
        seaRects[i].drawRect();
    }

    // Draw all rectangles representing the reflection part
    for (let i = 0; i < reflectionRects.length; i++) {
        reflectionRects[i].move();
        reflectionRects[i].drawRect();
    }

    // Draw all rectangles representing the main part
    for (let i = 0; i < mainRects.length; i++) {
        mainRects[i].move();
        mainRects[i].drawRect();
    }

    // Print the total count of all rectangles
    print(skyRects.length + seaRects.length + reflectionRects.length + mainRects.length);
}

// Rectangle class, used to store data for each rectangle and implement drawing and movement logic
// We got the code reference this website:
// https://editor.p5js.org/Jaekook/sketches/SywJ5wg57
// https://p5js.org/reference/p5/class/
class Rect {
    // Data for a class is a collection of variables
    constructor(x, y, r, g, b, a, part) {
        this.x = x; // x-coordinate of the rectangle
        this.y = y; // y-coordinate of the rectangle
        this.r = r; // Red value
        this.g = g; // Green value
        this.b = b; // Blue value
        this.a = a; // Alpha (transparency) value
        this.part = part; // Part of the image the rectangle belongs to 
        this.ox = x; // Original x-coordinate for reset purposes
        this.oy = y; // Original y-coordinate for reset purposes
        this.noiseX = random(10); // Random starting value for noise-based movement
        this.time = random(320); // Time counter for controlling the movement duration
    }

    move() {
        if (this.part === 'sky') { // Only apply movement logic for sky rectangles
            // I got the code reference this website:
            // https://editor.p5js.org/BarneyCodes/sketches/2eES4fBEL
            let angle = noise(this.x * 0.01, this.y * 0.01) * 360; // Use Perlin noise to determine movement angle
            let vx = cos(angle) * 0.3; // Calculate velocity in x-direction based on angle
            let vy = sin(angle) * 0.3; // Calculate velocity in y-direction based on angle
            this.x += vx; // Update x-coordinate
            this.y += vy; // Update y-coordinate

            // If time reaches zero, reset to original position
            if (this.time <= 0) {
                this.x = this.ox;
                this.y = this.oy;
                this.time = 320; // Reset the timer
            }
            this.time -= 1; // Decrease time counter
        }
    }

    drawRect() {
        push(); // Save the current drawing settings
        noStroke(); // No border for the rectangle
        translate(this.x, this.y); // Move to the position of the rectangle

        // Apply rotation based on noise for a dynamic effect
        let angle = noise(this.x * 0.01 + frameCount * 0.01, this.y * 0.01, frameCount * 0.01) * 360;
        if (this.part == 'main') {
            rotate(random(360)); // Apply random rotation for main rectangles
        } else {
            rotate(angle); // Apply noise-based rotation for other parts
        }

        // Apply scaling effect for sea part to create a wavy effect
        if (this.part == 'sea') {
            scale(1 + noise(this.x * 0.01 + frameCount * 0.01, this.y * 0.01, frameCount * 0.01) * 2);
        }

        // Set the fill color with the original pixel's RGBA values
        fill(this.r, this.g, this.b, this.a / 1); 
        rect(0, 0, size, size); // Draw the rectangle centered at (0, 0)
        pop(); // Restore the previous drawing settings
    }
}