// http://localhost:3000/users
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { MONGO_URL } = require('./config');
// подключаемся к серверу mongo

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

require('dotenv').config();

const { PORT = 3005 } = process.env;

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const { NotFoundError } = require('./errors/errors');
// const crypto = require('crypto'); // экспортируем crypto

// console.log(JWT_SECRET)

const app = express();

const allowedCors = [
  'localhost:3000',
  'http://deliorno.your-movies.nomoredomains.club',
  'https://deliorno.your-movies.nomoredomains.club'
];

app.use(function(req, res, next) {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых 
  //console.log(origin)
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE"; 
  console.log(method)
  console.log(req.headers['access-control-request-headers'])
  // сохраняем список заголовков исходного запроса 
  const requestHeaders = req.headers['access-control-request-headers']; 
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
      // разрешаем кросс-доменные запросы любых типов (по умолчанию) 
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      // разрешаем кросс-доменные запросы с этими заголовками
      res.header('Access-Control-Allow-Headers', requestHeaders);
      // завершаем обработку запроса и возвращаем результат клиенту
      return res.end();
  }
  if (method.includes(DEFAULT_ALLOWED_METHODS)){
    // разрешаем кросс-доменные запросы любых типов (по умолчанию) 
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  next();
});

// app.use(
//   cors({
//     origin: allowedCors,
//     credentials: true
//   })
// );

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
