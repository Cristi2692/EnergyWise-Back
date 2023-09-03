const moment = require("moment");
const {Devices, Devices_consumption} = require("../../context/context");

const deviceQuery = {};

deviceQuery.getDeviceReference = async(reference)=> {
    let refDevice;
    try{
        refDevice = await Devices.findOne({ where: {reference: reference} });
        return (refDevice === null) ? console.log('Not found!') : refDevice;
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

deviceQuery.consumption = async(id, lastOn, lastOff) =>{
    let deviceConsumption;
    try{
        deviceConsumption = await Devices_consumption.build({
            id_devices: id,
            lastOn: lastOn,
            lastOff: lastOff,
            date:moment().format("YYYY-DD-MM")
        });
        await deviceConsumption.save();
    }catch(err){
        throw new Error(err);
    }
};

deviceQuery.getIdDevice = async(id)=> {
    let device;
    try{
        device = await Devices_consumption.findOne({ where: { id_devices: id } });
        return (device === null) ? console.log('Not found!') : device;
    }catch(err){
        throw new Error(err);
    }
};

module.exports = deviceQuery;