import fs from 'fs';
import sharp from 'sharp';
import TextToSVG from 'text-to-svg';

const generateOGP = async function () {
  // TODO: check ogp existance
  // TODO: locales
  const textToSVG = TextToSVG.loadSync('./static/assets/fonts/NotoSerifJP-Medium.otf');
  const fileNames = fs.readdirSync('./static/assets/data');
  for (const key in fileNames) {
    const file = JSON.parse(fs.readFileSync('./static/assets/data/' + fileNames[key], 'utf8'));
    const textSvg = await textToSVG.getSVG(file.title, {
      x: 0,
      y: 0,
      fontSize: 100,
      anchor: 'top',
      attributes: { fill: 'black', stroke: 'white' }
    });
    const image = await sharp('./static/assets/images/' + file.thumbnail);
    console.log('after image');
    await image.composite([
        {
          input: Buffer.from(textSvg)
        }
      ])
      console.log('after resize');
      await image.resize(1200, 630);
      console.log('after composite');
      await image.toFile('./static/ogp/' + file.slug + '.png', async (error, info) => {
        // console.log(await info)
        console.log(info)
        // eslint-disable-next-line no-console
        if (error) console.log('OGP Generate Error: ' + error);
      });
      console.log('after toFile');
  }
};

module.exports = function () {
  this.nuxt.hook('generate:before', async (generator) => {
    // eslint-disable-next-line no-console
    console.log('OgpGenerater:start')
    await generateOGP();
    // eslint-disable-next-line no-console
    console.log('OgpGenerater:finish')
  })
};