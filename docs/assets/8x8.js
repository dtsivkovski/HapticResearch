

function getBinaryRepresentation(imgElement) {
    var originalSize = 24; // The size of the canvas and the image will be drawn onto
    var reducedSize = 8; // The size of the binary data grid
    var blockSize = originalSize / reducedSize; // The size of the blocks to sample down to a single binary digit
    var canvas = document.createElement('canvas');
    canvas.width = originalSize;
    canvas.height = originalSize;
    var ctx = canvas.getContext('2d');
    
    ctx.drawImage(imgElement, 0, 0, originalSize, originalSize);
    var imageData = ctx.getImageData(0, 0, originalSize, originalSize);
    
    var binaryData = '';
    var edgeThreshold = 128; // Define an edge threshold
    
    // Iterate over each block to create the binary representation
    for (var y = 0; y < reducedSize; y++) {
        for (var x = 0; x < reducedSize; x++) {
            var edgeFound = false; // Flag to indicate if an edge is found within a block
            
            // Iterate over each pixel within the block
            for (var by = 0; by < blockSize; by++) {
                for (var bx = 0; bx < blockSize; bx++) {
                    var index = ((y * blockSize + by) * originalSize + (x * blockSize + bx)) * 4;
                    var alpha = imageData.data[index + 3];
                    
                    // If the pixel is not fully transparent
                    if (alpha !== 0) {
                        // Get the grayscale value of the pixel
                        var grayValue = imageData.data[index] * 0.3 + imageData.data[index + 1] * 0.59 + imageData.data[index + 2] * 0.11;
                        // Check if the pixel grayscale value indicates an edge
                        if (grayValue <= edgeThreshold) {
                            edgeFound = true;
                            break; // Break the inner loop if an edge is found
                        }
                    }
                }
                if (edgeFound) {
                    break; // Break the outer loop if an edge is found
                }
            }
            
            binaryData += edgeFound ? '1' : '0'; // Mark the block as '1' if an edge is found, '0' otherwise
        }
       
    }
    
    return binaryData;
}