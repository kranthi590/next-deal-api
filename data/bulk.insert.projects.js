const axios = require('axios');

const projectsData = require('./projects.json');
const { init: initMysql } = require('../src/helpers/mysql');

const API_URL = 'http://localhost:3000/api/v1';

const bulkInset = async () => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, {
      emailId: 'kk@gmail.com',
      password: 'konahamaru',
    });
    const {
      data: {
        data: { token },
      },
    } = res;
    await initMysql();
    const { Buyers } = require('../src/helpers/db.models');
    const buyers = await Buyers.findAll();
    const buyerIds = buyers.map((buyer) => buyer.id);
    console.log(buyerIds);
    projectsData.forEach(async (project) => {
      axios
        .post(
          `${API_URL}/projects`,
          { ...project, currency: 'clp', buyerId: buyerIds[Math.floor(Math.random() * buyerIds.length)] },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
              'nd-domain': 'livefish.localhost',
            },
          },
        )
        .then((res1) => {
          console.log(res1.response.data);
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
