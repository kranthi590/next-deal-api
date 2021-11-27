const axios = require('axios');

const quotationResponses = require('./quotation_responses.json');
const { init: initMysql } = require('../src/helpers/mysql');

const API_URL = 'http://localhost:3000/api/v1';

// MYSQL_CONNECTION=mysql://nextdealapp:nextdealapp@localhost:3306/nextdeal_local MYSQL_DEBUG=true node bulk.insert.quotation.responses.js
const bulkInset = async () => {
  try {
    const quotationRequestId = 430;
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
    const { Suppliers } = require('../src/helpers/db.models');
    const suppliers = await Suppliers.findAll({ where: { buyerId: 20 } });
    const supplierIds = suppliers.map((buyer) => buyer.id);
    console.log(supplierIds);
    quotationResponses.forEach(async (quotationResponse) => {
      axios
        .post(
          `${API_URL}/quotations/${quotationRequestId}/responses`,
          {
            ...quotationResponse,
            currency: 'clp',
            supplierId: supplierIds[Math.floor(Math.random() * supplierIds.length)],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'nd-domain': 'podcat.localhost',
              Authorization: token,
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
