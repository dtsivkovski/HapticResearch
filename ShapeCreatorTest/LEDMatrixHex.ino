/*
  Testing file for LED Matrix through hex code - Temporarily w/o bluetooth
*/

// #include "BluetoothSerial.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_IS31FL3731.h>

// #if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
// #error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
// #endif

// BluetoothSerial SerialBlue;
Adafruit_IS31FL3731 matrix = Adafruit_IS31FL3731();

// define values for light on or off
uint8_t LED_ON = 777;
uint8_t LED_OFF = 0;

uint8_t hapticsArray[6][6];
uint8_t serializedMatrix[36];
uint8_t currSerialIndex;

void initArrays(){
  for (int x = 0; x < 6; ++x) // init haptics array
  {
    for (int y = 0; y < 6; ++y)
    {
      hapticsArray[x][y] = 0; // default to dark
    }
  }

  for (int i = 0; i < 36; ++i) // init serial matrix
  {
    serializedMatrix[i] = 0;
  }
}

void incrementSerialIndex()
{
   ++currSerialIndex;
   if (currSerialIndex > 35)
   {
      currSerialIndex = 0;
   }
}

void copySerialToMatrix(String inputStr)
{
  // unpack serial data to temp serial array
  uint8_t tempSerialArray[36];
  for (int i = 0; i < 9; i = i + 1)
  {
    int currBottomIndex = i * 4;
    char currSerialChar = inputStr[i]; // using a character 0-F for hexadecimal

    switch(currSerialChar)
    {
      case('0'):
        tempSerialArray[currBottomIndex] = 0;
        tempSerialArray[currBottomIndex + 1] = 0;
        tempSerialArray[currBottomIndex + 2] = 0;
        tempSerialArray[currBottomIndex + 3] = 0;
        break;
      case('1'):
        tempSerialArray[currBottomIndex] = 0;
        tempSerialArray[currBottomIndex + 1] = 0;
        tempSerialArray[currBottomIndex + 2] = 0;
        tempSerialArray[currBottomIndex + 3] = 255;
        break;
      case('2'):
        tempSerialArray[currBottomIndex] = 0;
        tempSerialArray[currBottomIndex + 1] = 0;
        tempSerialArray[currBottomIndex + 2] = 255;
        tempSerialArray[currBottomIndex + 3] = 0;
        break;
      case('3'):
        tempSerialArray[currBottomIndex] = 0;
        tempSerialArray[currBottomIndex + 1] = 0;
        tempSerialArray[currBottomIndex + 2] = 255;
        tempSerialArray[currBottomIndex + 3] = 255;
        break;
      case('4'):
        tempSerialArray[currBottomIndex] = 0;
        tempSerialArray[currBottomIndex + 1] = 255;
        tempSerialArray[currBottomIndex + 2] = 0;
        tempSerialArray[currBottomIndex + 3] = 0;
        break;
      case('5'):
        tempSerialArray[currBottomIndex] = 0;
        tempSerialArray[currBottomIndex + 1] = 255;
        tempSerialArray[currBottomIndex + 2] = 0;
        tempSerialArray[currBottomIndex + 3] = 255;
        break;
      case('6'):
        tempSerialArray[currBottomIndex] = 0;
        tempSerialArray[currBottomIndex + 1] = 255;
        tempSerialArray[currBottomIndex + 2] = 255;
        tempSerialArray[currBottomIndex + 3] = 0;
        break;
      case('7'):
        tempSerialArray[currBottomIndex] = 0;
        tempSerialArray[currBottomIndex + 1] = 255;
        tempSerialArray[currBottomIndex + 2] = 255;
        tempSerialArray[currBottomIndex + 3] = 255;
        break;
      case('8'):
        tempSerialArray[currBottomIndex] = 255;
        tempSerialArray[currBottomIndex + 1] = 0;
        tempSerialArray[currBottomIndex + 2] = 0;
        tempSerialArray[currBottomIndex + 3] = 0;
        break;
      case('9'):
        tempSerialArray[currBottomIndex] = 255;
        tempSerialArray[currBottomIndex + 1] = 0;
        tempSerialArray[currBottomIndex + 2] = 0;
        tempSerialArray[currBottomIndex + 3] = 255;
        break;
      case('a'):
      case('A'):
        tempSerialArray[currBottomIndex] = 255;
        tempSerialArray[currBottomIndex + 1] = 0;
        tempSerialArray[currBottomIndex + 2] = 255;
        tempSerialArray[currBottomIndex + 3] = 0;
        break;
      case('b'):
      case('B'):
        tempSerialArray[currBottomIndex] = 255;
        tempSerialArray[currBottomIndex + 1] = 0;
        tempSerialArray[currBottomIndex + 2] = 255;
        tempSerialArray[currBottomIndex + 3] = 255;
        break;
      case('c'):
      case('C'):
        tempSerialArray[currBottomIndex] = 255;
        tempSerialArray[currBottomIndex + 1] = 255;
        tempSerialArray[currBottomIndex + 2] = 0;
        tempSerialArray[currBottomIndex + 3] = 0;
        break;
      case('d'):
      case('D'):
        tempSerialArray[currBottomIndex] = 255;
        tempSerialArray[currBottomIndex + 1] = 255;
        tempSerialArray[currBottomIndex + 2] = 0;
        tempSerialArray[currBottomIndex + 3] = 255;
        break;
      case('e'):
      case('E'):
        tempSerialArray[currBottomIndex] = 255;
        tempSerialArray[currBottomIndex + 1] = 255;
        tempSerialArray[currBottomIndex + 2] = 255;
        tempSerialArray[currBottomIndex + 3] = 0;
        break;
      case('f'):
      case('F'):
      default:
        tempSerialArray[currBottomIndex] = 255;
        tempSerialArray[currBottomIndex + 1] = 255;
        tempSerialArray[currBottomIndex + 2] = 255;
        tempSerialArray[currBottomIndex + 3] = 255;
        break;
    }
  }

  // copy values from temp serial array
  for (int x = 0; x < 6; ++x)
  {
    for (int y = 0; y < 6; ++y)
    {
      hapticsArray[x][y] = tempSerialArray[x * 6 + y];
    }
  }
}

