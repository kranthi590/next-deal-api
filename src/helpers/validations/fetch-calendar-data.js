const Joi = require('joi');

const calendarDataSchema = Joi.object()
  .keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  })
  .unknown();

module.exports = { calendarDataSchema };
