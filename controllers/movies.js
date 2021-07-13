const Movie = require('../models/movie');
const { NotFoundError, ForbiddenRequest } = require('../errors/errors');

function errHandler(err, req, res, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    err.statusCode = 409;
    err.message = 'Такой пользователь уже существует';
  } else if (err.name === 'CastError' || err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля';
  }
}

module.exports.getMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .populate('user')
    .then((Movie) => res.send({ data: Movie }))
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.deleteMovies = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((Movie) => {
      if (Movie) {
        if (Movie.owner == req.user._id) {
          Movie.remove();
          return res.send({ data: Movie });
        } else {
          throw new ForbiddenRequest('Фильм не из вашей коллекции =Р');
        }
      }
      throw new NotFoundError('Фильм не найден');
    })
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};

module.exports.createMovies = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, thumbnail, movieId, nameRU, nameEN } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailer, thumbnail, owner: req.user._id, movieId, nameRU, nameEN }) //owner: req.user._id
    .then((Movie) => res.send({ data: Movie }))
    .catch((err) => {
      errHandler(err);
      next(err);
    });
};