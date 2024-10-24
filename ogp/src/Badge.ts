import sharp, { Sharp } from 'sharp';
import Text from './Text';
import { transparent } from './globals';

type Color = { r: number, g: number, b: number };

class _Badge {
  private readonly buffers: Record<string, Buffer> = {};
  private readonly bgs: Record<string, Sharp> = {};

  private text: Text;
  private color: Color;

  private readonly configs: Record<string, number> = {
    top: 0,
    left: 8
  };

  constructor(text: Text, color: Color) {
    this.text = text;
    this.color = color;
  }

  async get(string: string) {
    const { top, left } = this.configs;
    let buffer = this.buffers[string];
    if (buffer === undefined) {
      const { buffer: text, metrics } = this.text.getMetrics(string);
      const input = await sharp(text).extend({ top, left, bottom: top, right: left, background: transparent }).toBuffer();

      const { width, height } = metrics;
      const key = [width, height].join(',');

      let bg = this.bgs[key];
      if (bg === undefined) {
        const w = Math.ceil(width + left * 2);
        const h = Math.ceil(height + top * 2);
        bg = sharp({
          create: {
            width: w,
            height: h,
            channels: 4,
            background: { ...this.color, alpha: 0.7 }
          }
        })
        .png();
        this.bgs[key] = bg;
      }

      buffer = await bg.composite([
        {
          input
        }
      ]).toBuffer();

      this.buffers[string] = buffer;
    }
    return buffer;
  }
}

class Badge {
  private name: _Badge;
  private mod: _Badge;
  private version: _Badge;

  constructor(text: Text) {
    this.name = new _Badge(text, { r: 0, g: 0, b: 0 });
    this.mod = new _Badge(text, { r: 255, g: 69, b: 0 });
    this.version = new _Badge(text, { r: 30, g: 144, b: 255 });
  }

  async getName(string: string) {
    return await this.name.get(string);
  }

  async getMod() {
    return await this.mod.get('Mod');
  }

  async getVersion(string: string) {
    return await this.version.get(string);
  }
}

export default Badge;