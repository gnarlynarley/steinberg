type CenterSymbol = "*";
type PixelMap = { dx: number; dy: number; factor: number };

export default function convertMatrixToPixelMap(
  matrix: (number | CenterSymbol)[],
  width: number,
  range: number
): PixelMap[] {
  const centerIndex = matrix.findIndex((i) => i === "*");
  if (centerIndex === -1) throw new Error("No center found");
  const result: PixelMap[] = [];
  const centerX = centerIndex % width;
  const centerY = Math.floor(centerIndex / width);

  for (let i = 0; i < matrix.length; i++) {
    const factor = matrix[i];
    if (factor === 0 || factor === "*") continue;

    const x = i % width;
    const y = Math.floor(i / width);
    result.push({
      dx: x - centerX,
      dy: y - centerY,
      factor: factor / range,
    });
  }
  return result;
}
