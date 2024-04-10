const boom = require("@hapi/boom");

function signatureHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data);

    if (error) {
      next(boom.badRequest(error));
    }

    next();
  };
}

module.exports = signatureHandler;
