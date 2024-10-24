import fs from 'fs';
import sharp from 'sharp';
import TextToSVG from 'text-to-svg';
import { versions } from '../src/globals';

const generateOGP = async function (routes) {
  // TODO: check ogp existance
  // TODO: locales

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

  const bg = sharp('./images/bg.png');
  const images = {};
  const ogps = {};
  const dir = './dist/ogp';
  for (const version of versions) {
    const path = `${dir}/${version}`;
    const files = fs.readdirSync(path);
    ogps[version] = files;
  }

  const textToSVG = TextToSVG.loadSync('./fonts/NotoSerifJP-Medium.otf');
  for (const { route: r, payload } of routes) {
    if (r === '/') continue;

    const {
      version, id, title, description, url, ogp,
      Name, Character, PlayerType, Difficulty, Requests, shining, Type, Timestamp
    } =  payload;
    // TODO: uncomment
    // if (id in ogps[version]) continue;

    const timestamp = new Date(Timestamp).toLocaleString('ja-JP', { timeZone: 'UTC' }) + ' (UTC)';

    const textSvg = textToSVG.getSVG(timestamp, {
      x: 0,
      y: 0,
      anchor: 'top',
      fontSize: 40,
      attributes: { fill: 'white', stroke: 'black', 'stroke-width': 2, 'stroke-opacity': 0.6 }
    });
    const dest = `${dir}/${version}/${id}.png`;
    try {
      await bg
      .extend({
        top: 47,
        bottom: 47 + 68,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .composite([
        {
          input: Buffer.from(textSvg),
          top: 247,
          left: 320
        }
      ])
      .toFile(dest);
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.error('OGP Generate Error: ' + error);
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

  // this.nuxt.hook('generate:before', async (generator) => {
  //   // eslint-disable-next-line no-console
  //   console.log('OgpGenerator:start')
  //   image = await generateOGP();
  //   // console.log('outside', !!image)
  //   // eslint-disable-next-line no-console
  //   console.log('OgpGenerator:finish')
  // })

  // this.nuxt.hook('generate:done', async (generator) => {
  //   console.log('generate:done:start')
  //   console.log('done', !!image)
  //   image.toFile('./dist/ogp/page1.png');
  //   console.log('generate:done:end')
  // });
};