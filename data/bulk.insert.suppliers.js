const axios = require('axios');

const address = require('./address.json');
const suppliers = require('./suppliers.json');
const { init: initMysql, closeConnection } = require('../src/helpers/mysql');

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const API_URL = 'http://localhost:3000/api/v1';

const bulkInset = async () => {
  await initMysql();
  const { Buyers } = require('../src/helpers/db.models');
  const buyers = await Buyers.findAll();
  const buyerIds = buyers.map((buyer) => buyer.id);
  console.log(buyerIds);
  suppliers.forEach(async (supplier) => {
    try {
      axios.post(
        `${API_URL}/suppliers`,
        {
          ...supplier,
          businessAddress: address,
          contactInfo: address,
          billingAddress: address,
          legalName: supplier.fantasyName,
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
          buyerId: buyerIds[Math.floor(Math.random() * buyerIds.length)],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
    closeConnection();
  });
};

bulkInset();
