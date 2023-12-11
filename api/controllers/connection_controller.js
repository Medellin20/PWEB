const UserModel = require("../models/user_model").UserModel;
const bcrypt = require("bcrypt");
const responses = require("../helpers/api_responses");
const auth = require("../utils/auth");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


class User {
  constructor(data) {
    this.id = data._id;
    this.avatar = data.avatar;
    this.lastname = data.lastname;
    this.firstname = data.firstname;
    this.username = data.username;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
    this.articles = data.articles;
    this.cryptos = data.cryptos;
  }
}

exports.register = async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({
            $or: [{ email: req.body.email }, { username: req.body.username }],
        });

        if (existingUser) {
            return responses.unauthorized(res, "The username or the email already exists");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new UserModel({
            avatar: null,
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            status: "active",
            articles: req.body.articles,
            cryptos: req.body.cryptos,
        });

        await newUser.save();

        const userCreated = new User(newUser);
        return responses.successData(res, "Successfully create this user", userCreated);
    } catch (err) {
        return responses.error(res, err);
    }
};

exports.login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return responses.unauthorized(res, "Invalid email or password");
    }
    
    if (user.status === "unactive") {
      return responses.unauthorized(res, "Account inactive. Contact your Administrator");
    }
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if (validPassword) {
      const data = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      const token = auth.gen_jwt_token(data);
      
      return responses.successData(res, "Successfully login", { token });
    } else {
      return responses.unauthorized(res, "Invalid email or password");
    }
  } catch (err) {
    return responses.error(res, err);
  }
};

//Google authentication

passport.use(new GoogleStrategy({
  clientID: '327250990886-67r7thqu82co3ddv27939jp47bk2c8gg.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/api/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
  UserModel.findOne({ email: profile.emails[0].value }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (user) {
      return done(null, user);
    } else {
      // If the user doesn't exist in your system, you can choose not to create a new user
      // You can log a message or handle it in a way that suits your application
      console.log(profile)
      console.log("User not found in the system:", profile.emails[0].value);
      return done(null, false); // Indicate that authentication failed
    }
  });
}));

// Serialize and deserialize user functions (modify according to your User model)
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => done(err, user));
});

// ... (other code)

// Function for Google login
exports.googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Callback route for Google login
exports.googleLoginCallback = passport.authenticate('google', {
   // Redirect to login page on failure
}), (req, res) => {
  // Successful Google login
  req.logout()
  const data = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
  };

  const token = auth.gen_jwt_token(data);

  return responses.successData(res, "Successfully login with Google", { token });
};
