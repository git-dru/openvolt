const express = require('express');

const { getInfoWithId, getEnergy } = require('./apis/getEnergy');
const {startDate,endDate, meterId} = require('./util/keys');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/get-energy', async(req, res) => {
  try{

    const data = await getEnergy(startDate , endDate);
    let energy = 0;
    for (let item of data.data) {
      energy += Number(item.consumption);
    }
    return res.status(200).send({energy: sum})
    
  }catch(err) {
    console.log(err)
    return res.status(500).send({message: err.message})
  }
})

app.get('/get-carbon', async(req, res)=> {
  try{
    const { postalCode, city } = await getInfoWithId(meterId);
    return res.status(200).send({postalCode})
  }catch(err) {
    console.log(err)
    return res.status(500).send({message: err.message})
  }
})
app.listen(PORT, () => {
  console.log(`OpenVolt app listening at http://localhost:${PORT}`);
});