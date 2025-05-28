import createCanvas from './createCanvas';

export default function resizeImage(
  image: HTMLImageElement | HTMLCanvasElement,
  width: number
) {
  const height = Math.floor((width / image.width) * image.height);
  const { canvas, context } = createCanvas(width, height);

  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height, // source rectangle (full image)
    0,
    0,
    width,
    height // destination rectangle (resized)
  );

  return canvas;
}
