const axios = require('axios');

const quotationRequests = require('./quotation_requests.json');
const { init: initMysql } = require('../src/helpers/mysql');

const API_URL = 'http://localhost:3000/api/v1';

const bulkInset = async () => {
  try {
    const buyerId = 12;
    const res = await axios.post(`${API_URL}/users/login`, {
      emailId: 'jmccorry1@trellian.com',
      password: 'Fe1bVI1BpX',
    });
    const {
      data: {
        data: { token },
      },
    } = res;
    await initMysql();
    const { Suppliers, Projects } = require('../src/helpers/db.models');
    const suppliers = await Suppliers.findAll({ where: { buyerId } });
    const supplierIds = suppliers.map((buyer) => buyer.id);
    console.log(supplierIds);

    const projects = await Projects.findAll({ where: { buyerId } });
    const projectIds = projects.map((buyer) => buyer.id);
    console.log(projectIds);
    quotationRequests.forEach(async (quotationRequest) => {
      axios
        .post(
          `${API_URL}/projects/${projectIds[Math.floor(Math.random() * projectIds.length)]}/quotations`,
          {
            ...quotationRequest,
            startDate: new Date(),
            expectedEndDate: new Date(),
            currency: 'clp',
            suppliers: supplierIds,
            buyerId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
              'nd-domain': 'podcat.localhost',
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
