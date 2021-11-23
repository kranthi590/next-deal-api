const axios = require('axios');

const address = require('./address.json');
const buyers = require('./buyers.json');

const API_URL = 'http://localhost:3000/api/v1';

const bulkInset = async () => {
  try {
    buyers.slice(0, 10).forEach(async (buyer) => {
      axios
        .post(
          `${API_URL}/buyers`,
          { ...buyer, businessAddress: address, legalName: buyer.fantasyName },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((res1) => {
          console.log(res1.response.data);
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    });
  } catch (err) {
    console.log(err);
  }
};

bulkInset();
