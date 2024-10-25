import fs from 'fs';
import { transparent, versions, characters } from '../src/globals';
import { Result } from '../src/Img';
import Text from '../src/Text';
import Requests from '../src/Requests';
import Badge from '../src/Badge';
import Routes from '../src/Routes';

const resultTypes = {
  Failure: 'Failure',
  NormalEnd: 'Normal',
  TrueEndFail: 'Normal',
  TrueEnd: 'TrueEnd'
};

const generateOGP = async function () {
  const ogps = {};
  const dir = './static/ogp';
  for (const version of versions) {
    const path = `${dir}/${version}`;
    const files = fs.readdirSync(path);
    ogps[version] = files;
  }

  const text = new Text();

  const res = new Result(text);
  const req = new Requests();
  const badge = new Badge(text);

  const bg = res.getSharp('bg');

  let created = 0;
  let skipped = 0;

  for (const { route, payload } of Routes.get()) {
    if (route === '/404') continue;

    const {
      version, id,
      Name, Character, PlayerType, Difficulty, Requests, shining, Type, Timestamp
    } =  payload;

    const filename = `${id}.png`;
    // TODO: uncomment
    // if (ogps[version].includes(filename)) {
    //   console.log(`[SKIP]: ${id}`)
    //   skipped++;
    //   continue;
    // }

    const dest = `${dir}/${version}/${filename}`;

    const resultImage = await res.get([Character, resultTypes[Type]].join(','));
    const requests = req.get(Requests);

    const result = text.getResult(Type);
    const len = Requests.length;
    const difficultyRequests = text.get(Difficulty + (len ? ` (${len})` : ''));
    const timestamp = new Date(Timestamp).toLocaleString('ja-JP', { timeZone: 'UTC' }) + ' (UTC)';
    const ts = text.get(timestamp);

    const top = 20;
    const bottom = 68 + 75;
    const left = 340;

    const badges = [];
    badges.push({ input: await badge.getVersion(version), top, left: 0});
    if (Name) badges.push({ input: await badge.getName(Name), top: top + 200, left: 0 });
    if (!characters.includes(Character)) badges.push({ input: await badge.getMod(), top, left: 893 - 108 })

    try {
      await bg
        .extend({
          top,
          bottom,
          background: transparent
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

      created++;
    }
    catch(e) {
      // eslint-disable-next-line no-console
      console.error('OGP Generate Error: ' + e);
    }
  }

  console.info(`[CREATED]: ${created}`);
  console.info(`[SKIPPED]: ${skipped}`);
};

module.exports = function () {
  this.nuxt.hook('generate:before', async () => {
    console.log('OgpGenerator:start')
    await generateOGP();
    console.log('OgpGenerator:finish')
  })
};