void copyMatrixToPixelArray()
{
  matrix.setRotation(0); // draw matrix
  for (int x = 6; x < 12; ++x)
  {
    for (int y = 2; y < 8; ++y)
    {
      matrix.drawPixel(x, y, hapticsArray[x - 6][y - 2]);
    }
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

void setup() {
  Serial.begin(9600);
  if (! matrix.begin()) {
    Serial.println("IS31 not found");
    while (1);
  }
  Serial.println("IS31 Found!");
  initArrays();
  currSerialIndex = 0;
  matrix.clear();
  // SerialBlue.begin("Haptic32"); //device name
}

void loop() {
  // if (SerialBlue.available()) { // if there is new bluetooth data
    // uint8_t incomingValue = (uint8_t) "31286148C";
    // Serial.print(incomingValue);

    // if ('1' == (char)incomingValue)
    // {
    //   incomingValue = 255;
    // } 
    // else
    // {
    //   incomingValue = 0;
    // }
    
    // serializedMatrix[currSerialIndex] = incomingValue;
    // incrementSerialIndex();

    // copySerialToMatrix("31286148C");
    // copyMatrixToPixelArray();
    // delay(2000);

    // copySerialToMatrix("31386140C");
    // copyMatrixToPixelArray();
    // delay(2000);

    // drawArrayTest("31286148C");

    // matrix.drawPixel(0,0,777);
    // matrix.drawPixel(1,1,777);\

    // square hex code
    hexToPixelArray("00000000000007c00440044007c000000000");
    delay(1000);
    // circle hex code
    hexToPixelArray("038004400820082008200440038000000000");
    delay(1000);
    // triangle hex code
    hexToPixelArray("000001000280044008201ff0000000000000");
    delay(1000);
    
  
}