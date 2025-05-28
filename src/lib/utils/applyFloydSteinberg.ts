import clamp from './clamp';
import Color, { type ColorLike } from './Color';
import createCanvas from './createCanvas';

function mapColorToPallete(color: Color, pallete: Color[]) {
  let current_distance = Infinity;
  let result = pallete[0];

  for (const pallete_color of pallete) {
    let distance = color.distance(pallete_color);

    if (distance < current_distance) {
      current_distance = distance;
      result = pallete_color;
    }
  }

  return result;
}

function getQuantizationError(
  currentColor: Color,
  nextColor: Color
): ColorLike {
  return {
    r: currentColor.r - nextColor.r,
    g: currentColor.g - nextColor.g,
    b: currentColor.b - nextColor.b,
  };
}

function applyPixels(data: Uint8ClampedArray, i: number, color: ColorLike) {
  data[i] = color.r;
  data[i + 1] = color.g;
  data[i + 2] = color.b;
}

function getPixels(data: Uint8ClampedArray, i: number): ColorLike {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  return { r, g, b };
}

interface Kernel {
  matrix: number[];
  width: number;
  height: number;
}

const FLOYD_STEINBERG_KERNEL: Kernel = {
  matrix: [0, 0, 7 / 16, 3 / 16, 5 / 16, 1 / 16],
  width: 3,
  height: 3,
};

function applyDithering(
  rx: number,
  ry: number,
  width: number,
  height: number,
  data: Uint8ClampedArray,
  error: ColorLike
) {
  // Floyd-Steinberg distributes error to 4 neighbors:
  // Right (x+1, y)        7/16
  // Bottom-left (x-1, y+1) 3/16
  // Bottom (x, y+1)        5/16
  // Bottom-right (x+1, y+1) 1/16

  const neighbors = [
    { dx: 1, dy: 0, factor: 7 / 16 },
    { dx: -1, dy: 1, factor: 3 / 16 },
    { dx: 0, dy: 1, factor: 5 / 16 },
    { dx: 1, dy: 1, factor: 1 / 16 },
  ];

  for (const { dx, dy, factor } of neighbors) {
    const x = rx + dx;
    const y = ry + dy;

    if (x < 0 || x >= width || y < 0 || y >= height) {
      continue;
    }

    const i = (y * width + x) * 4;
    const rColors = getPixels(data, i);

    applyPixels(data, i, {
      r: clamp(0, 255, Math.round(rColors.r + error.r * factor)),
      g: clamp(0, 255, Math.round(rColors.g + error.g * factor)),
      b: clamp(0, 255, Math.round(rColors.b + error.b * factor)),
    });
  }
}

export default function applyFloydSteinberg(
  image: HTMLImageElement | HTMLCanvasElement,
  pallete: Color[]
) {
  const { width, height } = image;
  const { canvas, context } = createCanvas(width, height);
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const colors = getPixels(imageData.data, i);
      const currentColor = Color.fromColorLike(colors);
      const nextColor = mapColorToPallete(currentColor, pallete);
      const error = getQuantizationError(currentColor, nextColor);

      applyPixels(imageData.data, i, nextColor);
      applyDithering(x, y, width, height, imageData.data, error);
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}
