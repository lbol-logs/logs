import fs from 'fs';
import sharp from 'sharp';
import TextToSVG from 'text-to-svg';
import { versions } from '../src/globals';

const generateOGP = function (routes) {
  // TODO: check ogp existance
  // TODO: locales

  const bg = sharp('./images/bg.png');
  const images = {};
  const ogps = {};
  for (const version of versions) {
    const path = `./static/${version}`;
    const files = fs.readdirSync(path);
    ogps[version] = files;
  }


  const textToSVG = TextToSVG.loadSync('./static/assets/fonts/NotoSerifJP-Medium.otf');
  for (const { route: r, payload } of routes) {
    if (r === '/') continue;

    const { version, id, title, description, route } = payload;
    // TODO: uncomment
    // if (id in ogps[version]) continue;

    const textSvg = textToSVG.getSVG(title, {
      x: 0,
      y: 0,
      fontSize: 100,
      anchor: 'top',
      attributes: { fill: 'black', stroke: 'white' }
    });
    const dest = './static/ogp/1.5.1/2024-10-23T09-58-19Z_Sanae_Kochiya_B_SanaeExhibitU_L7_TrueEnd.png';
    bg
      .composite([
        {
          input: Buffer.from(textSvg)
        }
      ])
      // .resize(893, 469);
      .toFile(dest, async (error) => {
      // image.toFile('./dist/ogp/1.5.1/2024-10-23T09-58-19Z_Sanae_Kochiya_B_SanaeExhibitU_L7_TrueEnd.png', async (error) => {
        // eslint-disable-next-line no-console
        if (error) console.log('OGP Generate Error: ' + error);
      });
  }
};

module.exports = function () {
  this.nuxt.hook('generate:extendRoutes', (routes) => {
    console.log('OgpGenerator:start')
    console.log({routes})
    generateOGP(routes);
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