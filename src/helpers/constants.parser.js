const mapObjToRegEx = (mapObj) => {
  const mapObjArr = Object.keys(mapObj);
  return mapObjArr.join('|');
};

const constantsParser = (string, mapObj) => {
  const regEx = new RegExp(mapObjToRegEx(mapObj), 'gi');
  return string.replace(regEx, (matched) => mapObj[matched]);
};

module.exports = constantsParser;
