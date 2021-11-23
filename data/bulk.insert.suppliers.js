const axios = require('axios');

const address = require('./address.json');
const suppliers = require('./suppliers.json');

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const API_URL = 'http://localhost:3000/api/v1';

const bulkInset = async () => {
  try {
    suppliers.slice(0, 30).forEach(async (buyer) => {
      axios
        .post(
          `${API_URL}/suppliers`,
          {
            ...buyer,
            businessAddress: address,
            contactInfo: address,
            billingAddress: address,
            legalName: buyer.fantasyName,
            isShared: true,
            categories: [
              randomInteger(1, 34),
              randomInteger(1, 34),
              randomInteger(1, 34),
              randomInteger(1, 34),
              randomInteger(1, 34),
              randomInteger(1, 34),
            ],
            serviceLocations: [
              randomInteger(1, 16),
              randomInteger(1, 16),
              randomInteger(1, 16),
              randomInteger(1, 16),
              randomInteger(1, 16),
              randomInteger(1, 16),
            ],
            buyerId: randomInteger(108, 117),
          },
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
