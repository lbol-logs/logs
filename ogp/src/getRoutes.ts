import { versions } from './globals';

async function getRoutes({ baseUrl, siteName }: { baseUrl: string, siteName: string }) {
  const routes = [];
  const fs = require('fs');
console.log('URL: '+ baseUrl);
  for (const version of versions) {
    const dir = `../docs/${version}/logs`;
    const logs = fs.readdirSync(dir);
    
    for (const filename of logs) {
      const runData = await require(`../${dir}/${filename}`);
      const id = filename.replace(/\.json$/, '');

      // TODO: remove
      if (id !== '2024-10-23T09-58-19Z_Sanae_Kochiya_B_SanaeExhibitU_L7_TrueEnd') continue;

      const { Name, Settings: { Character, PlayerType, Difficulty, Requests }, Result: { Type, Timestamp, Exhibits }, Description } = runData;
      const shining = Exhibits[0];

      const title = [
        Character + PlayerType,
        Difficulty.slice(0, 1) + (Requests.length || '')
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
    }
  }
  return routes;
}

export default getRoutes;