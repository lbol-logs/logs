import TextToSVG, { GenerationOptions } from 'text-to-svg';


class Text {
  private readonly buffers: Record<string, Buffer> = {};

  private textToSVG: TextToSVG;

  private readonly RESULTS: Record<string, { text: string, color: string }> = {
    Failure: {
      text: 'Failure',
      color: 'red'
    },
    Normal: {
      text: 'Incident Resolved',
      color: '#d1cef3'
    },
    TrueEnd: {
      text: 'Perfect Incident Resolution',
      color: '#fdfdc1'
    }
  };

  constructor() {
    this.textToSVG = TextToSVG.loadSync('./fonts/NotoSerifJP-Medium.otf');;
  }

  get(text: string) {
    return this._get({ text });
  }
  
  private _get({ text, color = 'white', size = 1 }: { text: string, color?: string, shadow?: string, size?: number }) {
    let buffer = this.buffers['text'];
    if (buffer === undefined) {
      const options: GenerationOptions = {
        x: 0,
        y: 0,
        anchor: 'top',
        fontSize: 40 * size,
        attributes: {
          fill: color,
          stroke: 'black',
          'stroke-width': '1',
          'stroke-opacity': '0.8'
        }
      };
      const string = this.textToSVG.getSVG(text, options);
      buffer = Buffer.from(string);
      this.buffers[text] = buffer;
    }
    return buffer;
  }

  getResult(type: string) {
    const { text, color } = this.RESULTS[type];
    return this._get({ text, color, size: 0.9 });
  }
}

export default Text;