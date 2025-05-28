export interface ColorLike {
  r: number;
  g: number;
  b: number;
}

export default class Color implements ColorLike {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  distance = (color: Color) => {
    return (
      Math.pow(this.r - color.r, 2) +
      Math.pow(this.g - color.g, 2) +
      Math.pow(this.b - color.b, 2)
    );
  };

  isDarker = (color: Color) => {
    let a = this.r + this.g + this.b;
    let b = color.r + color.g + color.b;

    return a > b;
  };

  static fromColorLike(color: ColorLike) {
    return new Color(color.r, color.g, color.b);
  }

  static fromHex(hex: string) {
    if (!/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
      throw new Error('Invalid hex color format');
    }
    let r: number, g: number, b: number;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else {
      const num = parseInt(hex.slice(1), 16);
      r = (num >> 16) & 0xff;
      g = (num >> 8) & 0xff;
      b = num & 0xff;
    }
    return new Color(r, g, b);
  }

  static createPalleteFromHexCodes(list: string) {
    const hexcodes = list.split('\n').flatMap((line) => line.trim() || []);

    return hexcodes.map(Color.fromHex);
  }
}
