const CustomError = require('../errors/Errors');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const registerUser = async(req,res, next)=>{
    try{
        const {email, password, username} = req.body;
        if (!email || !password || !username){
            throw new CustomError('Please enter all 3 mandatory values', 400);
        }
        await isUniqueUser(email, username);
    const hashedPassword = await bcrypt.hash(password, 10);

    await db('users').insert({username, email, password: hashedPassword });
    return res.status(201).json({ status: 'Success', message: 'User registered successfully' }); 
    }
    catch(err){
        next(err);
    }
};

const loginUser = async(req,res, next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            throw new CustomError('Please enter email and password to login', 400);
        }  
        const existingUser = await userExists(email, null);
        await isCorrectPassword(password, existingUser.password);
        const token = await generateToken(existingUser);
        return res.status(200).json({ status: 'Success', message: 'User authenticated',
            token: token
        })
    }
    catch(err){
        next(err);
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

async function userExists(email, userId){
    let userExists;
    if(!userId){
        userExists = await db('users')
        .where({email}).first();
    }
    if(!email){
        userExists = await db('users')
        .where({id: userId}).first();
    }
    if(!userExists){
        throw new CustomError('Invalid user details', 400);
    } 
    return userExists;
}

async function isCorrectPassword(reqPassword, userPassword){
    const passwordCorrect = await bcrypt.compare(reqPassword, userPassword);
        if (!passwordCorrect) {
            throw new CustomError('Invalid credentials', 400);
        }
}

async function generateToken(existingUser) {
    return jwt.sign({id: existingUser.id, email: existingUser.email}, 
        config.SECRET_TOKEN_KEY, 
        {expiresIn: '1h'}
    )
}

module.exports = {
    registerUser, loginUser, userExists
};