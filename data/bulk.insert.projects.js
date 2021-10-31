const axios = require('axios');

const projectsData = require('./projects.json');

const API_URL = 'http://localhost:3000/api/v1';

const bulkInset = async () => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, {
      emailId: 'pasala.kk@gmail.com',
      password: 'konahamaru',
    });
    const {
      data: {
        data: { token, user },
      },
    } = res;
    projectsData.forEach(async (project) => {
      axios
        .post(
          `${API_URL}/buyers/${user.buyer.id}/projects`,
          { ...project, currency: 'clp' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
              'nd-domain': 'housestarcks.localhost',
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
