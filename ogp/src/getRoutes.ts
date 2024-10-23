import { routes, versions } from '../configs/globals';

async function getRoutes() {
  console.log('getRoutes')
  routes.length = 0;
  const fs = require('fs');
  const { baseUrl } = process.env;

  for (const version of versions) {
    let pages = [];
    const path = `./dist/${version}`;
    if (fs.existsSync(path)) pages = fs.readdirSync(path);
    console.log(pages);

    const url = `https://lbol-logs.github.io/logs/${version}/list.json`;
    const res = await fetch(url);
    const list: Array<Record<string, any>> = await res.json();
    
    for (const o of list) {
      const { id } = o;
      if (id in pages) continue;

      const route = `/${version}/${id}/`;

      const title = 'Title';
      const description = 'Description';
      const url = 'https://lbol-logs.github.io' + route;
      const ogp = `${baseUrl}/ogp${route}.png`;

      const payload = { title, description, url, ogp };
      routes.push({ route, payload });
    }
  }
  console.log({len:routes.length})
}

export default getRoutes;