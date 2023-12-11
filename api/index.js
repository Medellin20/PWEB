const express = require('express');
const app = express()
require('dotenv').config()
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');


const usersRouter = require('./routes/users');
const connectionRouter = require('./routes/connection');
const anonymRouter = require('./routes/anonym')
const articlesRouter = require('./routes/articles')
const cryptoRouter = require('./routes/cryptos')

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth' , connectionRouter)
app.use('/users', usersRouter);
app.use('/anonym', anonymRouter)
app.use('/articles' , articlesRouter)
app.use('/cryptos' , cryptoRouter)


module.exports = app;


// listening port
const PORT =  process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

