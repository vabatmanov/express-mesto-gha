class ErrorAccessDenied extends Error {
  constructor(message = 'Нет доступа') {
    super(message);
    this.name = 'ErrorAccessDenied';
    this.statusCode = 403;
  }
}

module.exports = ErrorAccessDenied;
