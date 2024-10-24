class Requests {
  private frame: string;
  private readonly buffers: Record<string, Buffer> = {};

  private readonly REQUESTS: Array<string> = [
    'HalfDrug',
    'LowMaxHp',
    'StartMisfortune',
    'LowStageRegen',
    'LowUpgradeRate',
    'PayForUpgrade',
    'NightMana'
  ];

  private readonly configs = {
    color: '#ff9400',
    outerRadius: 34,
    outerWidth: 4,
    innerRadius: 24
  };

  constructor() {
    const frame = this.getFrame();
    this.frame = frame;
  }

  get(requests: Array<string>) {
    const r = this.REQUESTS.map(e => requests.includes(e) ? 1 : 0);
    const key = r.join('');
    let buffer = this.buffers[key];
    if (buffer === undefined) {
      const svg = [
        '<svg>',
        this.getDots(r),
        this.frame,
        '</svg>'
      ].join('');
      buffer = Buffer.from(svg);
      this.buffers[key] = buffer;
    }
    return buffer;
  }

  private getDots(r: Array<0 | 1>) {
    const { color, outerRadius, innerRadius } = this.configs;
    const dots: Array<string> = [];
    const len = outerRadius * 2;
    for (let i = 0; i < r.length; i++) {
      if (!r[i]) continue;
      const j = i * 2;
      const circle = `<circle fill="${color}" cx="${len * (j + 0.5)}" cy="${outerRadius}" r="${innerRadius}" />`;
      dots.push(circle);
    }
    return dots;
  }

  private getFrame() {
    const { color, outerRadius, outerWidth } = this.configs;
    const array: Array<string> = [];
    const len = outerRadius * 2;
    const r = outerRadius - outerWidth + 2;
    for (let i = 0; i < this.REQUESTS.length; i++) {
      const j = i * 2;
      if (i) {
        const line = `<line stroke="${color}" stroke-width="${outerWidth}" x1="${len * (j - 1)}" y1="${outerRadius}" x2="${len * j}" y2="${outerRadius}" />`;
        array.push(line);
      }
      const circle = `<circle fill="none" stroke="${color}" stroke-width="${outerWidth}" cx="${len * (j + 0.5)}" cy="${outerRadius}" r="${r}" />`;
      array.push(circle);
    }
    return array.join('');
  }
}

export default Requests;