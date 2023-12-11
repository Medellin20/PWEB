const DB = require("../database").db_conn

const AnonymSchema = DB.Schema(
  {
    identifier: { type: String, required: true, unique: true},
    maxCryptView: { type: String, required: true},
    maxArticleView: { type: String, required: true},
  },
 
);
exports.AnonymModel = DB.model("Anonym" , AnonymSchema)