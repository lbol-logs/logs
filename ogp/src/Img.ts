import sharp, { Sharp, ResizeOptions } from 'sharp';
import Text from './Text';

class Img {
  private readonly dir: string = './images';
  private readonly sharps: Record<string, Sharp> = {};

  private type: string;
  protected text: Text;

  constructor(type: string, text: Text) {
    this.type = type;
    this.text = text;
  }

  async get(name: string, resizeOptions?: ResizeOptions | undefined) {
    const instance = this.getSharp(name);
    if (resizeOptions) instance.resize(resizeOptions);
    return await instance.resize().toBuffer();
  }

  getSharp(name: string) {
    let instance = this.sharps[name];
    if (instance === undefined) {
      instance = sharp(`${this.dir}/${this.type}/${name}.png`);
      this.sharps[name] = instance;
    }
    return instance;
  }
}

class Result extends Img {
  constructor(text: Text) {
    super('results', text);
  }

  async get(name: string) {
    try {
      const image = await super.get(name, { width: 448, height: 306 });
      return image;
    }
    catch(e: unknown) {
      if (e instanceof Error) {
        if (!e.message.startsWith('Input file is missing')) console.error(e);
      }
      const top = 20;
      const left = 10;
      const options = { top, left, background: { r: 255, g: 255, b: 255, alpha: 0 } };

      const text = this.text.get(name);
      return await sharp(text).extend(options).toBuffer();
    }
  }
}

export {
  Result
};