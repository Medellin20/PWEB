const axios = require("axios");
const responses = require("../helpers/api_responses");
const CryptoModel = require('../models/crypto_model').CryptoModel;

const cryptoApiUrl = "https://api.coingecko.com/api/v3/coins/markets";
const vsCurrency = "eur";
const order = "market_cap_desc";
const perPage = 50;
const page = 1;
const sparkline = false;

exports.Initiatecryptos = async (req, res) => {
  try {
    await CryptoModel.deleteMany({});
    const response = await axios.get(cryptoApiUrl, {
      params: {
        vs_currency: vsCurrency,
        order: order,
        per_page: perPage,
        page: page,
        sparkline: sparkline,
      },
    });

    const relevantCryptos = response.data.map(crypto => ({
      name: crypto.name,
      symbol: crypto.symbol,
      image: crypto.image,
    }));
    
    const savedCryptos = await CryptoModel.insertMany(relevantCryptos);

    return responses.successData(res, "Crypto", savedCryptos);
  } catch (error) {
    return responses.error(res, error);
  }
};


exports.cryptos = async (req, res) => {
  try {
    const response = await axios.get(cryptoApiUrl, {
      params: {
        vs_currency: vsCurrency,
        order: order,
        per_page: perPage,
        page: page,
        sparkline: sparkline,
      },
    });

    return responses.successData(res, "Crypto", response.data);
  } catch (error) {
    return responses.error(res, error);
  }
};

exports.cryptosfilt = async (req, res) => {
  try {
    const responseFromAPI = await axios.get(cryptoApiUrl, {
      params: {
        vs_currency: vsCurrency,
        order: order,
        per_page: perPage,
        page: page,
        sparkline: sparkline,
      },
    });

    const cryptosFromAPI = responseFromAPI.data;

    const cryptosFromDB = await CryptoModel.find({});

    const cryptoNamesFromDB = cryptosFromDB.map(crypto => crypto.name);

    const filteredCryptos = cryptosFromAPI.filter(apiCrypto => cryptoNamesFromDB.includes(apiCrypto.name));

    return responses.successData(res, 'Filtered Cryptos', filteredCryptos);
  } catch (error) {
    return responses.error(res, error);
  }
};
