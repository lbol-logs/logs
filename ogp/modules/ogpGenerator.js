import fs from 'fs';
import { versions } from '../src/globals';
import { Result } from '../src/Img';
import Text from '../src/Text';
import Requests from '../src/Requests';

const resultTypes = {
  Failure: 'Failure',
  NormalEnd: 'Normal',
  TrueEndFail: 'Normal',
  TrueEnd: 'TrueEnd'
};

const generateOGP = async function (routes) {

  // const container = sharp({
  //   create: {
  //     width: 893,
  //     height: 469,
  //     channels: 4,
  //     background: { r: 255, g: 255, b: 255, alpha: 0 }
  //   }
  // })
    // .png()
    // .toBuffer();

  const images = {};
  const ogps = {};
  const dir = './dist/ogp';
  for (const version of versions) {
    const path = `${dir}/${version}`;
    const files = fs.readdirSync(path);
    ogps[version] = files;
  }

  const text = new Text();

  const res = new Result(text);
  const req = new Requests();

  const bg = res.getSharp('bg');

  for (const { route, payload } of routes) {
    if (route === '/') continue;

    const {
      version, id, title, description, url, ogp,
      Name, Character, PlayerType, Difficulty, Requests, shining, Type, Timestamp
    } =  payload;

    // TODO: uncomment
    // if (id in ogps[version]) {
    //   console.log(`[SKIP]: ${id}`)
    //   continue;
    // }

    const dest = `${dir}/${version}/${id}.png`;

    const resultImage = await res.get(Character + resultTypes[Type]);
    const requests = req.get(Requests);

    const result = text.getResult(Type);
    const len = Requests.length;
    const difficultyRequests = text.get(Difficulty + (len ? ` (${len})` : ''));
    const timestamp = new Date(Timestamp).toLocaleString('ja-JP', { timeZone: 'UTC' }) + ' (UTC)';
    const ts = text.get(timestamp);

    // TODO
    // const mod = getMod(Character);
    const badges = [];

    const top = 20;
    const bottom = 68 + 75;
    const left = 340;

    try {
      await bg
      .extend({
        top,
        bottom,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .composite([
        {
          input: resultImage,
          top,
          left: 0
        },
        {
          input: result,
          top: top + 60,
          left
        },
        {
          input: difficultyRequests,
          top: top + 120,
          left
        },
        {
          input: ts,
          top: top + 200,
          left
        },
        ...badges,
        {
          input: requests,
          top: top + 306,
          left: 0
        }
      ])
      .toFile(dest);
    }
    catch(e) {
      // eslint-disable-next-line no-console
      console.error('OGP Generate Error: ' + e);
    }
  }
};

module.exports = function () {
  this.nuxt.hook('generate:extendRoutes', async (routes) => {
    console.log('OgpGenerator:start')
    console.log({routes})
    await generateOGP(routes);
    console.log('OgpGenerator:finish')
  })
};