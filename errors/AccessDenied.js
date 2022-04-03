class AccessDenied extends Error {
  constructor(message  = 'Нет доступа') {
    super(message);
    this.name = 'AccessDenied';
    this.statusCode = 403;
  }
}

module.exports = AccessDenied;