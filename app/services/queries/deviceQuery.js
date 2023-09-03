const moment = require("moment");
const {Devices} = require("../../context/context");

const deviceQuery = {};

deviceQuery.getDeviceReference = async(reference)=> {
    let refDivice;
    try{
        refDivice = await Devices.findOne({ where: {reference: reference} });
        return (refDivice === null) ? console.log('Not found!') : refDivice;
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.findDivByIduser = async(id) => {
    let userId;
    userId = await Devices.findAll({ where: {id_user: id} });
    return (userId === null) ? console.log('Not found') : userId;
};

deviceQuery.add_device = async(dataDevice, id) =>{
    let add;
    try{
        add = await Devices.build({
            name: dataDevice.name,
            reference: dataDevice.reference,
            id_user: id,
            register_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
    await add.save();
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.delete_device = async(id) =>{
    let deleteDiv;
    try{
        deleteDiv = await Devices.destroy({ where: {id: id} });
        return (deleteDiv) ? console.log('Not found!') : deleteDiv;
    }catch(err){
        throw new Error(err);
    }
};

module.exports = deviceQuery;