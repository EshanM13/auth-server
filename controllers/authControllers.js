const CustomError = require('../errors/Errors');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const registerUser = async(req,res)=>{
    try{
        const {email, password, username} = req.body;
        if (!email || !password || !username){
            throw new CustomError('Please enter all 3 mandatory values', 400);
        }
        isUniqueUser(email, username);
    const hashedPassword = await bcrypt.hash(password, 10);

    await db('users').insert({username, email, password: hashedPassword });
    res.status(201).json({ status: 'Success', message: 'User registered successfully' }); 
    }
    catch(err){
        return res.status(err.statusCode || 500).json({
            status: 'Failed',
            message: err.message || 'Internal Server Error'
        });
    }
};

const loginUser = async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            throw new CustomError('Please enter email and password to login', 400);
        }  
        userExists(email);
        isCorrectPassword(password, userExists.password);
        const token = generateToken(userExists);

        return res.status(200).json({ status: 'Success', message: 'User authenticated',
            token: token
        })
    }
    catch(err){
        return res.status(err.statusCode || 500).json({ status: 'Failed', 
            message: err.message || 'Internal server error'
        })
    }
};

async function isUniqueUser(email, username){
    const existingUser = await db('users').where({ email }).orWhere({ username }).first();
    if (existingUser) {
        if (existingUser.email === email) {
          throw new CustomError('User with the same email already exists', 400);
        }
        if (existingUser.username === username) {
          throw new CustomError('Username already taken. Please choose a unique value', 400);
        }
      }
}

async function userExists(email){
    const userExists = await db('users')
        .where({email}).first();

        if(!userExists){
            throw new CustomError('Invalid credentials', 400);
        }
}

async function isCorrectPassword(reqPassword, userPassword){
    const passwordCorrect = await bcrypt.compare(reqPassword, userPassword);
        if (!passwordCorrect) {
            throw new CustomError('Invalid credentials', 400);
        }
}

async function generateToken(userDetails) {
    return jwt.sign({id: userDetails.id, email: userDetails.email}, 
        config.SECRET_TOKEN_KEY, 
        {expiresIn: '1h'}
    )
}

module.exports = {
    registerUser, loginUser
};