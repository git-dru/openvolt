const express = require('express');

const { getInfoWithId, getEnergy } = require('./apis/getEnergy');
const { startDate, endDate, meterId } = require('./util/keys');
const { getCarbonIntensity } = require('./apis/getCarbonIntensity');
const get11DaysLater = require('./util/get11DaysLater');
const areDatesEqual = require('./util/areDatesEqual');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send({ status: true });
});

app.get('/get-energy', async (req, res) => {
  try {

    const data = await getEnergy(startDate, endDate);
    let energy = 0;
    for (let item of data.data) {
      energy += Number(item.consumption);
    }
    return res.status(200).send({ energy })

  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: err.message })
  }
})

app.get('/get-co2-mix', async (req, res) => {
  try {
    const { postalCode } = await getInfoWithId(meterId);
    const [outward, ...rest] = postalCode.split(" ");
    const energyData = await getEnergy(startDate, endDate);
    let amountCO = 0;

    //For this api /regional/intensity/{from}/{to}/postcode/{postcode}, the date range you have specified should be less than 14 days. 
    //so month is divided into 3 parts (11 days).
    let start = startDate
    let totalCarbonData = [];

    for (let i = 0; i < 3; i++) {
      const carbonData = await getCarbonIntensity(start, outward);
      const oneWeekCarbon = carbonData.data.data;
      totalCarbonData = totalCarbonData.concat(oneWeekCarbon);
      start = get11DaysLater(start);
    }

    let fuelMix = {
      biomass: 0,
      coal: 0,
      imports: 0,
      gas: 0,
      nuclear: 0,
      other: 0,
      hydro: 0,
      solar: 0,
      wind: 0
    };

    for (let halfHourEnergy of energyData.data) {
      const { start_interval, consumption } = halfHourEnergy;
      const halfHourCarbon = totalCarbonData.filter(carbon => areDatesEqual(carbon.from, start_interval))[0];
      const { intensity, generationmix } = halfHourCarbon;
      amountCO += intensity.forecast * consumption;

      //get the % of fuel mix
      //there is api for getting generation mix '/generation/{from}/{to}'
      //but this is for national, not region. so I decided to use generation mix from 'regional/intensity/{from}/{to}/postcode/{postcode}'
      generationmix.forEach(item => {
        fuelMix[item.fuel] += item.perc / energyData.data.length;
      });
    }
    return res.status(200).send({ CO2: amountCO, fuelMix })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`OpenVolt app listening at http://localhost:${PORT}`);
});