import createCanvas from './createCanvas';

export default function applySharpening(
  image: HTMLImageElement | HTMLCanvasElement,
  level: number
): HTMLCanvasElement {
  const { canvas, context } = createCanvas(image.width, image.height);

  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Sharpen kernel (3x3)
  const kernel = [0, -level, 0, -level, 1 + 4 * level, -level, 0, -level, 0];

  const w = canvas.width;
  const h = canvas.height;
  const copy = new Uint8ClampedArray(data);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        // R, G, B channels
        let i = (y * w + x) * 4 + c;
        let sum = 0;
        let k = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const ni = ((y + ky) * w + (x + kx)) * 4 + c;
            sum += copy[ni] * kernel[k++];
          }
        }
        data[i] = Math.min(255, Math.max(0, sum));
      }
      // Alpha channel remains unchanged
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}
