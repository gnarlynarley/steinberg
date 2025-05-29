export default function toColorHex(r: number, g: number, b: number) {
  const hex = [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

  return `#${hex}`;
}
