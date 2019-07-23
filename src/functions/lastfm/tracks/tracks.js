const { buildResponse } = require('../../../shared/build-response');
const { handleTracks } = require('./handlers');
const { handleParams } = require('../handlers');
const { lastfm } = require('../../../services/lastfm');
const { validateParams } = require('../validators');

module.exports.handle = async (event) => {
  let params = event.queryStringParameters;
  params = handleParams(params);

  if (!validateParams(params)) {
    return buildResponse(400, { message: 'User param is required!' });
  }

  const response = await lastfm('user.getTopTracks', params);

  if (response.status !== 200) {
    return buildResponse(response.status, response.body);
  }

  const tracks = await handleTracks(response.body.track);
  return buildResponse(200, tracks);
};
