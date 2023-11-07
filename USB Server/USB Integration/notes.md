## TinyUSB Integration Notes

- Example of serial connection: 
    - https://github.com/adafruit/Adafruit_TinyUSB_Arduino/blob/master/examples/WebUSB/webusb_serial/webusb_serial.ino
    - https://example.tinyusb.org/webusb-serial/index.html

## Sending it through serial 

- WebUSB.ino is set up to use serial, but the web page cannot open the port to communicate with the arduino for some reason
- See WebUSB.ino for arduino side
    - Putting hex value directly into serial message box works
- See remote.html for webpage side
    - Does not open port on the same serial so not sure how to implement that.
- Attempted to make a .js script with Serialport module
    - Returns "access denied" to open the port.