const axios = require("axios");
const responses = require("../helpers/api_responses");

const articlesApiUrl = "https://newsapi.org/v2/everything";
const apiKey = "0aff53f2dc4b4dafa7d1c852d63bf222";

exports.articles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return responses.error(res, "Missing 'q' parameter in the request.");
    }

    const response = await axios.get(articlesApiUrl, {
      params: {
        q: q,
        searchIn: "title",
        // domains: "wired.com",
        from: "2023",
        sortBy: "popularity",
        apiKey: apiKey,
      },
    });

    return responses.successData(res, "Articles", response.data.articles);
  } catch (error) {
    return responses.error(res, error);
  }
};
