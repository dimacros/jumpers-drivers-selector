const mapboxConfig = require('../config/mapbox');
const axios = require('axios');

const mapboxApi = axios.create({
    baseURL: mapboxConfig.MAPBOX_URL,
    headers: {
        'Accept': 'application/json'
    },
    params: {
        access_token: mapboxConfig.MAPBOX_TOKEN
    }
})

module.exports = mapboxApi;
