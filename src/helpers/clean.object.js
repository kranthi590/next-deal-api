const cleanObject = (obj) => {
  const acc = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined) {
      acc[key] = obj[key];
    }
  });
  return acc;
};

module.exports = cleanObject;
