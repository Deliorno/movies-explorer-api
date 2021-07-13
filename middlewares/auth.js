const jwt = require('jsonwebtoken');
const { AuthErr } = require('../errors/errors');

const { JWT_SECRET = 'super secret key' } = process.env;

function errHandler(err, req, res, next) {
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Передан некорректный токен';
  } else if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Срок действия токена истек';
  }
}

module.exports = (req, res, next) => {
// достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthErr('Необходима авторизация');
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    errHandler(err);
    next(err);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
