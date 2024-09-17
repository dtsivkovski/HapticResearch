#include <Adafruit_GFX.h>
#include <Adafruit_IS31FL3731.h>

Adafruit_IS31FL3731 matrix = Adafruit_IS31FL3731();

//#include <WEBER_TACTILE_DISPLAY.h>
//TODO: Collaborate with the hardware team and others on how to integrate this. - utilize the https://github.com/dtsivkovski/TactileDisplay repo for libraries
#include <Wire.h> //Include arduino Wire Library to enable to I2C
#include "WEBER_TACTILE_DISPLAY.h"


WEBER_TACTILE_DISPLAY TD; //Assign object for C++ class

byte WaveForm_For_Display[1][4] = 
{ 
          
    // WaveForm Array: [Amplitude, Freq, Cycles, Envelope] 
    // Amplitude    --  min:0=50v max: 255=100v 
    // Frequerncy   --  0-255 or 0x00-0xFF
    // Duration     --  Cycles 0-255
    // Envelope     --  (Ramp up + down)
    // Max 60 waves per array !!
   {255, 10, 100, 0}  // {AMP., FREQ., DUR., ENV.} = { [A] , [F] , [D] , [E - "Optimum at 0"] }  
                          
};

unsigned long timestart,timeend,loadtime,playtime = 0; //used to store time

// num rows and cols
const int ncols = 8;
const int nrows = 8;

void setup() {
  // set up Tactile Display
  delay(10);
  delay(5000);
  TD.begin(); 
  Serial.println("after TD begin");
  TD.i2cSCANNER();
  Serial.println("scanner run");
  // if (!matrix.begin()) {
  //   Serial.println("IS31 not found");
  //   while (1);
  // }
  // Serial.println("IS31 Found!");
  // matrix.clear();
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
  Serial.println(bString.length());
  if (bString.length() != nrows * ncols + 1) {
    Serial.println("Invalid input string length.");
    return;
  }
  // iterating through entire string
  for (int i = 0; i < bString.length(); i++) {
    // values
    int row = i / 8;
    int col = i % 8;

    // get character values
    char bval = bString[(row * 8) + col + 1]; // adding 1 because first char is the ~ char
    Serial.print(row);
    Serial.print(" ");
    Serial.print(col);
    Serial.println(" ");

    // set TCA and POS and if it's a gap TCA (TCAs 7-8)
    int TCA = 0;
    int PORT = 0;
    bool gapTCA = false;

    // top row of TCAs - 0-2,6,7
    if (row < 4) {
      
      if (col == 2) {
        // TCA = 6;
        gapTCA = true;
        TCA = 0; //! IMPORTANT AND TODO: GET RID OF THIS WHEN IMPLEMENTING 8x8
      }
      else if (col == 5) {
        TCA = 7;
        gapTCA = true;
        TCA = 0; //! IMPORTANT AND TODO: GET RID OF THIS WHEN IMPLEMENTING 8x8
      }
      else if (col < 2) {
        TCA = 0;
      }
      else if (col < 5) {
        TCA = 1;
      }
      else {
        TCA = 2;
      }
      
    }
    else { // bottom row of TCAs - 3-5,6,7

      if (col == 2) {
        // TCA = 6;
        gapTCA = true;
        TCA = 0; //! IMPORTANT AND TODO: GET RID OF THIS WHEN IMPLEMENTING 8x8
      }
      else if (col == 5) {
        // TCA = 7;
        gapTCA = true;
        TCA = 0; //! IMPORTANT AND TODO: GET RID OF THIS WHEN IMPLEMENTING 8x8
      }
      else if (col < 2) {
        TCA = 3;
      }
      else if (col < 5) {
        TCA = 4;
      }
      else {
        TCA = 5;
      }
      
    }

    if (gapTCA) { // if TCAs 6 or 7 (responsible for gaps)
      Serial.println("TCA out of range, skipping...");
      // PORT = row; //! TODO: FIX WHEN IMPLEMENTING 8x8
      continue;
    }
    else {
      PORT = 2 * (row % 3) + col % 2;
    }

    if (PORT > 5) PORT = 0; //! IMPORTANT AND TODO: GET RID OF THIS WHEN IMPLEMENTING 8x8

    Serial.println("at TCA and PORT");
    Serial.println(bval);
    // load wave to chosen port
    if (bval == '1') {
      TD.TCA_and_PORT(TCA, PORT);
      TD.LOAD_WAVE(WaveForm_For_Display, sizeof(WaveForm_For_Display));
      TD.TCA_and_PORT(TCA, PORT);
      TD.writeRegisterBytes(0x02, 0x01); 
      Serial.println("got to the end");
    }

  }
}

void checkString(String data) {
  // check if starts with necessary character for binary string (placeholder ~ for now)
  if (data[0] == '~') {
    // binaryToPixelArray(data);
    binaryToWaveForm(data);
  }
  else if (data[0] == '&') { // plays specific piezo
    
    int i = int(data[1]) - 48; // converting char to value
    int j = int(data[2]) - 48; // converting char to value

    // handle invalid input
    if (i > 5 || i < 0) { 
      i = 0;
      return;
    }
    if (j > 5 || j < 0) {
      j = 0;
      return;
    }

    // play values
    TD.TCA_and_PORT(i,j);
    TD.LOAD_WAVE(WaveForm_For_Display, sizeof(WaveForm_For_Display));
    TD.TCA_and_PORT(i,j);
    TD.writeRegisterBytes(0x02, 0x01);
    delay(3000);
    
  } 
  else {
    // play default 0,0
    Serial.println("playing 0,0");
    TD.TCA_and_PORT(0, 0);
    TD.LOAD_WAVE(WaveForm_For_Display, sizeof(WaveForm_For_Display));
    TD.TCA_and_PORT(0, 0);
    TD.writeRegisterBytes(0x02, 0x01);
    delay(3000);
  }

}


void loop() {
  if (Serial.available() > 0) {
    String inputStr = Serial.readStringUntil('\n');
    Serial.println(inputStr);
    checkString(inputStr);
  }
}
