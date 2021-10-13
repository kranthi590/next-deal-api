const _ = require('lodash');

const transformRequest = ({
  addressLine1,
  addressLine2,
  addressLine3,
  communeId,
  regionId,
  countryId,
  emailId,
  phoneNumber1,
  phoneNumber2,
  additionalData,
} = {}) => {
  const address = {
    address_line1: addressLine1,
    address_line2: addressLine2,
    address_line3: addressLine3,
    commune_id: communeId,
    region_id: regionId,
    country_id: countryId,
    email_id: emailId,
    phone_number1: phoneNumber1,
    phone_number2: phoneNumber2,
    additional_data: additionalData,
  };
  return _.pickBy(address, _.identity);
};

module.exports = transformRequest;
