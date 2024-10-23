import { versions } from './globals';

async function getRoutes() {
  const routes = [];
  const fs = require('fs');

  for (const version of versions) {
    const path = `./dist/${version}`;
    const pages = fs.readdirSync(path);

    const url = `https://lbol-logs.github.io/logs/${version}/list.json`;
    const res = await fetch(url);
    const list: Array<Record<string, any>> = await res.json();
    
    for (const o of list.reverse()) {
      const { id } = o;

      const title = 'Title';
      const description = 'Description';
      const route = `/${version}/${id}/`;

      const payload = { version, id, title, description, route };
      routes.push({ route, payload });

      // TODO: remove
      break;
    }
  }
  return routes;
}

export default getRoutes;