const axios = require('axios');

const projectsData = require('./projects.json');

const API_URL = 'https://service.nextdeal.dev';

const bulkInset = async () => {
  try {
    const res = await axios.post(`${API_URL}/user/login`, {
      emailId: 'kranthi.kumar5901@gmail.com',
      password: 'konahamaru',
    });
    const {
      data: {
        data: { token },
      },
    } = res;
    [projectsData[0]].forEach(async (project) => {
      axios
        .post(
          `${API_URL}/project/create`,
          { ...project, currency: 'clp' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
              'nd-domain': 'housestarcks11.localhost',
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
    console.log(Object.keys(err), err.message);
  }
};

bulkInset();
