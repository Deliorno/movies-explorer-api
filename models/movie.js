const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const { LogInErr } = require('../errors/errors');

const MovieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        return (!!v.match(regex));
      },
      message: 'Неверная ссылка на изображение'
    }
  },
  trailer: {
    type: String,
    validate: {
      validator(v) {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        return (!!v.match(regex));
      },
      message: 'Неверная ссылка на трейлер'
    }
  },
  thumbnail: {
    type: String,
    validate: {
      validator(v) {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        return (!!v.match(regex));
      },
      message: 'Неверная ссылка на изображение'
    }
  },
  owner: {
    type: String,
    required: true
  },
  movieId: {
    type: String,
    required: true
  },
  nameRU: {
    type: String,
    required: true
  },
  nameEN: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('movie', MovieSchema);
