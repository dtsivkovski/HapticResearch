/*
    Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleServer.cpp
    Ported to Arduino ESP32 by Evandro Copercini
    Updated by chegewara
    Modified by Andrew Wells
*/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_IS31FL3731.h>

#define SERVICE_UUID        "3f5d0625-d940-45fe-ba68-20fac82cb81f"
#define CHARACTERISTIC_UUID "a8bf6ddf-1c87-40e7-9195-d7b9871feb7f"

BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pCharacteristic;

Adafruit_IS31FL3731 matrix = Adafruit_IS31FL3731();
uint8_t hapticsArray[6][6];
uint8_t currSerialIndex;

void initArrays(){
  for (int x = 0; x < 6; ++x) // init haptics array
  {
    for (int y = 0; y < 6; ++y)
    {
      hapticsArray[x][y] = 0; // default to dark
    }
  }
}

void copySerialToMatrix()
{
  // unpack serial data to temp serial array
  uint8_t tempSerialArray[36];
  for (int i = 0; i < 9; i = i + 1)
  {
    int currBottomIndex = i * 4;
    char currSerialChar = pCharacteristic->getValue()[i]; // using a character 0-F for hexadecimal

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

void setup() {
  Serial.begin(9600);
  Serial.println("BLE Starting");

  BLEDevice::init("HapticDevice");
  pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE_NR |
                                         BLECharacteristic::PROPERTY_NOTIFY
                                       );

  pCharacteristic->setValue("FFFFFFFFF");
  pService->start();
  // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  if (! matrix.begin()) {
    Serial.println("IS31 not found");
  } else {
    Serial.println("IS31 Found!");
  }
  initArrays();
  matrix.clear();
}

void loop() {
  copySerialToMatrix();
  copyMatrixToPixelArray();
  delay(2000);
}