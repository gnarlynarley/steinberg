export default function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) throw new Error('Could not create canvas');

  canvas.width = width;
  canvas.height = height;

  return {
    canvas,
    context,
    destroy() {
      canvas.width = 0;
      canvas.height = 0;
    },
  };
}
