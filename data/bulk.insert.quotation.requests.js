const axios = require('axios');

const quotationRequests = require('./quotation_requests.json');

const API_URL = 'http://localhost:3000/api/v1';

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const bulkInset = async () => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, {
      emailId: 'pasala.kk@gmail.com',
      password: 'konahamaru',
    });
    const {
      data: {
        data: { token },
      },
    } = res;
    [quotationRequests[0]].forEach(async (project) => {
      axios
        .post(
          `${API_URL}/projects/${randomInteger(90, 101)}/quotations`,
          { ...project, currency: 'clp' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
              'nd-domain': 'housestarcks-local1.localhost',
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
