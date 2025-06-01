import applyEdgeDetection from "./applyEdgeDetection";
import clamp from "./clamp";
import Color, { type ColorLike } from "./Color";
import convertMatrixToPixelMap from "./convertMatrixToPixelMap";
import createCanvas from "./createCanvas";

export type AlgorithmName = keyof typeof MATRIX_ALGORITH_MAP;

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

// prettier-ignore
const FLOYD_STEINBERG_MATRIX = convertMatrixToPixelMap([
  0, '*', 7,
  3,   5, 1
], 3, 16);
// prettier-ignore
const ATKINSON_MATRIX = convertMatrixToPixelMap([
  0, 0, '*', 1, 1,
  0, 1,   1, 1, 0,
  0, 0,   1, 0, 0
], 5, 8);
// prettier-ignore
const JARVIS_JUDICE_NINKE_MATRIX  = convertMatrixToPixelMap([
  0, 0, '*', 7, 5,
  3, 5,   7, 5, 3,
  0, 3,   5, 3, 0
], 5, 48);

const MATRIX_ALGORITH_MAP = {
  "Floyd Steinberg": FLOYD_STEINBERG_MATRIX,
  Atkinson: ATKINSON_MATRIX,
  "Jarvis-Judice-Ninke": JARVIS_JUDICE_NINKE_MATRIX,
} as const;
export const MATRIX_ALGORITH_NAMES = Object.keys(
  MATRIX_ALGORITH_MAP
) as AlgorithmName[];

function applyDithering(
  rx: number,
  ry: number,
  width: number,
  height: number,
  data: Uint8ClampedArray,
  error: ColorLike,
  algorithm: AlgorithmName
) {
  const matrix = MATRIX_ALGORITH_MAP[algorithm];
  for (const { dx, dy, factor } of matrix) {
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
  pallete: Color[],
  withEdgeDetection: boolean,
  algorithm: AlgorithmName
) {
  const { width, height } = image;
  const { canvas, context } = createCanvas(width, height);
  context.drawImage(image, 0, 0);
  if (withEdgeDetection) {
    const darkestColor = pallete.reduce((prev, next) =>
      prev.isDarker(next) ? next : prev
    );
    const detected = applyEdgeDetection(image, darkestColor);
    context.drawImage(detected, 0, 0);
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const colors = getPixels(imageData.data, i);
      const currentColor = Color.fromColorLike(colors);
      const nextColor = mapColorToPallete(currentColor, pallete);
      const error = getQuantizationError(currentColor, nextColor);

      applyPixels(imageData.data, i, nextColor);
      applyDithering(x, y, width, height, imageData.data, error, algorithm);
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}
