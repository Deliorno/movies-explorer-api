// http://localhost:3000/users
const mongoose = require('mongoose');

// подключаемся к серверу mongo
const {MONGO_URL} = require('./config');
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

require('dotenv').config();
const { PORT = 3005 } = process.env;


const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const express = require('express');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes')
const { NotFoundError } = require('./errors/errors');
// const crypto = require('crypto'); // экспортируем crypto

// console.log(JWT_SECRET)

const app = express();

const allowedCors = [
  'http://localhost:3000'
];

app.use(
  cors({
    origin: allowedCors
    // credentials:true,
  })
);

app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.use('*', (req, res, next) => {
  throw new NotFoundError('Обращение по неизвестному адресу');
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  // console.log(err.name, err.message)
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
