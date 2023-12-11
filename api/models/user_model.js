const DB = require("../database").db_conn

const UserSchema = DB.Schema(
  {
    avatar: { type: String},lastname: { type: String, required: true, },
    firstname: { type: String, required: true, },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, timestapms: true, unique: true },
    password: { type: String, min: [8 , "Must be 8 character, got {VALUE}"]},
    role: {  type: String,  require: true,enum:{  values: ["admin" , "user"],  message: "The role {VALUE} not exist"}  },
    status: {  type: String, enum:{  values: ["active" , "unactive"],  message: "The status {VALUE} not exist"}  },
    favCryptos: {type: Array},
    keywords: {type: Array},
    createdat: { type: String},
  },
 
);
exports.UserModel = DB.model("User" , UserSchema)
