import TextToSVG, { GenerationOptions, Metrics } from 'text-to-svg';


class Text {
  private readonly buffers: Record<string, { buffer: Buffer, metrics: Metrics }> = {};

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
    this.textToSVG = TextToSVG.loadSync('./fonts/Noto-Sans-CJK-JP-Black.ttf');
  }

  get(text: string) {
    return this._get({ text }).buffer;
  }

  getMetrics(text: string) {
    return this._get({ text });
  }
  
  private _get({ text, color = 'white', size = 1 }: { text: string, color?: string, shadow?: string, size?: number }) {
    let buffer, metrics;
    const o = this.buffers[text];
    if (buffer !== undefined) {
      ({ buffer, metrics } = o);
    }
    else {
      const options: GenerationOptions = {
        x: 0,
        y: 0,
        anchor: 'top',
        fontSize: 40 * size,
        attributes: {
          fill: color,
          stroke: 'black',
          'stroke-width': '2',
          'stroke-opacity': '0.5'
        }
      };
      const svg = this.textToSVG.getSVG(text, options);
      buffer = Buffer.from(svg);
      metrics = this.textToSVG.getMetrics(text, options);
      this.buffers[text] = { buffer, metrics };
    }
    return { buffer, metrics };
  }

  getResult(type: string) {
    const { text, color } = this.RESULTS[type];
    return this._get({ text, color, size: 0.9 }).buffer;
  }
}

export default Text;