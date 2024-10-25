import { env, githubUrl, TRoutes, versions } from './globals';

class Routes {
  private static routes: TRoutes;

  static get() {
    let routes = Routes.routes;
    if (routes === undefined) {
      Routes._get();
      routes = Routes.routes;
    }
    return routes;
  }

  private static _get() {
    const routes: TRoutes = [];
    const { baseUrl, siteName } = env;

    const fs = require('fs');

    routes.push({ route: '/404', payload: { githubUrl }})

    for (const version of versions) {
      const dir = `../docs/${version}/logs`;
      const logs = fs.readdirSync(dir);

      // TODO: remove
      let i = 0;

      for (const filename of logs) {
        const runData = require(`../${dir}/${filename}`);
        const id = filename.replace(/\.json$/, '');

        // TODO: remove
        // if (id !== '2024-10-23T06-18-54Z_PatchouliMod_B_XianzheShi_L6_TrueEnd') continue;

        // TODO: remove
        if (i++ < 5) continue;

        const { Name, Settings: { Character, PlayerType, Difficulty, Requests }, Result: { Type, Timestamp, Exhibits }, Description } = runData;
        const shining = Exhibits[0];

        const title = [
          Character + PlayerType,
          Difficulty.slice(0, 1) + Requests.length
        ].join(' ') + ' | ' + siteName;
        const description = Description ? Description.replace(/([a-zA-Z0-9])$\n/g, '$1. ').replace(/(http?s:\/\/[^ ]+). /g, '$1').replace(/\n/g, '') : '';
        const path = `${version}/${id}`;
        const url = `${githubUrl}${path}/`;
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

    Routes.routes = routes;
  }
}

export default Routes;