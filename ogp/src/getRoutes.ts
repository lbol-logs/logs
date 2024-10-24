import { versions } from './globals';

async function getRoutes({ baseUrl, siteName }: { baseUrl: string, siteName: string }) {
  const routes = [];
  const fs = require('fs');

  for (const version of versions) {
    const dir = `../docs/${version}/logs`;
    const logs = fs.readdirSync(dir);

    // TODO: remove
    let i = 0;

    for (const filename of logs) {
      const runData = await require(`../${dir}/${filename}`);
      const id = filename.replace(/\.json$/, '');

      // TODO: remove
      if (id !== '2024-10-23T06-18-54Z_PatchouliMod_B_XianzheShi_L6_TrueEnd') continue;

      // TODO: remove
      // if (i++ < 4) continue;

      const { Name, Settings: { Character, PlayerType, Difficulty, Requests }, Result: { Type, Timestamp, Exhibits }, Description } = runData;
      const shining = Exhibits[0];

      const title = [
        Character + PlayerType,
        Difficulty.slice(0, 1) + Requests.length
      ].join(' ') + ' | ' + siteName;
      const description = Description ? Description.replace(/([a-zA-Z0-9])$\n/g, '$1. ').replace(/(http?s:\/\/[^ ]+). /g, '$1').replace(/\n/g, '') : '';
      const path = `${version}/${id}`;
      const url = `https://lbol-logs.github.io/${path}/`;
      const ogp = `${baseUrl}/ogp/${path}.png`;

      const route = `/${path}/`;
      const payload = {
        version, id, title, description, url, ogp,
        Name, Character, PlayerType, Difficulty, Requests, shining, Type, Timestamp
      };
      routes.push({ route, payload });

      // TODO: remove
      break;
    }
  }
  return routes;
}

export default getRoutes;