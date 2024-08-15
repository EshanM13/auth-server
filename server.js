const express = require('express');
const app = express();
const config = require('./config/config.json');
const authRoutes = require('./routes/auth_routes');
const logRequest = require('./middlewares/logger');
const passport = require('passport');


const PORT = config.PORT || 3003;

app.use(logRequest);
app.use(passport.initialize());
app.use(express.json());
app.use('/v1/users', authRoutes);
  

app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`)
});