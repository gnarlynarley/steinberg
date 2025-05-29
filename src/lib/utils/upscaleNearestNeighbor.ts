import createCanvas from './createCanvas';

export default function upscaleNearestNeighbor(
  canvas: HTMLCanvasElement,
  scale: number
) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const result = createCanvas(canvas.width * scale, canvas.height * scale);

  const { width, height, data } = imageData;
  const newWidth = width * scale;
  const newHeight = height * scale;
  const newData = new Uint8ClampedArray(newWidth * newHeight * 4);

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      // Find the corresponding pixel in the original image
      const srcX = Math.floor(x / scale);
      const srcY = Math.floor(y / scale);

      // Calculate indices
      const srcIndex = (srcY * width + srcX) * 4;
      const destIndex = (y * newWidth + x) * 4;

      // Copy RGBA values
      newData[destIndex] = data[srcIndex]; // R
      newData[destIndex + 1] = data[srcIndex + 1]; // G
      newData[destIndex + 2] = data[srcIndex + 2]; // B
      newData[destIndex + 3] = data[srcIndex + 3]; // A
    }
  }
  const newImageData = new ImageData(newData, newWidth, newHeight);

  result.context.putImageData(newImageData, 0, 0);

  return result.canvas;
}
