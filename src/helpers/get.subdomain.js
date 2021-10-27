const { parseDomain } = require('parse-domain');
const _ = require('lodash');

const ignoredSubDomains = _.get(process.env, 'IGNORED_SUB_DOMAINS', []).split(',');

const getSubDomainFromRequest = (req) => {
  const parseResult = parseDomain(req.get('origin').replace('https://', ''));
  const subDomain = _.get(parseResult, 'labels[0]', null);
  if (!subDomain || _.includes(ignoredSubDomains, subDomain)) {
    return null;
  }
  return subDomain;
};

module.exports = {
  getSubDomainFromRequest,
};
