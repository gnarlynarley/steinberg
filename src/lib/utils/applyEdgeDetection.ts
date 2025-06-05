import type Color from './Color';
import createCanvas from './createCanvas';

export default function applyEdgeDetection(
  image: HTMLImageElement | HTMLCanvasElement,
  color: Color,
  edgeDetectionLevel: number
) {
  const { canvas, context } = createCanvas(image.width, image.height);

  context.drawImage(image, 0, 0, image.width, image.height);
  const imageData = context.getImageData(0, 0, image.width, image.height);
  const { data, width, height } = imageData;

  // Sobel kernels
  const kernelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ].map((row) => row.map((value) => value * edgeDetectionLevel * 0.01));
  const kernelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ].map((row) => row.map((value) => value * edgeDetectionLevel * 0.01));

  const output = context.createImageData(width, height);

  function getGray(x: number, y: number) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Simple grayscale
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0,
        gy = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const gray = getGray(x + kx, y + ky);
          gx += kernelX[ky + 1][kx + 1] * gray;
          gy += kernelY[ky + 1][kx + 1] * gray;
        }
      }
      // Apply a curve to the magnitude (e.g., exponential for stronger edges)
      const magnitude = Math.pow(Math.sqrt(gx * gx + gy * gy), 1.5);
      const idx = (y * width + x) * 4;
      output.data[idx] = color.r;
      output.data[idx + 1] = color.g;
      output.data[idx + 2] = color.b;
      output.data[idx + 3] = Math.min(255, magnitude);
    }
  }

  context.putImageData(output, 0, 0);

  return canvas;
}
