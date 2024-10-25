const baseUrl = process.env.URL || 'http://localhost:3000';
const siteName = 'LBoL Logs';
const env = { baseUrl, siteName };

const githubUrl = 'https://lbol-logs.github.io/';

const versions: Array<string> = [
  '1.5.1'
];

const characters: Array<string> = [
  'Reimu',
  'Marisa',
  'Sakuya',
  'Cirno'
];

const transparent = { r: 255, g: 255, b: 255, alpha: 0 };

export {
  env,
  githubUrl,
  versions,
  characters,
  transparent
};

type TRoutes = Array<{ route: string, payload: Record<string, string> }>;

export type {
  TRoutes
};