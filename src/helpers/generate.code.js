const generateCode = (name) => name
  .toString()
  .toLowerCase()
  .replace(/'/g, "'")
  .replace(/\s+/g, '-') // Replace spaces with -
  .replace(/[^\u0100-\uFFFF\w\\-]/g, '-') // Remove all non-word chars ( fix for UTF-8 chars )
  .replace(/\\-\\-+/g, '-') // Replace multiple - with single -
  .replace(/^-+/, '') // Trim - from start of text
  .replace(/-+$/, ''); // Trim - from end of text

module.exports = generateCode;
