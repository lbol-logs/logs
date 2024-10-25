import sharp, { Sharp, ResizeOptions } from 'sharp';
import Text from './Text';
import { transparent } from './globals';

type Args = Record<string, string>;

class _Img {
  private readonly dir: string = './images';
  private readonly sharps: Record<string, Sharp> = {};

  private type: string;
  protected text: Text;
  protected resizeOptions: ResizeOptions | undefined;

  constructor(type: string, text: Text) {
    this.type = type;
    this.text = text;
  }

  async get(args: Args) {
    const { name } = args;
    const instance = this.getSharp(name);
    if (this.resizeOptions) instance.resize(this.resizeOptions);
    return await instance.toBuffer();
  }

  getSharp(name: string) {
    let instance = this.sharps[name];
    if (instance === undefined) {
      const path = `${this.dir}/${this.type}/${name}.png`;
      instance = sharp(path);
      this.sharps[name] = instance;
    }
    return instance;
  }

  set options(options: ResizeOptions) {
    this.resizeOptions = options;
  }
}

abstract class Img extends _Img {
  async get(args: Args) {
    const name = this.getImageName(args);
    try {
      const image = await super.get({ name });
      return image;
    }
    catch(e: unknown) {
      if (e instanceof Error) {
        if (!e.message.startsWith('Input file is missing')) console.error(e);
      }
      const text = await this.getText(args);
      return text;
    }
  }

  protected abstract getImageName(args: Args): string;

  protected abstract getTextName(args: Args): string;

  protected abstract getText(args: Args): Promise<Buffer>;
}

class Result extends Img {
  constructor(text: Text) {
    super('results', text);
    this.options = { width: 448, height: 306 };
  }

  getImageName(args: Args) {
    const { character, type } = args;
    const name = character + type;
    return name;
  }

  getTextName(args: Args) {
    const { character } = args;
    const name = character;
    return name;
  }

  async getText(args: Args) {
    const top = 80;
    const left = 10;
    const options = { top, left, background: transparent };

    const name = this.getTextName(args);
    const text = this.text.get(name);
    return await sharp(text).extend(options).toBuffer();
  }
}

abstract class _Icon extends Img {
  private mods: Record<string, Buffer> = {};
  private configs: Record<string, number> = {
    width: 110,
    height: 110
  };

  constructor(type: string, text: Text) {
    super(type, text);
    const { width, height } = this.configs;
    this.options = { width, height };
  }

  abstract getImageName(args: Args): string;

  getTextName(args: Args) {
    const { type } = args;
    const name = type;
    return name;
  }

  async getText(args: Args) {
    const { type } = args;
    let buffer = this.mods[type];

    if (buffer === undefined) {
      const unknown = await this.get({ name: 'Mod' });
      const mod = this.text.get('Mod');
      const name = this.getTextName(args);
      const text = this.text.get(name);
      // const textResized = await sharp(text).toBuffer();

      buffer = await sharp(unknown)
        .composite([
          {
            input: mod,
            top: 7,
            left: 10
          },
          {
            input: text,
            top: 43,
            left: 41
          }
        ])
        .toBuffer();
      this.mods[type] = buffer;
    }
    return buffer;
  };
}

class Spellcard extends _Icon {
  constructor(text: Text) {
    super('spellcards', text);
    this.options = { width: 110, height: 110 };
  }

  getImageName(args: Args) {
    const { name, character, type } = args;
    if (name !== undefined) return name;
    else return character + type;
  }
}

class Shining extends _Icon {
  constructor(text: Text) {
    super('exhibits', text);
    this.options = { width: 110, height: 110 };
  }

  getImageName(args: Args) {
    const { name, shining } = args;
    if (name !== undefined) return name;
    else return shining;
  }
}

export {
  Result,
  Spellcard,
  Shining
};