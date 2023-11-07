#include <SPI.h>
#include <Ethernet.h>
#include <Adafruit_GFX.h>
#include <Adafruit_IS31FL3731.h>

Adafruit_IS31FL3731 matrix = Adafruit_IS31FL3731();

void setup() {
  Serial.begin(9600);
  if (! matrix.begin()) {
    Serial.println("IS31 not found");
    while (1);
  }
  Serial.println("IS31 Found!");
  matrix.clear();
  // Initialize any necessary hardware and arrays as needed.
}

void loop() {
  if (Serial.available() > 0) {
    String inputStr = Serial.readStringUntil('\n');
    Serial.println(inputStr);
    hexToPixelArray(inputStr);
  }
}

String hexToBinaryString(char hexChar) {
  String binaryString = "";
  switch (hexChar) {
    case '0':
      binaryString = "0000";
      break;
    case '1':
      binaryString = "0001";
      break;
    case '2':
      binaryString = "0010";
      break;
    case '3':
      binaryString = "0011";
      break;
    case '4':
      binaryString = "0100";
      break;
    case '5':
      binaryString = "0101";
      break;
    case '6':
      binaryString = "0110";
      break;
    case '7':
      binaryString = "0111";
      break;
    case '8':
      binaryString = "1000";
      break;
    case '9':
      binaryString = "1001";
      break;
    case 'a':
    case 'A':
      binaryString = "1010";
      break;
    case 'b':
    case 'B':
      binaryString = "1011";
      break;
    case 'c':
    case 'C':
      binaryString = "1100";
      break;
    case 'd':
    case 'D':
      binaryString = "1101";
      break;
    case 'e':
    case 'E':
      binaryString = "1110";
      break;
    case 'f':
    case 'F':
      binaryString = "1111";
      break;
    default:
      // Handle invalid characters
      binaryString = "0000";
      break;
  }
  return binaryString;
}

void hexToPixelArray(String hexString) {

  // Check if the input string is the correct length (9 rows x 16 columns x 4 bits)
  if (hexString.length() != 9 * 16 / 4) {
    Serial.println("Invalid input string length.");
    return;
  }

  // Convert the hexadecimal string to pixel data
  uint16_t pixelData[9][16];

  for (int row = 0; row < 9; row++) {
    for (int col = 0; col < 16; col += 4) {
      char hexChar = hexString[(row * 16 / 4) + (col / 4)];
      String binaryString = hexToBinaryString(hexChar);

      // Set the corresponding 4 pixels in the matrix based on the binary string
      for (int j = 0; j < 4; j++) {
        pixelData[row][col + j] = binaryString[j] == '1' ? 1 : 0;
      }
    }
  }

  // Display the pixel data on the matrix
  matrix.setRotation(3);

  for (int row = 0; row < 9; row++) {
    for (int col = 0; col < 16; col++) {
      Serial.print(pixelData[row][col]);
        matrix.drawPixel(row, 15-col, pixelData[row][col] * 777);
    }
    Serial.println();
  }
}
