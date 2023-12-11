const UserModel = require("../models/user_model").UserModel
const { use } = require("passport");
const responses = require("../helpers/api_responses")
const bcrypt = require("bcrypt")

function user_ (data){
    this.id = data._id;
    this.avatar = data.avatar;
    this.lastname = data.lastname;
    this.firstname = data.firstname,
    this.username = data.username;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
    this.favCryptos = data.favCryptos;
    this.keywords = data.keywords;
}

exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return responses.unauthorized(res, "User not found");
    }
    const validOldPassword = await bcrypt.compare(oldPassword, user.password);

    if (!validOldPassword) {
      return responses.unauthorized(res, "Invalid old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return responses.success(res, "Password updated successfully");
  } catch (err) {
    return responses.error(res, err);
  }
};

// Controller function to add a cryptocurrency to favorites
exports.addCryptoToFavorites = async (req, res) => {
  try {
    console.log(req.body)
    const { username, cryptoname,symbol} = req.body;
    console.log(cryptoname)
    console.log(symbol)
    console.log(username)
    const user = await UserModel.findOne({username});
    console.log(symbol);
    if (!user) {
      return responses.notFound(res, 'User not found');
    }

    // Check if the cryptocurrency is already in favorites
    const existingCrypto = user.favCryptos.find((crypto) => crypto.cryptoname === cryptoname);

    if (existingCrypto) {
      return responses.notFound(res, 'Cryptocurrency already in favorites');
    }

    user.favCryptos.push({ cryptoname, symbol });
    await user.save();

    return responses.success(res, 'Cryptocurrency added to favorites successfully');
  } catch (error) {
    console.error(error);
    return responses.error(res, 'Internal Server Error');
  }
};

// Controller function to delete a cryptocurrency from favorites
exports.deleteCryptoFromFavorites = async (req, res) => {
  try {
    const {username, cryptoname } = req.body;

    const user = await UserModel.findOne({username});

    if (!user) {
      return responses.notFound(res, 'User not found');
    }
    
    console.log(user.favCryptos.length)
    if (user.favCryptos.length == 0) {return responses.notFound(res, 'You have no favory right now')}
       
    const existingCryptoIndex = user.favCryptos.findIndex((crypto) => crypto.cryptoname === cryptoname);

    if (existingCryptoIndex === -1) {
      return responses.notFound(res, 'Cryptocurrency not found in favorites');
    }

    user.favCryptos.splice(existingCryptoIndex, 1);
    await user.save();

    return responses.success(res, 'Cryptocurrency deleted from favorites successfully');
  } catch (error) {
    console.error(error);
    return responses.error(res, 'Internal Server Error');
  }
};


exports.userSelect = (req , res) => {
     try{
        
        UserModel.findOne({username: req.query.username} , (err , user) => {
            if (user !== null){
                if (err) return responses.error(res , err)
                let userCreated = new user_(user)
                return responses.successData(res , "User found" , userCreated)

            }else{
                return responses.notFound(res , "User doesn't exit" , {})
            }
        })
     }catch (err) {
        return responses.error(res , err)
     }
}


exports.userList = (req , res) => {
    try{
        
        let userDisplay = []
        UserModel.find({} , (err, users) => {
            if (err) return responses.error(res , err)
            if (users.length > 0){
                for (let user of users){
                    let user_d = new user_(user)
                    userDisplay.push(user_d)
                }
                responses.successData(res , "users" , userDisplay)
            }else{
                return responses.successData(res , "users is empty" , [])
            }
        })
    }catch(err){
        return responses.error(res , err)
    }
}


exports.userDelete = (req , res) => {
    try{
        if (req.data.role !== "admin") return responses.unauthorized(res , "You are not authorized to delete this user")
        UserModel.findById(req.params.id , function (err , foundUser){
            if (err) return responses.error(res , err)
            if (foundUser === null){
                return responses.notFound(res , "User with this id doesn't exist")
            }else{
                UserModel.findByIdAndRemove(req.params.id, function (err){
                    if (err) return responses.error(res , err)
                    return responses.success(res , "Successfully delete the user")
                })
            }
        })
    }catch(err){
        return responses.error(res , err)
    }
}