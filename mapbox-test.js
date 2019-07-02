require('dotenv').config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAPBOX_TOKEN,
});

async function geocoder(location) {
  const { body: match } = await geocodingClient
    .forwardGeocode({
      query: location,
      limit: 1
    })
    .send();
  return match.features[0].geometry.coordinates;
}

(async () => {
  console.log(await geocoder('Alaska, US'));
})();
