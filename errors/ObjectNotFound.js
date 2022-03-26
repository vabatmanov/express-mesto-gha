class ObjectNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'ObjectNotFound';
    this.statusCode = 404;
  }
}

module.exports = ObjectNotFound;
