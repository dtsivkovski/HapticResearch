const {SerialPort} = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')

// Replace 'COM3' with the appropriate serial port name for your Arduino
const port = new SerialPort({ path: 'COM9', baudRate: 9600 });

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log('Serial port is open.');
  // Send data to the Arduino
  port.write('Your message to the Arduino\n', (err) => {
    if (err) {
      return console.log('Error: ', err.message);
    }
    console.log('Data sent to Arduino.');
  });
});

parser.on('data', (data) => {
  console.log(`Arduino says: ${data}`);
});
