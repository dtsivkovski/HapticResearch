#include <Adafruit_GFX.h>
#include <Adafruit_IS31FL3731.h>

Adafruit_IS31FL3731 matrix = Adafruit_IS31FL3731();

const int ncols = 8;
const int nrows = 8;

/*
// waveform values and positions for a 6x6 matrix, uncomment if using the waveform for piezos

const int waveformValues[6][6] = {
  {1,4,1,4,1,4},
  {2,5,2,5,2,5},
  {3,6,3,6,3,6},
  {1,4,1,4,1,4},
  {2,5,2,5,2,5},
  {3,6,3,6,3,6}
};

const int waveformPositions[6][6] = {
  {1,1,2,2,3,3},
  {1,1,2,2,3,3},
  {1,1,2,2,3,3},
  {4,4,5,5,6,6},
  {4,4,5,5,6,6},
  {4,4,5,5,6,6}
};

*/

void setup() {
  Serial.begin(9600);
  if (!matrix.begin()) {
    Serial.println("IS31 not found");
    while (1);
  }
  Serial.println("IS31 Found!");
  matrix.clear();
  // Initialize any necessary hardware and arrays as needed.
}

void binaryToPixelArray(String bString) {

  // Check if the input string is the correct length 
  if (bString.length() != nrows * ncols + 1) {
    Serial.println("Invalid input string length.");
    return;
  }

  // Convert the hexadecimal string to pixel data and display it
  matrix.setRotation(3);

  for (int row = 0; row < nrows; row++) {
    for (int col = 0; col < ncols; col++) {
      // gets the binary character at current position
        char bval = bString[(row * ncols) + col + 1]; // adding 1 because first char is the ~ char

        // uses a ternary operator to determine whether the value of the array is a 1 or a 0
        uint8_t onVal = bval == '1' ? 1 : 0;
        matrix.drawPixel(row, (ncols-1)-col, onVal * 777); 
      }
    }
}

void binaryToWaveForm(String bString) {

  // Check if the input string is the correct length (9 rows x 16 columns)
  if (bString.length() != nrows * ncols) {
    Serial.println("Invalid input string length.");
    return;
  }

  for (int row = 0; row < nrows; row++) {
    for (int col = 0; col < ncols; col++) {
        char bval = bString[(row * ncols) + col];

        if (bval == '1') {
          // send to waveform using position and value at that position
          // sendWaveform(waveformPositions[row][col], waveformValues[row][col]);
        } else {
        // do not draw (turn off waveform at that position)
      }
      }
    }
}

void checkString(String data) {
  // check if starts with necessary character for binary string (placeholder ~ for now)
  if (data[0] == '~') {
    binaryToPixelArray(data);
  }
  else {
    // handle the data input, outputting specific chars from a keyboard as designed originally
    // TODO: Collaborate with the hardware team and others on how to integrate this. - utilize the https://github.com/dtsivkovski/TactileDisplay repo for libraries
  }

}


void loop() {
  if (Serial.available() > 0) {
    String inputStr = Serial.readStringUntil('\n');
    Serial.println(inputStr);
    checkString(inputStr);
    binaryToPixelArray(inputStr); // comment out if using waveform
    // binaryToWaveForm(inputStr); // comment out if using pixel array
  }
}
