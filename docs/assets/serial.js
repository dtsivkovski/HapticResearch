let serialPort;
const connectButton = document.getElementById('connectButton');

// function to connect to serial port
connectButton.addEventListener('click', async () => {
    try {
        let filters = [
            { usbVendorId: 0x2341, usbProductId: 0x0043 },
            { usbVendorId: 0x2341, usbProductId: 0x0001 }
        ];
        serialPort = await navigator.serial.requestPort({filters});
        await serialPort.open({ baudRate: 9600 });
        console.log('Serial port connected.');
        // document.getElementById('connection-status').textContent = 'Status: Connected';
        // document.getElementById('connection-status').className = 'text-success';
        document.getElementById('connectButton').disabled = true;
        document.getElementById('connectButton').textContent = 'Connected';
        document.getElementById('connectButton').className = 'btn btn-rounded btn-success';
        // delay 2s
        setTimeout(() => {
            sendData("1111111110000001100000011000010110101001100100011000000111111111"); // symbol to show connection success
        }, 2000);
    } catch (error) {
        console.error('Error connecting to serial port:', error);
        alert('Error connecting to serial port. Please try again.');
    }
});

// function to send data
async function sendData(data) {
    if (!serialPort || !serialPort.writable) {
        console.error('Serial port not connected or not writable.');
        return;
    }

    // encodes the data being sent to the arduino port
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(data);

    // writing to the serial port of the arduino
    const writer = serialPort.writable.getWriter();
    await writer.write(dataArray);
    writer.releaseLock();
    console.log('Data sent to Arduino:', data);
}