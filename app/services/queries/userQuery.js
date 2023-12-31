const bcrypt = require("bcryptjs");
const moment = require("moment");
const {Users, Devices} = require("../../context/context");
const utils = require("../../utils/utils");

const userQuery = {};

userQuery.getUserByEmail = async(email) => {
    let user;
    try{
        user = await Users.findOne({ where: {email:email} });
        return (user === null) ? console.log('Not found!') : user;
    }catch(err){
        throw new Error
    }
};

userQuery.addUser = async(dataUser) => {
    let add;
    try{
        add = await Users.build({
        name: dataUser.name,
        surname: dataUser.surname,
        email: dataUser.email,
        password: await bcrypt.hash(dataUser.password, 8),
        registerDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    await add.save();
    }catch(err){
        throw new Error(err);
    }
};

userQuery.getUserById = async(id) => {
    let userId;
    try{
        userId= await Users.findOne({ where : {id: id} });
        return (userId === null) ? console.log('Not found!') : userId;
    }catch(err){
        throw new Error(err);
    };
};

userQuery.deleteUser = async (id, activo) =>{
    let deleteUser;
    try{
        deleteUser = await Users.update({
            activo:activo,
        }, 
        {where:{id:id}});
        deleteUser = await utils.removeUndefinedKeys(deleteUser);
    }catch(err){
        throw new Error(err);
    }
};

userQuery.deleteDevForUser = async (id, activo) =>{
    let deleteUser;
    try{
        deleteUser = await Devices.update({
            activo:activo,
        }, 
        {where:{id:id}});
        deleteUser = await utils.removeUndefinedKeys(deleteUser);
    }catch(err){
        throw new Error(err);
    }
};



userQuery.updateUser = async (id, userData) => {
    let update;
    try{
        update= await Users.update({
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            password: userData.password? bcrypt.hash(userData.password, 8): undefined,
            modificationDate: moment().format("YYYY-MM-DD HH:mm:ss")
            },
            {where:{ id:id }});
        update = await utils.removeUndefinedKeys(update);
    }catch(err){
        throw new Error(err);
    }
};


module.exports= userQuery;