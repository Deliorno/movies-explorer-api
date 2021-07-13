require('dotenv').config();
const {MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb'} = process.env;
module.exports = {MONGO_URL};