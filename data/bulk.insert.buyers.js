const axios = require('axios');

const address = require('./address.json');
const buyers = require('./buyers.json');

const API_URL = 'http://localhost:3000/api/v1';

const bulkInset = async () => {
  buyers.forEach(async (buyer) => {
    try {
      const resp = await axios.post(
        `${API_URL}/buyers`,
        { ...buyer, businessAddress: address, legalName: buyer.fantasyName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  });
};

bulkInset();
