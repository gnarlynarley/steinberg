import resizeImage from './resizeImage';
import upscaleNearestNeighbor from './upscaleNearestNeighbor';

export default function downloadImage(image: HTMLCanvasElement, scale: number) {
  const resized = upscaleNearestNeighbor(image, scale);
  if (!resized) return;
  const link = document.createElement('a');
  link.download = 'download.png';
  link.href = resized.toDataURL();
  link.click();
}
