const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/errors');

const { JWT_SECRET = 'super secret key' } = process.env;

function errHandler(err, req, res, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    err.statusCode = 409;
    err.message = 'Такой пользователь уже существует';
  } else if (err.name === 'CastError' || err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = 'Переданы некорректные данные в методы создания или обновления пользователя';
  }
}

module.exports.getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '30d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.createUsers = (req, res, next) => {
  const { email, password, name } = req.body;
  // console.log(req.body);
  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email,
        password: hash, // записываем хеш в базу
        name
      }))
      .then((user) => res.send({ email: user.email, password, name: user.name }))
      .catch((err) => {
        errHandler(err);
        next(err);
      });
  } else {
    res.send('Введите корректный email');
  }
};

module.exports.patchInfo = (req, res, next) => {
  const { name, email } = req.body;
  if (validator.isEmail(email)) {
    User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
      .then((user) => {
        if (user) {
          return res.send({ data: user });
        }
        throw new NotFoundError('Нет пользователя с таким id');
      })
      .catch((err) => {
        errHandler(err);
        next(err);
      });
  } else {
    res.send('Введите корректный email');
  }
};
