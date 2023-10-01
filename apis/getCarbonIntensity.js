const fetch = require("node-fetch");
const get11DaysLater = require("../util/get11DaysLater");
const {CARBON_INTENSITY_URL} = require("../util/keys");

//get carbon intensity per half hour
async function getCarbonIntensity(startDate, postalCode) {

    const endDate = get11DaysLater(startDate);
    const url = `${CARBON_INTENSITY_URL}regional/intensity/${startDate}/${endDate}/postcode/${postalCode}`;
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) { // check if HTTP-status is 2xx
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // this will return building info with id
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

module.exports = { getCarbonIntensity };