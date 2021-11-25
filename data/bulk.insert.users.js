const axios = require('axios');

const users = require('./users.json');
const { init: initMysql } = require('../src/helpers/mysql');
const address = require('./address.json');

const API_URL = 'http://localhost:3000/api/v1';

const bulkInset = async () => {
  try {
    await initMysql();
    const { Buyers } = require('../src/helpers/db.models');
    const buyers = await Buyers.findAll();
    users.forEach(async (user, index) => {
      axios
        .post(
          `${API_URL}/users`,
          {
            ...user,
            contactInfo: address,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'nd-domain': `${buyers[index].subDomainName}.localhost`,
            },
          },
        )
        .then((res1) => {
          console.log(res1);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    });
  } catch (err) {
    console.log(err);
  }
};

bulkInset();
