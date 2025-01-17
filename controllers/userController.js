const db = require('../database/db');
const CustomError = require('../errors/Errors');
const {userExists} = require('./authControllers');


const editUser = async(req,res)=>{
    try{
        const reqUserId = req.params.userId;
        await userExists(null, reqUserId);
        await checkValidBody(req.body);
        const opts = req.body;
        const query = getQuery(reqUserId, opts);
        await query;
        const updatedUser = await db('users')
            .where({id: reqUserId}).first();
        return res.status(200).json({
            status: 'Success',
            message: 'User updated successfully',
            data: updatedUser
        })
    }
    catch(err){
        next(err);
    }
}

const getAllUsers = async(req,res)=>{
    try{
        const usersList = await db('users');
        return res.status(200).json({
            status: 'success',
            data: usersList
        })
    }
    catch(err){
        next(err);
    }
}

const getUserDetails = async(req,res)=>{
    try{
        const reqUserId = req.params.userId;
        const userDetail = await db('users')
            .where({id: reqUserId}).first();

        return res.status(200).json({
            status: 'Success',
            message: userDetail
        })
    }
    catch(err){
        next(err);
    }
}

async function getQuery(userId, opts){
    const {username, password} = opts;
    let updateFields = {};
    if(password){
        updateFields.password = password;
    }
    if(username){
        updateFields.username = username;
    }
    if(Object.keys(updateFields).length > 0){
        return db('users').where({ id: userId }).update(updateFields);
    }
    else
        return null;
}

async function checkValidBody(reqBody){
    if( !(Object.keys(reqBody).length > 0)){
        throw new CustomError('No data to update', 400);
    }
    return ;
}



module.exports = {editUser, getAllUsers, getUserDetails};