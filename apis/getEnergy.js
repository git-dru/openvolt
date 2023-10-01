const fetch = require("node-fetch");
const { meterId } = require("../util/keys");
const extractAddressInfo = require("../util/extractAddressInfo");

const apiKey = "test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR";
const OPENVOLT_URL = "https://api.openvolt.com/v1/";


async function getEnergy(startDate, endDate) {
    const url = `${OPENVOLT_URL}interval-data?granularity=hh&start_date=${startDate}&end_date=${endDate}&meter_id=${meterId}`
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'x-api-key': apiKey
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

async function getInfoWithId(id) {
    const url = `${OPENVOLT_URL}meters?_id=${id}`;
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'x-api-key': apiKey
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) { // check if HTTP-status is 2xx
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();

        const { address } = data.data[0];
        return extractAddressInfo(address)
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}


module.exports = { getEnergy, getInfoWithId };