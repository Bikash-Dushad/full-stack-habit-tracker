const logger = require("./winston");

const handleError = (res, error, api) => {
  if (error.name === "ValidationError") {
    const validationErrors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));

    if (validationErrors.length !== 0) {
      validationErrors.forEach((err) => {
        logger.error(
          `[${api}] Validation error on '${err.field}': ${err.message}`
        );
      });
    }

    return res.status(200).json({
      message: "Validation error",
      responseCode: 400,
      errors: validationErrors,
    });
  } else if (error.name === "Error") {
    logger.error(`[${api}] Unexpected error: ${error.message}`);
    console.log(error);
    return res.status(200).json({
      responseCode: 400,
      message: error.message,
    });
  }

  // Log unexpected error
  logger.error(`[${api}] Unexpected error: ${error.message}`);

  console.log(error);

  return res.status(500).json({
    responseCode: 500,
    message: "server error",
    error: error.message,
  });
};

module.exports = { handleError };
