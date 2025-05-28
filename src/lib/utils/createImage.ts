export default function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject('Something went wrong loading the image');
    };
    image.src = src;
  });
}
