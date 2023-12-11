const DB = require("../database").db_conn

const cryptoSchema = DB.Schema({
  name: {type: String,required: true,},
  symbol: {type: String,required: true,unique: true,},
  image: {type: String,required: true,},
});

exports.CryptoModel = DB.model('Crypto', cryptoSchema);

 ;