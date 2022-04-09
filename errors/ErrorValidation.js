class ErrorValidation extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorValidation';
    this.statusCode = 400;
  }
}

module.exports = ErrorValidation;
