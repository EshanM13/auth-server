const express = require('express');
const app = express();
const config = require('./config/config.json');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const logRequest = require('./middlewares/logger');
const passport = require('passport');


const PORT = config.PORT || 3003;

app.use(logRequest);
app.use(passport.initialize());
app.use(express.json());
app.use('/v1/auth', authRoutes);
app.use('/v1/user', userRoutes);

app.all('/*', (req,res)=>{
    return res.status(404).json({
        status: 'Failed',
        message: 'Invalid route'
    })
});
  

app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`)
});