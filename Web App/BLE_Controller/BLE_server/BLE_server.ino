#include "BluetoothSerial.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_IS31FL3731.h>

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBlue;
Adafruit_IS31FL3731 matrix = Adafruit_IS31FL3731();

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

void copySerialToMatrix()
{
  for (int i = 0; i <= 30; i = i + 6)
  {
    for (int x = 0; x < 6; ++x) 
    {
      int y = i / 6;
      hapticsArray[x][y] = serializedMatrix[i + x];
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
  SerialBlue.begin("Haptic32"); //device name
}

void loop() {
  if (SerialBlue.available()) { // if there is new bluetooth data
    uint8_t incomingValue = (uint8_t)SerialBlue.read();

    if ('1' == (char)incomingValue)
    {
      incomingValue = 255;
    } 
    else
    {
      incomingValue = 0;
    }
    
    serializedMatrix[currSerialIndex] = incomingValue;
    incrementSerialIndex();

    copySerialToMatrix();
    copyMatrixToPixelArray();
  }  
}