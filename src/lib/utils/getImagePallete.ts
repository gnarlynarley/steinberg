import ColorThief from 'colorthief';
import toColorHex from './toColorHex';

export default function getImagePallete(image: HTMLImageElement, colorCount: number) {
  const colorthief = new ColorThief();
  const pallete = colorthief.getPalette(image, colorCount);
  return pallete.map(([r, g, b]) => toColorHex(r, g, b));
}
