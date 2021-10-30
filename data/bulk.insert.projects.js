const axios = require('axios');

const projectsData = require('./projects.json');

const API_URL = 'http://localhost:3000';

const bulkInset = async () => {
  try {
    const res = await axios.post(`${API_URL}/user/login`, {
      emailId: 'kranthi.5901@gmail.com',
      password: 'konahamaru',
    });
    const {
      data: {
        data: { token },
      },
    } = res;
    projectsData.forEach(async (project) => {
      axios
        .post(
          `${API_URL}/project/create`,
          { ...project, currency: 'clp' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
              'nd-domain': 'housestarcks121.localhost',
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
