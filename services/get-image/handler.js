const config = require('../../lib/config');
const { handleFunctionReturn } = require('../../lib/handlers');
const { validateTopLastParams } = require('../../lib/validators');
const { sendImageToS3 } = require('../../lib/s3-services');
const { getBrowser, getPage } = require('../../lib/puppeteer-services');

const BUCKET = 'toplast-images';

const optionToString = option => {
  if (option === '1') return 'topAlbums';
  if (option === '2') return 'topArtists';
  return 'topTracks';
};

module.exports.main = async event => {
  console.log(JSON.stringify(event));

  const params = event.queryStringParameters;

  if (!validateTopLastParams(params)) {
    return handleFunctionReturn({
      statusCode: 400,
      body: { message: 'Invalid params.' }
    });
  }

  const targetUrl = `${config.CLIENT_URL}/chartGenerator?album=${params.album}&artist=${params.artist}&track=${params.track}&option=${params.option}`;

  let browser;
  try {
    browser = await getBrowser();

    const page = await getPage(browser, targetUrl, { width: 750, height: 750 });
    const imagePath = `${params.user}/${optionToString(params.option)}/${
      params.period
    }/screenshot-${new Date().getTime()}.png`;
    const buffer = await page.screenshot();
    const s3ImageUrl = await sendImageToS3(buffer, imagePath, BUCKET);

    return handleFunctionReturn({
      statusCode: 200,
      body: { url: s3ImageUrl }
    });
  } catch (error) {
    return handleFunctionReturn({ statusCode: 500, body: error });
  } finally {
    if (browser !== null) await browser.close();
  }
};
